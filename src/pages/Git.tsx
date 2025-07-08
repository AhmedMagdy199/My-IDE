import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  GitMerge,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Hash,
  MessageSquare,
  Settings,
  Github,
  Gitlab
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  lastCommit: string;
  status: 'active' | 'archived';
  url: string;
}

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  verified: boolean;
}

interface PullRequest {
  id: number;
  title: string;
  author: string;
  status: 'open' | 'closed' | 'merged';
  createdAt: string;
  branch: string;
  targetBranch: string;
  comments: number;
  checks: 'passing' | 'failing' | 'pending';
}

interface Branch {
  name: string;
  isDefault: boolean;
  lastCommit: string;
  ahead: number;
  behind: number;
}

export default function Git() {
  const [activeTab, setActiveTab] = useState('repositories');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [gitConfig, setGitConfig] = useState({
    provider: 'github',
    token: '',
    username: '',
    email: ''
  });

  const tabs = [
    { id: 'repositories', label: 'Repositories' },
    { id: 'commits', label: 'Commits' },
    { id: 'pulls', label: 'Pull Requests' },
    { id: 'branches', label: 'Branches' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchRepositories();
    fetchCommits();
    fetchPullRequests();
    fetchBranches();
  }, []);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      // Simulate GitHub API call
      const mockRepos: Repository[] = [
        {
          id: '1',
          name: 'devops-platform',
          fullName: 'company/devops-platform',
          description: 'Comprehensive DevOps management platform',
          stars: 245,
          forks: 67,
          language: 'TypeScript',
          lastCommit: '2 hours ago',
          status: 'active',
          url: 'https://github.com/company/devops-platform'
        },
        {
          id: '2',
          name: 'infrastructure-as-code',
          fullName: 'company/infrastructure-as-code',
          description: 'Terraform modules for cloud infrastructure',
          stars: 89,
          forks: 23,
          language: 'HCL',
          lastCommit: '1 day ago',
          status: 'active',
          url: 'https://github.com/company/infrastructure-as-code'
        },
        {
          id: '3',
          name: 'monitoring-stack',
          fullName: 'company/monitoring-stack',
          description: 'Prometheus and Grafana monitoring setup',
          stars: 156,
          forks: 34,
          language: 'YAML',
          lastCommit: '3 days ago',
          status: 'active',
          url: 'https://github.com/company/monitoring-stack'
        }
      ];
      setRepositories(mockRepos);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommits = async () => {
    const mockCommits: Commit[] = [
      {
        sha: 'a1b2c3d',
        message: 'feat: add cloud provider integration',
        author: 'john.doe',
        date: '2 hours ago',
        verified: true
      },
      {
        sha: 'e4f5g6h',
        message: 'fix: resolve authentication issues',
        author: 'jane.smith',
        date: '4 hours ago',
        verified: true
      },
      {
        sha: 'i7j8k9l',
        message: 'docs: update API documentation',
        author: 'bob.wilson',
        date: '1 day ago',
        verified: false
      }
    ];
    setCommits(mockCommits);
  };

  const fetchPullRequests = async () => {
    const mockPRs: PullRequest[] = [
      {
        id: 42,
        title: 'Add Kubernetes dashboard integration',
        author: 'alice.cooper',
        status: 'open',
        createdAt: '2 days ago',
        branch: 'feature/k8s-dashboard',
        targetBranch: 'main',
        comments: 5,
        checks: 'passing'
      },
      {
        id: 41,
        title: 'Implement cost optimization alerts',
        author: 'charlie.brown',
        status: 'open',
        createdAt: '3 days ago',
        branch: 'feature/cost-alerts',
        targetBranch: 'main',
        comments: 2,
        checks: 'failing'
      },
      {
        id: 40,
        title: 'Update security scanning workflow',
        author: 'diana.prince',
        status: 'merged',
        createdAt: '1 week ago',
        branch: 'security/update-scanning',
        targetBranch: 'main',
        comments: 8,
        checks: 'passing'
      }
    ];
    setPullRequests(mockPRs);
  };

  const fetchBranches = async () => {
    const mockBranches: Branch[] = [
      {
        name: 'main',
        isDefault: true,
        lastCommit: '2 hours ago',
        ahead: 0,
        behind: 0
      },
      {
        name: 'feature/k8s-dashboard',
        isDefault: false,
        lastCommit: '2 days ago',
        ahead: 3,
        behind: 1
      },
      {
        name: 'feature/cost-alerts',
        isDefault: false,
        lastCommit: '3 days ago',
        ahead: 5,
        behind: 2
      }
    ];
    setBranches(mockBranches);
  };

  const handleCloneRepo = async (repoUrl: string) => {
    setLoading(true);
    try {
      // Simulate git clone operation
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log(`Cloning repository: ${repoUrl}`);
    } catch (error) {
      console.error('Error cloning repository:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRepositories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Repositories</h2>
        <div className="flex space-x-3">
          <Button onClick={fetchRepositories} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Repository
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {repositories.map(repo => (
          <Card key={repo.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{repo.name}</h3>
                  <p className="text-gray-400">{repo.fullName}</p>
                  <p className="text-sm text-gray-300 mt-1">{repo.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                      {repo.language}
                    </span>
                    <span>⭐ {repo.stars}</span>
                    <span>🍴 {repo.forks}</span>
                    <span>Updated {repo.lastCommit}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={repo.status} />
                <Button
                  size="sm"
                  onClick={() => handleCloneRepo(repo.url)}
                  loading={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Clone
                </Button>
                <Button size="sm" variant="secondary">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCommits = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Commits</h2>
        <Button onClick={fetchCommits} loading={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {commits.map(commit => (
          <Card key={commit.sha}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <GitCommit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{commit.message}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {commit.author}
                    </span>
                    <span className="flex items-center">
                      <Hash className="w-4 h-4 mr-1" />
                      {commit.sha}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {commit.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {commit.verified && (
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Verified</span>
                  </div>
                )}
                <Button size="sm" variant="secondary">
                  View
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPullRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pull Requests</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Pull Request
        </Button>
      </div>

      <div className="space-y-3">
        {pullRequests.map(pr => (
          <Card key={pr.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <GitPullRequest className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">#{pr.id} {pr.title}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {pr.author}
                    </span>
                    <span className="flex items-center">
                      <GitBranch className="w-4 h-4 mr-1" />
                      {pr.branch} → {pr.targetBranch}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {pr.comments}
                    </span>
                    <span>{pr.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <StatusBadge status={pr.status} />
                  {pr.checks === 'passing' && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  {pr.checks === 'failing' && (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  {pr.checks === 'pending' && (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <Button size="sm">
                  Review
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBranches = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Branches</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Branch
        </Button>
      </div>

      <div className="space-y-3">
        {branches.map(branch => (
          <Card key={branch.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-600 rounded-lg">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{branch.name}</p>
                    {branch.isDefault && (
                      <span className="px-2 py-1 bg-blue-600 text-xs rounded-full">
                        default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Last commit {branch.lastCommit}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {!branch.isDefault && (
                  <div className="text-sm text-gray-400">
                    <span className="text-green-400">+{branch.ahead}</span>
                    {' / '}
                    <span className="text-red-400">-{branch.behind}</span>
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <GitMerge className="w-4 h-4" />
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

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Git Configuration</h2>
      
      <Card title="Git Provider">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Provider</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setGitConfig(prev => ({ ...prev, provider: 'github' }))}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  gitConfig.provider === 'github' 
                    ? 'border-blue-500 bg-blue-600/20' 
                    : 'border-gray-600 bg-gray-700'
                }`}
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </button>
              <button
                onClick={() => setGitConfig(prev => ({ ...prev, provider: 'gitlab' }))}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  gitConfig.provider === 'gitlab' 
                    ? 'border-orange-500 bg-orange-600/20' 
                    : 'border-gray-600 bg-gray-700'
                }`}
              >
                <Gitlab className="w-5 h-5" />
                <span>GitLab</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Personal Access Token</label>
            <input
              type="password"
              value={gitConfig.token}
              onChange={(e) => setGitConfig(prev => ({ ...prev, token: e.target.value }))}
              className="w-full bg-gray-700 rounded-md px-3 py-2"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={gitConfig.username}
                onChange={(e) => setGitConfig(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-gray-700 rounded-md px-3 py-2"
                placeholder="your-username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={gitConfig.email}
                onChange={(e) => setGitConfig(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-gray-700 rounded-md px-3 py-2"
                placeholder="your-email@example.com"
              />
            </div>
          </div>

          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Test Connection
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'repositories': return renderRepositories();
      case 'commits': return renderCommits();
      case 'pulls': return renderPullRequests();
      case 'branches': return renderBranches();
      case 'settings': return renderSettings();
      default: return renderRepositories();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <GitBranch className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-2xl font-bold">Git Management</h1>
            <p className="text-gray-400">Manage repositories, commits, and collaboration</p>
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