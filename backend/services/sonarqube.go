package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os/exec"
	"time"

	"go.uber.org/zap"
)

// SonarQubeService handles SonarQube integration
type SonarQubeService struct {
	BaseURL    string
	Token      string
	ProjectKey string
	Logger     *zap.Logger
}

// SonarQubeMetrics represents quality gate metrics
type SonarQubeMetrics struct {
	ProjectStatus struct {
		Status     string `json:"status"`
		Conditions []struct {
			Status         string `json:"status"`
			MetricKey      string `json:"metricKey"`
			Comparator     string `json:"comparator"`
			ErrorThreshold string `json:"errorThreshold"`
			ActualValue    string `json:"actualValue"`
		} `json:"conditions"`
	} `json:"projectStatus"`
}

// SonarQubeMeasures represents project measures
type SonarQubeMeasures struct {
	Component struct {
		Key      string `json:"key"`
		Name     string `json:"name"`
		Measures []struct {
			Metric string `json:"metric"`
			Value  string `json:"value"`
		} `json:"measures"`
	} `json:"component"`
}

// ScanResult represents the result of a SonarQube scan
type ScanResult struct {
	Success   bool                 `json:"success"`
	TaskID    string              `json:"taskId,omitempty"`
	Status    string              `json:"status"`
	Message   string              `json:"message"`
	Metrics   *SonarQubeMetrics   `json:"metrics,omitempty"`
	Measures  *SonarQubeMeasures  `json:"measures,omitempty"`
	Timestamp time.Time           `json:"timestamp"`
}

// NewSonarQubeService creates a new SonarQube service instance
func NewSonarQubeService(baseURL, token, projectKey string, logger *zap.Logger) *SonarQubeService {
	return &SonarQubeService{
		BaseURL:    baseURL,
		Token:      token,
		ProjectKey: projectKey,
		Logger:     logger,
	}
}

// TriggerScan initiates a SonarQube scan using sonar-scanner
func (s *SonarQubeService) TriggerScan(projectPath string) (*ScanResult, error) {
	s.Logger.Info("Starting SonarQube scan", zap.String("project", s.ProjectKey))

	// Check if sonar-scanner is available
	if _, err := exec.LookPath("sonar-scanner"); err != nil {
		return &ScanResult{
			Success:   false,
			Status:    "FAILED",
			Message:   "sonar-scanner not found. Please install SonarQube Scanner CLI",
			Timestamp: time.Now(),
		}, nil
	}

	// Prepare sonar-scanner command
	cmd := exec.Command("sonar-scanner",
		fmt.Sprintf("-Dsonar.projectKey=%s", s.ProjectKey),
		fmt.Sprintf("-Dsonar.sources=%s", projectPath),
		fmt.Sprintf("-Dsonar.host.url=%s", s.BaseURL),
		fmt.Sprintf("-Dsonar.login=%s", s.Token),
		"-Dsonar.qualitygate.wait=true",
	)

	// Execute scan
	output, err := cmd.CombinedOutput()
	if err != nil {
		s.Logger.Error("SonarQube scan failed", zap.Error(err), zap.String("output", string(output)))
		return &ScanResult{
			Success:   false,
			Status:    "FAILED",
			Message:   fmt.Sprintf("Scan failed: %v", err),
			Timestamp: time.Now(),
		}, nil
	}

	s.Logger.Info("SonarQube scan completed successfully")

	// Fetch metrics after successful scan
	metrics, err := s.GetQualityGateStatus()
	if err != nil {
		s.Logger.Warn("Failed to fetch quality gate status", zap.Error(err))
	}

	measures, err := s.GetProjectMeasures()
	if err != nil {
		s.Logger.Warn("Failed to fetch project measures", zap.Error(err))
	}

	return &ScanResult{
		Success:   true,
		Status:    "SUCCESS",
		Message:   "Scan completed successfully",
		Metrics:   metrics,
		Measures:  measures,
		Timestamp: time.Now(),
	}, nil
}

// GetQualityGateStatus fetches the quality gate status from SonarQube API
func (s *SonarQubeService) GetQualityGateStatus() (*SonarQubeMetrics, error) {
	url := fmt.Sprintf("%s/api/qualitygates/project_status?projectKey=%s", s.BaseURL, s.ProjectKey)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(s.Token, "")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var metrics SonarQubeMetrics
	if err := json.Unmarshal(body, &metrics); err != nil {
		return nil, err
	}

	return &metrics, nil
}

// GetProjectMeasures fetches project measures from SonarQube API
func (s *SonarQubeService) GetProjectMeasures() (*SonarQubeMeasures, error) {
	metrics := "ncloc,bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density"
	url := fmt.Sprintf("%s/api/measures/component?component=%s&metricKeys=%s", s.BaseURL, s.ProjectKey, metrics)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(s.Token, "")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var measures SonarQubeMeasures
	if err := json.Unmarshal(body, &measures); err != nil {
		return nil, err
	}

	return &measures, nil
}

// GetProjectIssues fetches project issues from SonarQube API
func (s *SonarQubeService) GetProjectIssues() (map[string]interface{}, error) {
	url := fmt.Sprintf("%s/api/issues/search?componentKeys=%s&ps=500", s.BaseURL, s.ProjectKey)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(s.Token, "")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var issues map[string]interface{}
	if err := json.Unmarshal(body, &issues); err != nil {
		return nil, err
	}

	return issues, nil
}