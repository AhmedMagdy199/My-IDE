package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"go.uber.org/zap"
)

// JenkinsService handles Jenkins CI/CD integration
type JenkinsService struct {
	BaseURL  string
	Username string
	Token    string
	Logger   *zap.Logger
}

// JenkinsJob represents a Jenkins job
type JenkinsJob struct {
	Name        string      `json:"name"`
	URL         string      `json:"url"`
	Color       string      `json:"color"`
	Buildable   bool        `json:"buildable"`
	LastBuild   *BuildInfo  `json:"lastBuild"`
	NextBuild   int         `json:"nextBuildNumber"`
	InQueue     bool        `json:"inQueue"`
	Description string      `json:"description"`
}

// BuildInfo represents build information
type BuildInfo struct {
	Number    int    `json:"number"`
	URL       string `json:"url"`
	Result    string `json:"result"`
	Building  bool   `json:"building"`
	Duration  int64  `json:"duration"`
	Timestamp int64  `json:"timestamp"`
	FullDisplayName string `json:"fullDisplayName"`
}

// BuildDetails represents detailed build information
type BuildDetails struct {
	Number      int                    `json:"number"`
	URL         string                 `json:"url"`
	Result      string                 `json:"result"`
	Building    bool                   `json:"building"`
	Duration    int64                  `json:"duration"`
	Timestamp   int64                  `json:"timestamp"`
	Description string                 `json:"description"`
	Actions     []map[string]interface{} `json:"actions"`
	ChangeSet   struct {
		Items []struct {
			Author struct {
				FullName string `json:"fullName"`
			} `json:"author"`
			Comment string `json:"comment"`
			Date    string `json:"date"`
		} `json:"items"`
	} `json:"changeSet"`
}

// QueueItem represents a queued build
type QueueItem struct {
	ID     int    `json:"id"`
	Task   struct {
		Name string `json:"name"`
		URL  string `json:"url"`
	} `json:"task"`
	Why        string `json:"why"`
	Blocked    bool   `json:"blocked"`
	Buildable  bool   `json:"buildable"`
	InQueueSince int64 `json:"inQueueSince"`
}

// JobTriggerResult represents the result of triggering a job
type JobTriggerResult struct {
	Success   bool   `json:"success"`
	Message   string `json:"message"`
	QueueID   int    `json:"queueId,omitempty"`
	JobName   string `json:"jobName"`
	Timestamp time.Time `json:"timestamp"`
}

// NewJenkinsService creates a new Jenkins service instance
func NewJenkinsService(baseURL, username, token string, logger *zap.Logger) *JenkinsService {
	return &JenkinsService{
		BaseURL:  baseURL,
		Username: username,
		Token:    token,
		Logger:   logger,
	}
}

// GetJobs retrieves all Jenkins jobs
func (j *JenkinsService) GetJobs() ([]JenkinsJob, error) {
	url := fmt.Sprintf("%s/api/json?tree=jobs[name,url,color,buildable,lastBuild[number,url,result,building,duration,timestamp,fullDisplayName],nextBuildNumber,inQueue,description]", j.BaseURL)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(j.Username, j.Token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		j.Logger.Error("Failed to fetch Jenkins jobs", zap.Error(err))
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Jenkins API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response struct {
		Jobs []JenkinsJob `json:"jobs"`
	}

	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}

	j.Logger.Info("Successfully fetched Jenkins jobs", zap.Int("count", len(response.Jobs)))
	return response.Jobs, nil
}

// TriggerJob triggers a Jenkins job build
func (j *JenkinsService) TriggerJob(jobName string, parameters map[string]string) (*JobTriggerResult, error) {
	j.Logger.Info("Triggering Jenkins job", zap.String("job", jobName))

	var url string
	var body io.Reader

	if len(parameters) > 0 {
		// Build with parameters
		url = fmt.Sprintf("%s/job/%s/buildWithParameters", j.BaseURL, jobName)

		// Convert parameters to form data
		formData := make(map[string]string)
		for k, v := range parameters {
			formData[k] = v
		}

		jsonData, err := json.Marshal(formData)
		if err != nil {
			return nil, err
		}
		body = bytes.NewBuffer(jsonData)
	} else {
		// Simple build
		url = fmt.Sprintf("%s/job/%s/build", j.BaseURL, jobName)
		body = nil
	}

	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(j.Username, j.Token)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		j.Logger.Error("Failed to trigger Jenkins job", zap.Error(err))
		return &JobTriggerResult{
			Success:   false,
			Message:   fmt.Sprintf("Failed to trigger job: %v", err),
			JobName:   jobName,
			Timestamp: time.Now(),
		}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return &JobTriggerResult{
			Success:   false,
			Message:   fmt.Sprintf("Job trigger failed with status: %d", resp.StatusCode),
			JobName:   jobName,
			Timestamp: time.Now(),
		}, fmt.Errorf("job trigger failed with status: %d", resp.StatusCode)
	}

	j.Logger.Info("Successfully triggered Jenkins job", zap.String("job", jobName))

	return &JobTriggerResult{
		Success:   true,
		Message:   "Job triggered successfully",
		JobName:   jobName,
		Timestamp: time.Now(),
	}, nil
}

// GetBuildStatus retrieves the status of a specific build
func (j *JenkinsService) GetBuildStatus(jobName string, buildNumber int) (*BuildDetails, error) {
	url := fmt.Sprintf("%s/job/%s/%d/api/json", j.BaseURL, jobName, buildNumber)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(j.Username, j.Token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("build status request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var buildDetails BuildDetails
	if err := json.Unmarshal(body, &buildDetails); err != nil {
		return nil, err
	}

	return &buildDetails, nil
}

// GetBuildLog retrieves the console log for a specific build
func (j *JenkinsService) GetBuildLog(jobName string, buildNumber int) (string, error) {
	url := fmt.Sprintf("%s/job/%s/%d/consoleText", j.BaseURL, jobName, buildNumber)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}

	req.SetBasicAuth(j.Username, j.Token)

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("build log request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

// GetQueue retrieves the current build queue
func (j *JenkinsService) GetQueue() ([]QueueItem, error) {
	url := fmt.Sprintf("%s/queue/api/json", j.BaseURL)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(j.Username, j.Token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("queue request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response struct {
		Items []QueueItem `json:"items"`
	}

	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}

	return response.Items, nil
}

// StopBuild stops a running build
func (j *JenkinsService) StopBuild(jobName string, buildNumber int) error {
	url := fmt.Sprintf("%s/job/%s/%d/stop", j.BaseURL, jobName, buildNumber)

	req, err := http.NewRequest("POST", url, nil)
	if err != nil {
		return err
	}

	req.SetBasicAuth(j.Username, j.Token)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusFound {
		return fmt.Errorf("stop build request failed with status: %d", resp.StatusCode)
	}

	j.Logger.Info("Successfully stopped build",
		zap.String("job", jobName),
		zap.Int("build", buildNumber))

	return nil
}