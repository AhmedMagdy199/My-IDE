package services

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"go.uber.org/zap"
)

// DevOpsHelper provides unified access to all DevOps tools
type DevOpsHelper struct {
	SonarQube *SonarQubeService
	Trivy     *TrivyService
	Jenkins   *JenkinsService
	GitHub    *GitHubService
	Logger    *zap.Logger
}

// ToolStatus represents the status of a DevOps tool
type ToolStatus struct {
	Name      string    `json:"name"`
	Available bool      `json:"available"`
	Version   string    `json:"version,omitempty"`
	Error     string    `json:"error,omitempty"`
	Timestamp time.Time `json:"timestamp"`
}

// DevOpsCommand represents a command that can be executed
type DevOpsCommand struct {
	Name        string            `json:"name"`
	Description string            `json:"description"`
	Category    string            `json:"category"`
	Parameters  map[string]string `json:"parameters,omitempty"`
	Example     string            `json:"example,omitempty"`
}

// CommandResult represents the result of executing a command
type CommandResult struct {
	Command   string        `json:"command"`
	Success   bool          `json:"success"`
	Output    string        `json:"output,omitempty"`
	Error     string        `json:"error,omitempty"`
	Data      interface{}   `json:"data,omitempty"`
	Duration  time.Duration `json:"duration"`
	Timestamp time.Time     `json:"timestamp"`
}

// NewDevOpsHelper creates a new DevOps helper instance
func NewDevOpsHelper(logger *zap.Logger) *DevOpsHelper {
	return &DevOpsHelper{
		Logger: logger,
	}
}

// InitializeServices initializes all DevOps services with configuration
func (d *DevOpsHelper) InitializeServices(config map[string]interface{}) error {
	d.Logger.Info("Initializing DevOps services")

	// Initialize SonarQube
	if sonarConfig, ok := config["sonarqube"].(map[string]interface{}); ok {
		if url, urlOk := sonarConfig["url"].(string); urlOk {
			if token, tokenOk := sonarConfig["token"].(string); tokenOk {
				if projectKey, keyOk := sonarConfig["project_key"].(string); keyOk {
					d.SonarQube = NewSonarQubeService(url, token, projectKey, d.Logger)
				}
			}
		}
	}

	// Initialize Trivy
	d.Trivy = NewTrivyService(d.Logger)

	// Initialize Jenkins
	if jenkinsConfig, ok := config["jenkins"].(map[string]interface{}); ok {
		if url, urlOk := jenkinsConfig["url"].(string); urlOk {
			if username, userOk := jenkinsConfig["username"].(string); userOk {
				if token, tokenOk := jenkinsConfig["token"].(string); tokenOk {
					d.Jenkins = NewJenkinsService(url, username, token, d.Logger)
				}
			}
		}
	}

	// Initialize GitHub
	if githubConfig, ok := config["github"].(map[string]interface{}); ok {
		if token, tokenOk := githubConfig["token"].(string); tokenOk {
			d.GitHub = NewGitHubService(token, d.Logger)
		}
	}

	return nil
}

// CheckToolAvailability checks if all required tools are available
func (d *DevOpsHelper) CheckToolAvailability() ([]ToolStatus, error) {
	tools := []struct {
		name    string
		command string
		args    []string
	}{
		{"sonar-scanner", "sonar-scanner", []string{"--version"}},
		{"trivy", "trivy", []string{"--version"}},
		{"docker", "docker", []string{"--version"}},
		{"kubectl", "kubectl", []string{"version", "--client"}},
		{"terraform", "terraform", []string{"--version"}},
		{"ansible", "ansible", []string{"--version"}},
		{"git", "git", []string{"--version"}},
		{"curl", "curl", []string{"--version"}},
		{"jq", "jq", []string{"--version"}},
	}

	var statuses []ToolStatus

	for _, tool := range tools {
		status := ToolStatus{
			Name:      tool.name,
			Timestamp: time.Now(),
		}

		cmd := exec.Command(tool.command, tool.args...)
		output, err := cmd.Output()
		if err != nil {
			status.Available = false
			status.Error = err.Error()
		} else {
			status.Available = true
			status.Version = strings.TrimSpace(string(output))
		}

		statuses = append(statuses, status)
	}

	return statuses, nil
}

// GetAvailableCommands returns a list of available DevOps commands
func (d *DevOpsHelper) GetAvailableCommands() []DevOpsCommand {
	return []DevOpsCommand{
		// SonarQube Commands
		{
			Name:        "sonar-scan",
			Description: "Run SonarQube code quality scan",
			Category:    "Code Quality",
			Parameters:  map[string]string{"path": "Project path to scan"},
			Example:     "sonar-scan /path/to/project",
		},
		{
			Name:        "sonar-metrics",
			Description: "Get SonarQube project metrics",
			Category:    "Code Quality",
			Example:     "sonar-metrics",
		},

		// Trivy Commands
		{
			Name:        "trivy-fs",
			Description: "Scan filesystem for vulnerabilities",
			Category:    "Security",
			Parameters:  map[string]string{"path": "Path to scan"},
			Example:     "trivy-fs /path/to/scan",
		},
		{
			Name:        "trivy-image",
			Description: "Scan Docker image for vulnerabilities",
			Category:    "Security",
			Parameters:  map[string]string{"image": "Docker image name"},
			Example:     "trivy-image nginx:latest",
		},
		{
			Name:        "trivy-repo",
			Description: "Scan Git repository for vulnerabilities",
			Category:    "Security",
			Parameters:  map[string]string{"repo": "Repository URL"},
			Example:     "trivy-repo https://github.com/user/repo",
		},

		// Jenkins Commands
		{
			Name:        "jenkins-jobs",
			Description: "List all Jenkins jobs",
			Category:    "CI/CD",
			Example:     "jenkins-jobs",
		},
		{
			Name:        "jenkins-trigger",
			Description: "Trigger a Jenkins job",
			Category:    "CI/CD",
			Parameters:  map[string]string{"job": "Job name"},
			Example:     "jenkins-trigger my-job",
		},
		{
			Name:        "jenkins-status",
			Description: "Get build status",
			Category:    "CI/CD",
			Parameters:  map[string]string{"job": "Job name", "build": "Build number"},
			Example:     "jenkins-status my-job 123",
		},
		{
			Name:        "jenkins-logs",
			Description: "Get build logs",
			Category:    "CI/CD",
			Parameters:  map[string]string{"job": "Job name", "build": "Build number"},
			Example:     "jenkins-logs my-job 123",
		},

		// GitHub Commands
		{
			Name:        "github-workflows",
			Description: "List GitHub Actions workflows",
			Category:    "CI/CD",
			Parameters:  map[string]string{"owner": "Repository owner", "repo": "Repository name"},
			Example:     "github-workflows owner repo",
		},
		{
			Name:        "github-runs",
			Description: "List workflow runs",
			Category:    "CI/CD",
			Parameters:  map[string]string{"owner": "Repository owner", "repo": "Repository name"},
			Example:     "github-runs owner repo",
		},
		{
			Name:        "github-trigger",
			Description: "Trigger workflow dispatch",
			Category:    "CI/CD",
			Parameters:  map[string]string{"owner": "Repository owner", "repo": "Repository name", "workflow": "Workflow ID", "ref": "Git ref"},
			Example:     "github-trigger owner repo 123456 main",
		},

		// Utility Commands
		{
			Name:        "tool-status",
			Description: "Check availability of DevOps tools",
			Category:    "Utilities",
			Example:     "tool-status",
		},
		{
			Name:        "help",
			Description: "Show available commands",
			Category:    "Utilities",
			Example:     "help",
		},
	}
}

// ExecuteCommand executes a DevOps command and returns the result
func (d *DevOpsHelper) ExecuteCommand(command string, args []string) (*CommandResult, error) {
	start := time.Now()
	result := &CommandResult{
		Command:   fmt.Sprintf("%s %s", command, strings.Join(args, " ")),
		Timestamp: start,
	}

	d.Logger.Info("Executing DevOps command", zap.String("command", result.Command))

	switch command {
	case "sonar-scan":
		result = d.executeSonarScan(args, result)
	case "sonar-metrics":
		result = d.executeSonarMetrics(result)
	case "trivy-fs":
		result = d.executeTrivyFS(args, result)
	case "trivy-image":
		result = d.executeTrivyImage(args, result)
	case "trivy-repo":
		result = d.executeTrivyRepo(args, result)
	case "jenkins-jobs":
		result = d.executeJenkinsJobs(result)
	case "jenkins-trigger":
		result = d.executeJenkinsTrigger(args, result)
	case "jenkins-status":
		result = d.executeJenkinsStatus(args, result)
	case "jenkins-logs":
		result = d.executeJenkinsLogs(args, result)
	case "github-workflows":
		result = d.executeGitHubWorkflows(args, result)
	case "github-runs":
		result = d.executeGitHubRuns(args, result)
	case "github-trigger":
		result = d.executeGitHubTrigger(args, result)
	case "tool-status":
		result = d.executeToolStatus(result)
	case "help":
		result = d.executeHelp(result)
	default:
		result.Success = false
		result.Error = fmt.Sprintf("Unknown command: %s", command)
	}

	result.Duration = time.Since(start)
	d.Logger.Info("Command execution completed",
		zap.String("command", result.Command),
		zap.Bool("success", result.Success),
		zap.Duration("duration", result.Duration))

	return result, nil
}

// Helper methods for command execution

func (d *DevOpsHelper) executeSonarScan(args []string, result *CommandResult) *CommandResult {
	if d.SonarQube == nil {
		result.Success = false
		result.Error = "SonarQube service not initialized"
		return result
	}

	if len(args) < 1 {
		result.Success = false
		result.Error = "Missing project path argument"
		return result
	}

	scanResult, err := d.SonarQube.TriggerScan(args[0])
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = scanResult.Success
	result.Data = scanResult
	result.Output = scanResult.Message
	return result
}

func (d *DevOpsHelper) executeSonarMetrics(result *CommandResult) *CommandResult {
	if d.SonarQube == nil {
		result.Success = false
		result.Error = "SonarQube service not initialized"
		return result
	}

	metrics, err := d.SonarQube.GetProjectMeasures()
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = true
	result.Data = metrics
	result.Output = "Successfully retrieved project metrics"
	return result
}

func (d *DevOpsHelper) executeTrivyFS(args []string, result *CommandResult) *CommandResult {
	if len(args) < 1 {
		result.Success = false
		result.Error = "Missing path argument"
		return result
	}

	scanResult, err := d.Trivy.ScanFilesystem(args[0])
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = scanResult.Success
	result.Data = scanResult
	result.Output = fmt.Sprintf("Found %d vulnerabilities (%d critical, %d high)",
		scanResult.TotalVulns, scanResult.Critical, scanResult.High)
	return result
}

func (d *DevOpsHelper) executeTrivyImage(args []string, result *CommandResult) *CommandResult {
	if len(args) < 1 {
		result.Success = false
		result.Error = "Missing image name argument"
		return result
	}

	scanResult, err := d.Trivy.ScanImage(args[0])
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = scanResult.Success
	result.Data = scanResult
	result.Output = fmt.Sprintf("Found %d vulnerabilities (%d critical, %d high)",
		scanResult.TotalVulns, scanResult.Critical, scanResult.High)
	return result
}

func (d *DevOpsHelper) executeTrivyRepo(args []string, result *CommandResult) *CommandResult {
	if len(args) < 1 {
		result.Success = false
		result.Error = "Missing repository URL argument"
		return result
	}

	scanResult, err := d.Trivy.ScanRepository(args[0])
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = scanResult.Success
	result.Data = scanResult
	result.Output = fmt.Sprintf("Found %d vulnerabilities (%d critical, %d high)",
		scanResult.TotalVulns, scanResult.Critical, scanResult.High)
	return result
}

func (d *DevOpsHelper) executeJenkinsJobs(result *CommandResult) *CommandResult {
	if d.Jenkins == nil {
		result.Success = false
		result.Error = "Jenkins service not initialized"
		return result
	}

	jobs, err := d.Jenkins.GetJobs()
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = true
	result.Data = jobs
	result.Output = fmt.Sprintf("Found %d Jenkins jobs", len(jobs))
	return result
}

func (d *DevOpsHelper) executeJenkinsTrigger(args []string, result *CommandResult) *CommandResult {
	if d.Jenkins == nil {
		result.Success = false
		result.Error = "Jenkins service not initialized"
		return result
	}

	if len(args) < 1 {
		result.Success = false
		result.Error = "Missing job name argument"
		return result
	}

	triggerResult, err := d.Jenkins.TriggerJob(args[0], nil)
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = triggerResult.Success
	result.Data = triggerResult
	result.Output = triggerResult.Message
	return result
}

func (d *DevOpsHelper) executeJenkinsStatus(args []string, result *CommandResult) *CommandResult {
	if d.Jenkins == nil {
		result.Success = false
		result.Error = "Jenkins service not initialized"
		return result
	}

	if len(args) < 2 {
		result.Success = false
		result.Error = "Missing job name and build number arguments"
		return result
	}

	// Parse build number
	buildNumber := 0
	if _, err := fmt.Sscanf(args[1], "%d", &buildNumber); err != nil {
		result.Success = false
		result.Error = "Invalid build number"
		return result
	}

	buildDetails, err := d.Jenkins.GetBuildStatus(args[0], buildNumber)
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = true
	result.Data = buildDetails
	result.Output = fmt.Sprintf("Build %d status: %s", buildDetails.Number, buildDetails.Result)
	return result
}

func (d *DevOpsHelper) executeJenkinsLogs(args []string, result *CommandResult) *CommandResult {
	if d.Jenkins == nil {
		result.Success = false
		result.Error = "Jenkins service not initialized"
		return result
	}

	if len(args) < 2 {
		result.Success = false
		result.Error = "Missing job name and build number arguments"
		return result
	}

	// Parse build number
	buildNumber := 0
	if _, err := fmt.Sscanf(args[1], "%d", &buildNumber); err != nil {
		result.Success = false
		result.Error = "Invalid build number"
		return result
	}

	logs, err := d.Jenkins.GetBuildLog(args[0], buildNumber)
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = true
	result.Output = logs
	return result
}

func (d *DevOpsHelper) executeGitHubWorkflows(args []string, result *CommandResult) *CommandResult {
	if d.GitHub == nil {
		result.Success = false
		result.Error = "GitHub service not initialized"
		return result
	}

	if len(args) < 2 {
		result.Success = false
		result.Error = "Missing owner and repository arguments"
		return result
	}

	workflows, err := d.GitHub.GetWorkflows(args[0], args[1])
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = true
	result.Data = workflows
	result.Output = fmt.Sprintf("Found %d workflows", len(workflows))
	return result
}

func (d *DevOpsHelper) executeGitHubRuns(args []string, result *CommandResult) *CommandResult {
	if d.GitHub == nil {
		result.Success = false
		result.Error = "GitHub service not initialized"
		return result
	}

	if len(args) < 2 {
		result.Success = false
		result.Error = "Missing owner and repository arguments"
		return result
	}

	runs, err := d.GitHub.GetWorkflowRuns(args[0], args[1], 20)
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = true
	result.Data = runs
	result.Output = fmt.Sprintf("Found %d workflow runs", len(runs))
	return result
}

func (d *DevOpsHelper) executeGitHubTrigger(args []string, result *CommandResult) *CommandResult {
	if d.GitHub == nil {
		result.Success = false
		result.Error = "GitHub service not initialized"
		return result
	}

	if len(args) < 4 {
		result.Success = false
		result.Error = "Missing owner, repository, workflow ID, and ref arguments"
		return result
	}

	// Parse workflow ID
	var workflowID int64
	if _, err := fmt.Sscanf(args[2], "%d", &workflowID); err != nil {
		result.Success = false
		result.Error = "Invalid workflow ID"
		return result
	}

	err := d.GitHub.TriggerWorkflow(args[0], args[1], workflowID, args[3], nil)
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = true
	result.Output = "Workflow triggered successfully"
	return result
}

func (d *DevOpsHelper) executeToolStatus(result *CommandResult) *CommandResult {
	statuses, err := d.CheckToolAvailability()
	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}

	result.Success = true
	result.Data = statuses

	available := 0
	for _, status := range statuses {
		if status.Available {
			available++
		}
	}

	result.Output = fmt.Sprintf("%d/%d tools available", available, len(statuses))
	return result
}

func (d *DevOpsHelper) executeHelp(result *CommandResult) *CommandResult {
	commands := d.GetAvailableCommands()
	result.Success = true
	result.Data = commands
	result.Output = fmt.Sprintf("Available commands: %d", len(commands))
	return result
}

// SaveCommandHistory saves command execution history to a file
func (d *DevOpsHelper) SaveCommandHistory(result *CommandResult) error {
	historyDir := "/tmp/devops-history"
	if err := os.MkdirAll(historyDir, 0755); err != nil {
		return err
	}

	filename := filepath.Join(historyDir, fmt.Sprintf("command-%d.json", time.Now().Unix()))

	data, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(filename, data, 0644)
}

// GetCommandHistory retrieves recent command execution history
func (d *DevOpsHelper) GetCommandHistory(limit int) ([]CommandResult, error) {
	historyDir := "/tmp/devops-history"

	files, err := filepath.Glob(filepath.Join(historyDir, "command-*.json"))
	if err != nil {
		return nil, err
	}

	var results []CommandResult
	for i, file := range files {
		if limit > 0 && i >= limit {
			break
		}

		data, err := os.ReadFile(file)
		if err != nil {
			continue
		}

		var result CommandResult
		if err := json.Unmarshal(data, &result); err != nil {
			continue
		}

		results = append(results, result)
	}

	return results, nil
}