package services

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"time"

	"go.uber.org/zap"
)

// TrivyService handles Trivy security scanning
type TrivyService struct {
	Logger *zap.Logger
}

// TrivyVulnerability represents a single vulnerability
type TrivyVulnerability struct {
	VulnerabilityID  string   `json:"VulnerabilityID"`
	PkgName          string   `json:"PkgName"`
	InstalledVersion string   `json:"InstalledVersion"`
	FixedVersion     string   `json:"FixedVersion"`
	Severity         string   `json:"Severity"`
	Title            string   `json:"Title"`
	Description      string   `json:"Description"`
	References       []string `json:"References"`
}

// TrivyResult represents scan results
type TrivyResult struct {
	Target          string               `json:"Target"`
	Class           string               `json:"Class"`
	Type            string               `json:"Type"`
	Vulnerabilities []TrivyVulnerability `json:"Vulnerabilities"`
}

// TrivyScanReport represents the complete scan report
type TrivyScanReport struct {
	SchemaVersion int           `json:"SchemaVersion"`
	ArtifactName  string        `json:"ArtifactName"`
	ArtifactType  string        `json:"ArtifactType"`
	Results       []TrivyResult `json:"Results"`
	Metadata      struct {
		OS struct {
			Family string `json:"Family"`
			Name   string `json:"Name"`
		} `json:"OS"`
		ImageID     string   `json:"ImageID"`
		DiffIDs     []string `json:"DiffIDs"`
		RepoTags    []string `json:"RepoTags"`
		RepoDigests []string `json:"RepoDigests"`
		ImageConfig struct {
			Architecture string `json:"architecture"`
			Created      string `json:"created"`
			OS           string `json:"os"`
		} `json:"ImageConfig"`
	} `json:"Metadata"`
}

// ScanSummary provides a summary of scan results
type ScanSummary struct {
	Success       bool                 `json:"success"`
	Target        string              `json:"target"`
	ScanType      string              `json:"scanType"`
	TotalVulns    int                 `json:"totalVulnerabilities"`
	Critical      int                 `json:"critical"`
	High          int                 `json:"high"`
	Medium        int                 `json:"medium"`
	Low           int                 `json:"low"`
	Unknown       int                 `json:"unknown"`
	Report        *TrivyScanReport    `json:"report,omitempty"`
	Message       string              `json:"message"`
	Timestamp     time.Time           `json:"timestamp"`
}

// NewTrivyService creates a new Trivy service instance
func NewTrivyService(logger *zap.Logger) *TrivyService {
	return &TrivyService{
		Logger: logger,
	}
}

// ScanFilesystem scans a filesystem/directory for vulnerabilities
func (t *TrivyService) ScanFilesystem(path string) (*ScanSummary, error) {
	t.Logger.Info("Starting Trivy filesystem scan", zap.String("path", path))

	// Check if trivy is available
	if _, err := exec.LookPath("trivy"); err != nil {
		return &ScanSummary{
			Success:   false,
			Target:    path,
			ScanType:  "filesystem",
			Message:   "Trivy not found. Please install Trivy security scanner",
			Timestamp: time.Now(),
		}, nil
	}

	cmd := exec.Command("trivy", "fs", "--format", "json", "--quiet", path)
	output, err := cmd.Output()
	if err != nil {
		t.Logger.Error("Trivy filesystem scan failed", zap.Error(err))
		return &ScanSummary{
			Success:   false,
			Target:    path,
			ScanType:  "filesystem",
			Message:   fmt.Sprintf("Scan failed: %v", err),
			Timestamp: time.Now(),
		}, nil
	}

	return t.parseResults(output, path, "filesystem")
}

// ScanImage scans a Docker image for vulnerabilities
func (t *TrivyService) ScanImage(imageName string) (*ScanSummary, error) {
	t.Logger.Info("Starting Trivy image scan", zap.String("image", imageName))

	// Check if trivy is available
	if _, err := exec.LookPath("trivy"); err != nil {
		return &ScanSummary{
			Success:   false,
			Target:    imageName,
			ScanType:  "image",
			Message:   "Trivy not found. Please install Trivy security scanner",
			Timestamp: time.Now(),
		}, nil
	}

	cmd := exec.Command("trivy", "image", "--format", "json", "--quiet", imageName)
	output, err := cmd.Output()
	if err != nil {
		t.Logger.Error("Trivy image scan failed", zap.Error(err))
		return &ScanSummary{
			Success:   false,
			Target:    imageName,
			ScanType:  "image",
			Message:   fmt.Sprintf("Scan failed: %v", err),
			Timestamp: time.Now(),
		}, nil
	}

	return t.parseResults(output, imageName, "image")
}

// ScanRepository scans a Git repository for vulnerabilities
func (t *TrivyService) ScanRepository(repoURL string) (*ScanSummary, error) {
	t.Logger.Info("Starting Trivy repository scan", zap.String("repo", repoURL))

	// Check if trivy is available
	if _, err := exec.LookPath("trivy"); err != nil {
		return &ScanSummary{
			Success:   false,
			Target:    repoURL,
			ScanType:  "repository",
			Message:   "Trivy not found. Please install Trivy security scanner",
			Timestamp: time.Now(),
		}, nil
	}

	cmd := exec.Command("trivy", "repo", "--format", "json", "--quiet", repoURL)
	output, err := cmd.Output()
	if err != nil {
		t.Logger.Error("Trivy repository scan failed", zap.Error(err))
		return &ScanSummary{
			Success:   false,
			Target:    repoURL,
			ScanType:  "repository",
			Message:   fmt.Sprintf("Scan failed: %v", err),
			Timestamp: time.Now(),
		}, nil
	}

	return t.parseResults(output, repoURL, "repository")
}

// ScanKubernetes scans Kubernetes manifests for misconfigurations
func (t *TrivyService) ScanKubernetes(manifestPath string) (*ScanSummary, error) {
	t.Logger.Info("Starting Trivy Kubernetes scan", zap.String("path", manifestPath))

	cmd := exec.Command("trivy", "config", "--format", "json", "--quiet", manifestPath)
	output, err := cmd.Output()
	if err != nil {
		t.Logger.Error("Trivy Kubernetes scan failed", zap.Error(err))
		return &ScanSummary{
			Success:   false,
			Target:    manifestPath,
			ScanType:  "kubernetes",
			Message:   fmt.Sprintf("Scan failed: %v", err),
			Timestamp: time.Now(),
		}, nil
	}

	return t.parseResults(output, manifestPath, "kubernetes")
}

// parseResults parses Trivy JSON output and creates a summary
func (t *TrivyService) parseResults(output []byte, target, scanType string) (*ScanSummary, error) {
	var report TrivyScanReport
	if err := json.Unmarshal(output, &report); err != nil {
		t.Logger.Error("Failed to parse Trivy results", zap.Error(err))
		return nil, err
	}

	summary := &ScanSummary{
		Success:   true,
		Target:    target,
		ScanType:  scanType,
		Report:    &report,
		Message:   "Scan completed successfully",
		Timestamp: time.Now(),
	}

	// Count vulnerabilities by severity
	for _, result := range report.Results {
		for _, vuln := range result.Vulnerabilities {
			summary.TotalVulns++
			switch vuln.Severity {
			case "CRITICAL":
				summary.Critical++
			case "HIGH":
				summary.High++
			case "MEDIUM":
				summary.Medium++
			case "LOW":
				summary.Low++
			default:
				summary.Unknown++
			}
		}
	}

	t.Logger.Info("Trivy scan completed",
		zap.String("target", target),
		zap.String("type", scanType),
		zap.Int("total_vulnerabilities", summary.TotalVulns),
		zap.Int("critical", summary.Critical),
		zap.Int("high", summary.High),
	)

	return summary, nil
}

// GetScanHistory returns a mock scan history (implement with database in production)
func (t *TrivyService) GetScanHistory(limit int) ([]ScanSummary, error) {
	// This would typically fetch from a database
	// For now, return mock data
	history := []ScanSummary{
		{
			Success:   true,
			Target:    "nginx:latest",
			ScanType:  "image",
			TotalVulns: 15,
			Critical:  2,
			High:      5,
			Medium:    6,
			Low:       2,
			Message:   "Scan completed successfully",
			Timestamp: time.Now().Add(-2 * time.Hour),
		},
		{
			Success:   true,
			Target:    "/app/src",
			ScanType:  "filesystem",
			TotalVulns: 8,
			Critical:  0,
			High:      2,
			Medium:    4,
			Low:       2,
			Message:   "Scan completed successfully",
			Timestamp: time.Now().Add(-6 * time.Hour),
		},
	}

	if limit > 0 && limit < len(history) {
		return history[:limit], nil
	}

	return history, nil
}