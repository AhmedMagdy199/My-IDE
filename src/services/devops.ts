export interface DevOpsCommand {
  name: string;
  description: string;
  category: string;
  parameters?: Record<string, string>;
  example?: string;
}

export interface CommandResult {
  command: string;
  success: boolean;
  output?: string;
  error?: string;
  data?: any;
  duration: string;
  timestamp: string;
}

export interface ToolStatus {
  name: string;
  available: boolean;
  version?: string;
  error?: string;
  timestamp: string;
}

class DevOpsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  }

  async getAvailableCommands(): Promise<DevOpsCommand[]> {
    const response = await fetch(`${this.baseUrl}/api/devops/commands`);
    if (!response.ok) {
      throw new Error('Failed to fetch available commands');
    }
    const result = await response.json();
    return result.data;
  }

  async executeCommand(command: string, args: string[] = []): Promise<CommandResult> {
    const response = await fetch(`${this.baseUrl}/api/devops/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command, args }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute command');
    }

    const result = await response.json();
    return result.data;
  }

  async getCommandHistory(limit: number = 20): Promise<CommandResult[]> {
    const response = await fetch(`${this.baseUrl}/api/devops/history?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch command history');
    }
    const result = await response.json();
    return result.data;
  }

  async getToolStatus(): Promise<ToolStatus[]> {
    const response = await fetch(`${this.baseUrl}/api/devops/tools/status`);
    if (!response.ok) {
      throw new Error('Failed to fetch tool status');
    }
    const result = await response.json();
    return result.data;
  }

  // SonarQube specific methods
  async triggerSonarScan(projectPath: string): Promise<CommandResult> {
    return this.executeCommand('sonar-scan', [projectPath]);
  }

  async getSonarMetrics(): Promise<CommandResult> {
    return this.executeCommand('sonar-metrics');
  }

  // Trivy specific methods
  async scanFilesystem(path: string): Promise<CommandResult> {
    return this.executeCommand('trivy-fs', [path]);
  }

  async scanImage(imageName: string): Promise<CommandResult> {
    return this.executeCommand('trivy-image', [imageName]);
  }

  async scanRepository(repoUrl: string): Promise<CommandResult> {
    return this.executeCommand('trivy-repo', [repoUrl]);
  }

  // Jenkins specific methods
  async getJenkinsJobs(): Promise<CommandResult> {
    return this.executeCommand('jenkins-jobs');
  }

  async triggerJenkinsJob(jobName: string): Promise<CommandResult> {
    return this.executeCommand('jenkins-trigger', [jobName]);
  }

  async getJenkinsBuildStatus(jobName: string, buildNumber: string): Promise<CommandResult> {
    return this.executeCommand('jenkins-status', [jobName, buildNumber]);
  }

  async getJenkinsBuildLogs(jobName: string, buildNumber: string): Promise<CommandResult> {
    return this.executeCommand('jenkins-logs', [jobName, buildNumber]);
  }

  // GitHub specific methods
  async getGitHubWorkflows(owner: string, repo: string): Promise<CommandResult> {
    return this.executeCommand('github-workflows', [owner, repo]);
  }

  async getGitHubWorkflowRuns(owner: string, repo: string): Promise<CommandResult> {
    return this.executeCommand('github-runs', [owner, repo]);
  }

  async triggerGitHubWorkflow(
    owner: string,
    repo: string,
    workflowId: string,
    ref: string
  ): Promise<CommandResult> {
    return this.executeCommand('github-trigger', [owner, repo, workflowId, ref]);
  }
}

export const devopsService = new DevOpsService();