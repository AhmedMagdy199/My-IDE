import React, { useState, useEffect } from 'react';
import { 
  Workflow, 
  Play, 
  Square, 
  RefreshCw,
  Download,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  GitBranch,
  User,
  Calendar,
  Hash
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface GitHubWorkflow {
  id: number;
  name: string;
  path: string;
  state: 'active' | 'disabled';
  badge_url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
}

interface WorkflowRun {
  id: number;
  name: string;
  display_title: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | 'timed_out' | null;
  workflow_id: number;
  head_branch: string;
  head_sha: string;
  event: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  run_started_at: string;
  html_url: string;
}

interface WorkflowJob {
  id: number;
  run_id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null;
  started_at: string;
  completed_at: string;
  html_url: string;
  steps: Array<{
    name: string;
    status: string;
    conclusion: string;
    number: number;
    started_at: string;
    completed_at: string;
  }>;
}

export default function GitHubActions() {
  const [activeTab, setActiveTab] = useState('workflows');
  const [workflows, setWorkflows] = useState<GitHubWorkflow[]>([]);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [jobs, setJobs] = useState<WorkflowJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);

  const tabs = [
    { id: 'workflows', label: 'Workflows' },
    { id: 'runs', label: 'Workflow Runs' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'secrets', label: 'Secrets' },
    { id: 'environments', label: 'Environments' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchWorkflows();
    fetchRuns();
    fetchJobs();
  }, []);

  const fetchWorkflows = async () => {
    const mockWorkflows: GitHubWorkflow[] = [
      {
        id: 1,
        name: 'CI/CD Pipeline',
        path: '.github/workflows/ci-cd.yml',
        state: 'active',
        badge_url: 'https://github.com/owner/repo/workflows/CI%2FCD%20Pipeline/badge.svg',
        html_url: 'https://github.com/owner/repo/actions/workflows/ci-cd.yml',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'Security Scan',
        path: '.github/workflows/security.yml',
        state: 'active',
        badge_url: 'https://github.com/owner/repo/workflows/Security%20Scan/badge.svg',
        html_url: 'https://github.com/owner/repo/actions/workflows/security.yml',
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-14T15:45:00Z'
      },
      {
        id: 3,
        name: 'Deploy to Production',
        path: '.github/workflows/deploy.yml',
        state: 'active',
        badge_url: 'https://github.com/owner/repo/workflows/Deploy%20to%20Production/badge.svg',
        html_url: 'https://github.com/owner/repo/actions/workflows/deploy.yml',
        created_at: '2024-01-10T00:00:00Z',
        updated_at: '2024-01-15T09:20:00Z'
      }
    ];
    setWorkflows(mockWorkflows);
  };

  const fetchRuns = async () => {
    const mockRuns: WorkflowRun[] = [
      {
        id: 101,
        name: 'CI/CD Pipeline',
        display_title: 'Add new feature for user authentication',
        status: 'completed',
        conclusion: 'success',
        workflow_id: 1,
        head_branch: 'feature/auth',
        head_sha: 'abc123def456',
        event: 'pull_request',
        actor: {
          login: 'john-doe',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:35:00Z',
        run_started_at: '2024-01-15T10:30:30Z',
        html_url: 'https://github.com/owner/repo/actions/runs/101'
      },
      {
        id: 102,
        name: 'Security Scan',
        display_title: 'Scheduled security scan',
        status: 'in_progress',
        conclusion: null,
        workflow_id: 2,
        head_branch: 'main',
        head_sha: 'def456ghi789',
        event: 'schedule',
        actor: {
          login: 'github-actions[bot]',
          avatar_url: 'https://avatars.githubusercontent.com/u/41898282?v=4'
        },
        created_at: '2024-01-15T11:00:00Z',
        updated_at: '2024-01-15T11:05:00Z',
        run_started_at: '2024-01-15T11:00:15Z',
        html_url: 'https://github.com/owner/repo/actions/runs/102'
      },
      {
        id: 103,
        name: 'Deploy to Production',
        display_title: 'Release v2.1.0',
        status: 'completed',
        conclusion: 'failure',
        workflow_id: 3,
        head_branch: 'main',
        head_sha: 'ghi789jkl012',
        event: 'push',
        actor: {
          login: 'jane-smith',
          avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4'
        },
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-01-15T09:15:00Z',
        run_started_at: '2024-01-15T09:00:45Z',
        html_url: 'https://github.com/owner/repo/actions/runs/103'
      }
    ];
    setRuns(mockRuns);
  };

  const fetchJobs = async () => {
    const mockJobs: WorkflowJob[] = [
      {
        id: 201,
        run_id: 101,
        name: 'build',
        status: 'completed',
        conclusion: 'success',
        started_at: '2024-01-15T10:30:30Z',
        completed_at: '2024-01-15T10:33:00Z',
        html_url: 'https://github.com/owner/repo/actions/runs/101/jobs/201',
        steps: [
          {
            name: 'Checkout code',
            status: 'completed',
            conclusion: 'success',
            number: 1,
            started_at: '2024-01-15T10:30:30Z',
            completed_at: '2024-01-15T10:30:45Z'
          },
          {
            name: 'Setup Node.js',
            status: 'completed',
            conclusion: 'success',
            number: 2,
            started_at: '2024-01-15T10:30:45Z',
            completed_at: '2024-01-15T10:31:00Z'
          },
          {
            name: 'Install dependencies',
            status: 'completed',
            conclusion: 'success',
            number: 3,
            started_at: '2024-01-15T10:31:00Z',
            completed_at: '2024-01-15T10:32:30Z'
          },
          {
            name: 'Run tests',
            status: 'completed',
            conclusion: 'success',
            number: 4,
            started_at: '2024-01-15T10:32:30Z',
            completed_at: '2024-01-15T10:33:00Z'
          }
        ]
      }
    ];
    setJobs(mockJobs);
  };

  const triggerWorkflow = async (workflowId: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRun: WorkflowRun = {
        id: Date.now(),
        name: workflows.find(w => w.id === workflowId)?.name || 'Workflow',
        display_title: 'Manual trigger',
        status: 'queued',
        conclusion: null,
        workflow_id: workflowId,
        head_branch: 'main',
        head_sha: 'manual123',
        event: 'workflow_dispatch',
        actor: {
          login: 'current-user',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        run_started_at: new Date().toISOString(),
        html_url: `https://github.com/owner/repo/actions/runs/${Date.now()}`
      };
      
      setRuns(prev => [newRun, ...prev]);
    } catch (error) {
      console.error('Error triggering workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">GitHub Actions Workflows</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <div className="grid gap-4">
        {workflows.map(workflow => (
          <Card key={workflow.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  workflow.state === 'active' ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  <Workflow className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{workflow.name}</h3>
                  <p className="text-gray-400">{workflow.path}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>Created: {new Date(workflow.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(workflow.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={workflow.state} />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => triggerWorkflow(workflow.id)}
                    loading={loading}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRuns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Workflow Runs</h2>
        <Button onClick={fetchRuns} loading={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {runs.map(run => (
          <Card key={run.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  run.conclusion === 'success' ? 'bg-green-600' :
                  run.conclusion === 'failure' ? 'bg-red-600' :
                  run.status === 'in_progress' ? 'bg-blue-600' : 'bg-yellow-600'
                }`}>
                  {run.conclusion === 'success' && <CheckCircle className="w-6 h-6 text-white" />}
                  {run.conclusion === 'failure' && <XCircle className="w-6 h-6 text-white" />}
                  {run.status === 'in_progress' && <Clock className="w-6 h-6 text-white" />}
                  {run.status === 'queued' && <Clock className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{run.name}</h3>
                  <p className="text-gray-400">{run.display_title}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {run.actor.login}
                    </span>
                    <span className="flex items-center">
                      <GitBranch className="w-4 h-4 mr-1" />
                      {run.head_branch}
                    </span>
                    <span className="flex items-center">
                      <Hash className="w-4 h-4 mr-1" />
                      {run.head_sha.substring(0, 7)}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(run.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={run.conclusion || run.status} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Workflow Jobs</h2>
      
      <div className="grid gap-4">
        {jobs.map(job => (
          <Card key={job.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  job.conclusion === 'success' ? 'bg-green-600' :
                  job.conclusion === 'failure' ? 'bg-red-600' :
                  job.status === 'in_progress' ? 'bg-blue-600' : 'bg-yellow-600'
                }`}>
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{job.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Run ID: {job.run_id}</span>
                    <span>Started: {new Date(job.started_at).toLocaleString()}</span>
                    {job.completed_at && (
                      <span>Completed: {new Date(job.completed_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
              <StatusBadge status={job.conclusion || job.status} />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-300">Steps:</h4>
              {job.steps.map((step, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-mono">{step.number}</span>
                    <span className="text-sm">{step.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={step.conclusion || step.status} />
                    <span className="text-xs text-gray-400">
                      {new Date(step.completed_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSecrets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Repository Secrets</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Secret
        </Button>
      </div>

      <div className="grid gap-4">
        {[
          { name: 'AWS_ACCESS_KEY_ID', updated: '2024-01-10' },
          { name: 'AWS_SECRET_ACCESS_KEY', updated: '2024-01-10' },
          { name: 'DOCKER_USERNAME', updated: '2024-01-05' },
          { name: 'DOCKER_PASSWORD', updated: '2024-01-05' },
          { name: 'SONAR_TOKEN', updated: '2024-01-15' }
        ].map((secret, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{secret.name}</h3>
                <p className="text-sm text-gray-400">Updated: {secret.updated}</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEnvironments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Deployment Environments</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Environment
        </Button>
      </div>

      <div className="grid gap-4">
        {[
          { name: 'production', protection: true, deployments: 45, lastDeployment: '2024-01-15' },
          { name: 'staging', protection: false, deployments: 123, lastDeployment: '2024-01-15' },
          { name: 'development', protection: false, deployments: 234, lastDeployment: '2024-01-15' }
        ].map((env, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{env.name}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                  <span>{env.deployments} deployments</span>
                  <span>Last: {env.lastDeployment}</span>
                  {env.protection && (
                    <span className="flex items-center text-yellow-400">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Protected
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">GitHub Actions Settings</h2>
      
      <Card title="General Settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Actions permissions</p>
              <p className="text-sm text-gray-400">Allow all actions and reusable workflows</p>
            </div>
            <Button variant="secondary">Configure</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Fork pull request workflows</p>
              <p className="text-sm text-gray-400">Run workflows from fork pull requests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Runners">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">GitHub-hosted runners</p>
              <p className="text-sm text-gray-400">Use GitHub's hosted runners</p>
            </div>
            <StatusBadge status="active" />
          </div>

          <div className="space-y-2">
            <p className="font-medium text-sm">Available runners:</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="p-2 bg-gray-700 rounded">ubuntu-latest</span>
              <span className="p-2 bg-gray-700 rounded">windows-latest</span>
              <span className="p-2 bg-gray-700 rounded">macos-latest</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'workflows': return renderWorkflows();
      case 'runs': return renderRuns();
      case 'jobs': return renderJobs();
      case 'secrets': return renderSecrets();
      case 'environments': return renderEnvironments();
      case 'settings': return renderSettings();
      default: return renderWorkflows();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Workflow className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold">GitHub Actions</h1>
            <p className="text-gray-400">Automate your workflow from idea to production</p>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
}