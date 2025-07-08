import React, { useState, useEffect } from 'react';
import { GitMerge, Play, Square, RefreshCw, Download, Upload, Eye, CheckCircle, XCircle, Clock, AlertTriangle, GitBranch, Settings, Plus, Trash2, Edit, Save, FolderSync as Sync, History, Target, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ArgoApplication {
  id: string;
  name: string;
  namespace: string;
  project: string;
  status: 'healthy' | 'progressing' | 'degraded' | 'suspended' | 'missing' | 'unknown';
  syncStatus: 'synced' | 'out-of-sync' | 'unknown';
  health: 'healthy' | 'progressing' | 'degraded' | 'suspended' | 'missing' | 'unknown';
  repository: string;
  path: string;
  targetRevision: string;
  cluster: string;
  lastSync: string;
  createdAt: string;
}

interface ArgoRepository {
  id: string;
  url: string;
  type: 'git' | 'helm' | 'oci';
  name: string;
  status: 'connected' | 'failed' | 'unknown';
  lastConnection: string;
  credentials: 'https' | 'ssh' | 'github-app';
}

interface ArgoCluster {
  id: string;
  name: string;
  server: string;
  status: 'connected' | 'disconnected' | 'unknown';
  version: string;
  nodes: number;
  lastConnection: string;
}

interface ArgoProject {
  id: string;
  name: string;
  description: string;
  sourceRepos: string[];
  destinations: Array<{
    server: string;
    namespace: string;
  }>;
  roles: Array<{
    name: string;
    policies: string[];
  }>;
  createdAt: string;
}

interface ArgoSyncOperation {
  id: string;
  application: string;
  status: 'running' | 'succeeded' | 'failed' | 'error';
  phase: 'sync' | 'pre-sync' | 'sync-fail' | 'post-sync';
  startedAt: string;
  finishedAt?: string;
  revision: string;
  resources: Array<{
    kind: string;
    name: string;
    namespace: string;
    status: 'synced' | 'out-of-sync' | 'unknown';
  }>;
}

export default function ArgoCD() {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<ArgoApplication[]>([]);
  const [repositories, setRepositories] = useState<ArgoRepository[]>([]);
  const [clusters, setClusters] = useState<ArgoCluster[]>([]);
  const [projects, setProjects] = useState<ArgoProject[]>([]);
  const [syncOperations, setSyncOperations] = useState<ArgoSyncOperation[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'applications', label: 'Applications' },
    { id: 'repositories', label: 'Repositories' },
    { id: 'clusters', label: 'Clusters' },
    { id: 'projects', label: 'Projects' },
    { id: 'sync', label: 'Sync Operations' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchApplications();
    fetchRepositories();
    fetchClusters();
    fetchProjects();
    fetchSyncOperations();
  }, []);

  const fetchApplications = async () => {
    const mockApplications: ArgoApplication[] = [
      {
        id: '1',
        name: 'frontend-app',
        namespace: 'default',
        project: 'default',
        status: 'healthy',
        syncStatus: 'synced',
        health: 'healthy',
        repository: 'https://github.com/company/frontend-app',
        path: 'k8s/overlays/production',
        targetRevision: 'HEAD',
        cluster: 'https://kubernetes.default.svc',
        lastSync: '2 minutes ago',
        createdAt: '2024-01-10 09:00:00'
      },
      {
        id: '2',
        name: 'backend-api',
        namespace: 'api',
        project: 'microservices',
        status: 'progressing',
        syncStatus: 'out-of-sync',
        health: 'progressing',
        repository: 'https://github.com/company/backend-api',
        path: 'deploy/kubernetes',
        targetRevision: 'v2.1.0',
        cluster: 'https://kubernetes.default.svc',
        lastSync: '10 minutes ago',
        createdAt: '2024-01-08 14:30:00'
      },
      {
        id: '3',
        name: 'monitoring-stack',
        namespace: 'monitoring',
        project: 'infrastructure',
        status: 'healthy',
        syncStatus: 'synced',
        health: 'healthy',
        repository: 'https://github.com/company/monitoring-stack',
        path: 'charts/prometheus',
        targetRevision: 'main',
        cluster: 'https://kubernetes.default.svc',
        lastSync: '1 hour ago',
        createdAt: '2024-01-05 11:15:00'
      }
    ];
    setApplications(mockApplications);
  };

  const fetchRepositories = async () => {
    const mockRepositories: ArgoRepository[] = [
      {
        id: '1',
        url: 'https://github.com/company/frontend-app',
        type: 'git',
        name: 'frontend-app',
        status: 'connected',
        lastConnection: '2 minutes ago',
        credentials: 'https'
      },
      {
        id: '2',
        url: 'https://github.com/company/backend-api',
        type: 'git',
        name: 'backend-api',
        status: 'connected',
        lastConnection: '5 minutes ago',
        credentials: 'ssh'
      },
      {
        id: '3',
        url: 'https://charts.bitnami.com/bitnami',
        type: 'helm',
        name: 'bitnami-charts',
        status: 'connected',
        lastConnection: '1 hour ago',
        credentials: 'https'
      }
    ];
    setRepositories(mockRepositories);
  };

  const fetchClusters = async () => {
    const mockClusters: ArgoCluster[] = [
      {
        id: '1',
        name: 'in-cluster',
        server: 'https://kubernetes.default.svc',
        status: 'connected',
        version: 'v1.28.2',
        nodes: 3,
        lastConnection: '1 minute ago'
      },
      {
        id: '2',
        name: 'staging-cluster',
        server: 'https://staging-k8s.company.com',
        status: 'connected',
        version: 'v1.27.8',
        nodes: 2,
        lastConnection: '5 minutes ago'
      },
      {
        id: '3',
        name: 'production-cluster',
        server: 'https://prod-k8s.company.com',
        status: 'disconnected',
        version: 'v1.28.2',
        nodes: 5,
        lastConnection: '2 hours ago'
      }
    ];
    setClusters(mockClusters);
  };

  const fetchProjects = async () => {
    const mockProjects: ArgoProject[] = [
      {
        id: '1',
        name: 'default',
        description: 'Default ArgoCD project',
        sourceRepos: ['*'],
        destinations: [
          { server: 'https://kubernetes.default.svc', namespace: '*' }
        ],
        roles: [
          { name: 'admin', policies: ['p, proj:default:admin, applications, *, default/*, allow'] }
        ],
        createdAt: '2024-01-01 00:00:00'
      },
      {
        id: '2',
        name: 'microservices',
        description: 'Microservices applications',
        sourceRepos: [
          'https://github.com/company/backend-api',
          'https://github.com/company/user-service'
        ],
        destinations: [
          { server: 'https://kubernetes.default.svc', namespace: 'api' },
          { server: 'https://kubernetes.default.svc', namespace: 'services' }
        ],
        roles: [
          { name: 'developer', policies: ['p, proj:microservices:developer, applications, get, microservices/*, allow'] }
        ],
        createdAt: '2024-01-05 10:00:00'
      }
    ];
    setProjects(mockProjects);
  };

  const fetchSyncOperations = async () => {
    const mockSyncOperations: ArgoSyncOperation[] = [
      {
        id: '1',
        application: 'frontend-app',
        status: 'succeeded',
        phase: 'post-sync',
        startedAt: '2024-01-15 10:28:00',
        finishedAt: '2024-01-15 10:30:00',
        revision: 'abc123def456',
        resources: [
          { kind: 'Deployment', name: 'frontend', namespace: 'default', status: 'synced' },
          { kind: 'Service', name: 'frontend-svc', namespace: 'default', status: 'synced' },
          { kind: 'Ingress', name: 'frontend-ingress', namespace: 'default', status: 'synced' }
        ]
      },
      {
        id: '2',
        application: 'backend-api',
        status: 'running',
        phase: 'sync',
        startedAt: '2024-01-15 10:25:00',
        revision: 'def456ghi789',
        resources: [
          { kind: 'Deployment', name: 'api', namespace: 'api', status: 'out-of-sync' },
          { kind: 'ConfigMap', name: 'api-config', namespace: 'api', status: 'synced' }
        ]
      }
    ];
    setSyncOperations(mockSyncOperations);
  };

  const syncApplication = async (applicationId: string) => {
    setLoading(true);
    try {
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, syncStatus: 'synced', lastSync: 'Just now' }
          : app
      ));
    } catch (error) {
      console.error('Error syncing application:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">ArgoCD Applications</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      <div className="grid gap-4">
        {applications.map(app => (
          <Card key={app.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  app.health === 'healthy' ? 'bg-green-600' :
                  app.health === 'progressing' ? 'bg-blue-600' :
                  app.health === 'degraded' ? 'bg-red-600' : 'bg-gray-600'
                }`}>
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{app.name}</h3>
                  <p className="text-gray-400">{app.repository}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>Project: {app.project}</span>
                    <span>Namespace: {app.namespace}</span>
                    <span>Path: {app.path}</span>
                    <span>Last sync: {app.lastSync}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Health:</span>
                    <StatusBadge status={app.health} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Sync:</span>
                    <StatusBadge status={app.syncStatus} />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => syncApplication(app.id)}
                    loading={loading}
                  >
                    <Sync className="w-4 h-4 mr-1" />
                    Sync
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRepositories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Git Repositories</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Connect Repository
        </Button>
      </div>

      <div className="grid gap-4">
        {repositories.map(repo => (
          <Card key={repo.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  repo.type === 'git' ? 'bg-orange-600' :
                  repo.type === 'helm' ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  {repo.type === 'git' && <GitBranch className="w-6 h-6 text-white" />}
                  {repo.type === 'helm' && <Package className="w-6 h-6 text-white" />}
                  {repo.type === 'oci' && <Package className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{repo.name}</h3>
                  <p className="text-gray-400">{repo.url}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="capitalize">{repo.type} repository</span>
                    <span className="capitalize">{repo.credentials} auth</span>
                    <span>Last connection: {repo.lastConnection}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={repo.status} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderClusters = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kubernetes Clusters</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Cluster
        </Button>
      </div>

      <div className="grid gap-4">
        {clusters.map(cluster => (
          <Card key={cluster.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  cluster.status === 'connected' ? 'bg-green-600' :
                  cluster.status === 'disconnected' ? 'bg-red-600' : 'bg-gray-600'
                }`}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{cluster.name}</h3>
                  <p className="text-gray-400">{cluster.server}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>Version: {cluster.version}</span>
                    <span>{cluster.nodes} nodes</span>
                    <span>Last connection: {cluster.lastConnection}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={cluster.status} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">ArgoCD Projects</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map(project => (
          <Card key={project.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <GitMerge className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-gray-400">{project.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>{project.sourceRepos.length} source repos</span>
                    <span>{project.destinations.length} destinations</span>
                    <span>{project.roles.length} roles</span>
                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="secondary">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit className="w-4 h-4" />
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

  const renderSyncOperations = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sync Operations</h2>
      
      <div className="grid gap-4">
        {syncOperations.map(operation => (
          <Card key={operation.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  operation.status === 'succeeded' ? 'bg-green-600' :
                  operation.status === 'failed' ? 'bg-red-600' :
                  operation.status === 'running' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  {operation.status === 'succeeded' && <CheckCircle className="w-6 h-6 text-white" />}
                  {operation.status === 'failed' && <XCircle className="w-6 h-6 text-white" />}
                  {operation.status === 'running' && <Clock className="w-6 h-6 text-white" />}
                  {operation.status === 'error' && <AlertTriangle className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{operation.application}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className="capitalize">{operation.phase}</span>
                    <span>Started: {operation.startedAt}</span>
                    {operation.finishedAt && (
                      <span>Finished: {operation.finishedAt}</span>
                    )}
                    <span>Revision: {operation.revision.substring(0, 8)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {operation.resources.map((resource, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded ${
                            resource.status === 'synced' ? 'bg-green-600' :
                            resource.status === 'out-of-sync' ? 'bg-red-600' : 'bg-gray-600'
                          }`}
                        >
                          {resource.kind}/{resource.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={operation.status} />
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

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">ArgoCD Settings</h2>
      
      <Card title="Server Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">ArgoCD Server URL</label>
            <input
              type="url"
              defaultValue="https://argocd.company.com"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Project</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="default">default</option>
              <option value="microservices">microservices</option>
              <option value="infrastructure">infrastructure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sync Policy</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Sync Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sync Timeout (seconds)</label>
            <input
              type="number"
              defaultValue="300"
              min="60"
              max="3600"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Retry Limit</label>
            <input
              type="number"
              defaultValue="5"
              min="1"
              max="10"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Auto-sync enabled</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Self-heal enabled</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Prune resources</span>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Notification Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Webhook URL</label>
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Notify on sync success</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Notify on sync failure</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Notify on health degraded</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'applications': return renderApplications();
      case 'repositories': return renderRepositories();
      case 'clusters': return renderClusters();
      case 'projects': return renderProjects();
      case 'sync': return renderSyncOperations();
      case 'settings': return renderSettings();
      default: return renderApplications();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <GitMerge className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold">ArgoCD</h1>
            <p className="text-gray-400">GitOps continuous delivery for Kubernetes</p>
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