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

// GitHubService handles GitHub API integration
type GitHubService struct {
	Token  string
	Logger *zap.Logger
}

// WorkflowRun represents a GitHub Actions workflow run
type WorkflowRun struct {
	ID           int64     `json:"id"`
	Name         string    `json:"name"`
	DisplayTitle string    `json:"display_title"`
	Status       string    `json:"status"`
	Conclusion   string    `json:"conclusion"`
	WorkflowID   int64     `json:"workflow_id"`
	URL          string    `json:"url"`
	HTMLURL      string    `json:"html_url"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	RunStartedAt time.Time `json:"run_started_at"`
	Event        string    `json:"event"`
	HeadBranch   string    `json:"head_branch"`
	HeadSHA      string    `json:"head_sha"`
	Actor        struct {
		Login     string `json:"login"`
		ID        int64  `json:"id"`
		AvatarURL string `json:"avatar_url"`
	} `json:"actor"`
	Repository struct {
		ID       int64  `json:"id"`
		Name     string `json:"name"`
		FullName string `json:"full_name"`
		Private  bool   `json:"private"`
	} `json:"repository"`
}

// Workflow represents a GitHub Actions workflow
type Workflow struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Path      string    `json:"path"`
	State     string    `json:"state"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	URL       string    `json:"url"`
	HTMLURL   string    `json:"html_url"`
	BadgeURL  string    `json:"badge_url"`
}

// WorkflowJob represents a job within a workflow run
type WorkflowJob struct {
	ID          int64     `json:"id"`
	RunID       int64     `json:"run_id"`
	Name        string    `json:"name"`
	Status      string    `json:"status"`
	Conclusion  string    `json:"conclusion"`
	StartedAt   time.Time `json:"started_at"`
	CompletedAt time.Time `json:"completed_at"`
	URL         string    `json:"url"`
	HTMLURL     string    `json:"html_url"`
	Steps       []struct {
		Name       string    `json:"name"`
		Status     string    `json:"status"`
		Conclusion string    `json:"conclusion"`
		Number     int       `json:"number"`
		StartedAt  time.Time `json:"started_at"`
		CompletedAt time.Time `json:"completed_at"`
	} `json:"steps"`
}

// Repository represents a GitHub repository
type Repository struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	FullName    string    `json:"full_name"`
	Description string    `json:"description"`
	Private     bool      `json:"private"`
	HTMLURL     string    `json:"html_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Language    string    `json:"language"`
	StargazersCount int   `json:"stargazers_count"`
	ForksCount      int   `json:"forks_count"`
	OpenIssuesCount int   `json:"open_issues_count"`
}

// WorkflowSummary provides a summary of workflow runs
type WorkflowSummary struct {
	Repository    string        `json:"repository"`
	TotalRuns     int           `json:"totalRuns"`
	SuccessfulRuns int          `json:"successfulRuns"`
	FailedRuns    int           `json:"failedRuns"`
	InProgressRuns int          `json:"inProgressRuns"`
	Workflows     []Workflow    `json:"workflows"`
	RecentRuns    []WorkflowRun `json:"recentRuns"`
	Timestamp     time.Time     `json:"timestamp"`
}

// NewGitHubService creates a new GitHub service instance
func NewGitHubService(token string, logger *zap.Logger) *GitHubService {
	return &GitHubService{
		Token:  token,
		Logger: logger,
	}
}

// GetWorkflowRuns retrieves workflow runs for a repository
func (g *GitHubService) GetWorkflowRuns(owner, repo string, limit int) ([]WorkflowRun, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/actions/runs?per_page=%d", owner, repo, limit)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("token %s", g.Token))
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		g.Logger.Error("Failed to fetch workflow runs", zap.Error(err))
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response struct {
		WorkflowRuns []WorkflowRun `json:"workflow_runs"`
		TotalCount   int           `json:"total_count"`
	}

	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}

	g.Logger.Info("Successfully fetched workflow runs",
		zap.String("repo", fmt.Sprintf("%s/%s", owner, repo)),
		zap.Int("count", len(response.WorkflowRuns)))

	return response.WorkflowRuns, nil
}

// GetWorkflows retrieves all workflows for a repository
func (g *GitHubService) GetWorkflows(owner, repo string) ([]Workflow, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/actions/workflows", owner, repo)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("token %s", g.Token))
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response struct {
		Workflows  []Workflow `json:"workflows"`
		TotalCount int        `json:"total_count"`
	}

	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}

	return response.Workflows, nil
}

// TriggerWorkflow triggers a workflow dispatch event
func (g *GitHubService) TriggerWorkflow(owner, repo string, workflowID int64, ref string, inputs map[string]interface{}) error {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/actions/workflows/%d/dispatches", owner, repo, workflowID)

	payload := map[string]interface{}{
		"ref": ref,
	}

	if inputs != nil {
		payload["inputs"] = inputs
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", fmt.Sprintf("token %s", g.Token))
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf("workflow trigger failed with status: %d", resp.StatusCode)
	}

	g.Logger.Info("Successfully triggered workflow",
		zap.String("repo", fmt.Sprintf("%s/%s", owner, repo)),
		zap.Int64("workflow_id", workflowID))

	return nil
}

// GetWorkflowJobs retrieves jobs for a specific workflow run
func (g *GitHubService) GetWorkflowJobs(owner, repo string, runID int64) ([]WorkflowJob, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/actions/runs/%d/jobs", owner, repo, runID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("token %s", g.Token))
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response struct {
		Jobs       []WorkflowJob `json:"jobs"`
		TotalCount int           `json:"total_count"`
	}

	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}

	return response.Jobs, nil
}

// GetRepositories retrieves repositories for the authenticated user
func (g *GitHubService) GetRepositories(limit int) ([]Repository, error) {
	url := fmt.Sprintf("https://api.github.com/user/repos?per_page=%d&sort=updated", limit)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("token %s", g.Token))
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var repositories []Repository
	if err := json.Unmarshal(body, &repositories); err != nil {
		return nil, err
	}

	return repositories, nil
}

// GetWorkflowSummary provides a comprehensive summary of workflow activity
func (g *GitHubService) GetWorkflowSummary(owner, repo string) (*WorkflowSummary, error) {
	workflows, err := g.GetWorkflows(owner, repo)
	if err != nil {
		return nil, err
	}

	runs, err := g.GetWorkflowRuns(owner, repo, 50)
	if err != nil {
		return nil, err
	}

	summary := &WorkflowSummary{
		Repository: fmt.Sprintf("%s/%s", owner, repo),
		TotalRuns:  len(runs),
		Workflows:  workflows,
		RecentRuns: runs,
		Timestamp:  time.Now(),
	}

	// Count runs by status
	for _, run := range runs {
		switch run.Conclusion {
		case "success":
			summary.SuccessfulRuns++
		case "failure", "cancelled", "timed_out":
			summary.FailedRuns++
		default:
			if run.Status == "in_progress" || run.Status == "queued" {
				summary.InProgressRuns++
			}
		}
	}

	return summary, nil
}