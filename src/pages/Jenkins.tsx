import React, { useState, useEffect } from 'react';
import { 
  Hammer, 
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
  Terminal,
  Activity,
  User,
  Calendar,
  Hash,
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface JenkinsJob {
  name: string;
  url: string;
  color: 'blue' | 'red' | 'yellow' | 'grey' | 'disabled';
  buildable: boolean;
  lastBuild: {
    number: number;
    url: string;
    result: 'SUCCESS' | 'FAILURE' | 'UNSTABLE' | 'ABORTED' | null;
    building: boolean;
    duration: number;
    timestamp: number;
  } | null;
  nextBuildNumber: number;
  inQueue: boolean;
  description: string;
}

interface JenkinsBuild {
  number: number;
  url: string;
  result: 'SUCCESS' | 'FAILURE' | 'UNSTABLE' | 'ABORTED' | null;
  building: boolean;
  duration: number;
  timestamp: number;
  description: string;
  fullDisplayName: string;
  changeSet: {
    items: Array<{
      author: { fullName: string };
      comment: string;
      date: string;
    }>;
  };
}

interface JenkinsNode {
  displayName: string;
  description: string;
  numExecutors: number;
  mode: 'NORMAL' | 'EXCLUSIVE';
  offline: boolean;
  temporarilyOffline: boolean;
  offlineCause: string | null;
  monitorData: {
    'hudson.node_monitors.SwapSpaceMonitor': {
      availableSwapSpace: number;
      totalSwapSpace: number;
    };
    'hudson.node_monitors.TemporarySpaceMonitor': {
      size: number;
    };
    'hudson.node_monitors.DiskSpaceMonitor': {
      size: number;
    };
  };
}

export default function Jenkins() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState<JenkinsJob[]>([]);
  const [builds, setBuilds] = useState<JenkinsBuild[]>([]);
  const [nodes, setNodes] = useState<JenkinsNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const tabs = [
    { id: 'jobs', label: 'Jobs' },
    { id: 'builds', label: 'Build History' },
    { id: 'nodes', label: 'Build Nodes' },
    { id: 'queue', label: 'Build Queue' },
    { id: 'plugins', label: 'Plugins' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchJobs();
    fetchBuilds();
    fetchNodes();
  }, []);

  const fetchJobs = async () => {
    const mockJobs: JenkinsJob[] = [
      {
        name: 'frontend-build',
        url: 'http://jenkins.local/job/frontend-build/',
        color: 'blue',
        buildable: true,
        lastBuild: {
          number: 45,
          url: 'http://jenkins.local/job/frontend-build/45/',
          result: 'SUCCESS',
          building: false,
          duration: 180000,
          timestamp: Date.now() - 3600000
        },
        nextBuildNumber: 46,
        inQueue: false,
        description: 'Build and test frontend application'
      },
      {
        name: 'backend-api-test',
        url: 'http://jenkins.local/job/backend-api-test/',
        color: 'red',
        buildable: true,
        lastBuild: {
          number: 23,
          url: 'http://jenkins.local/job/backend-api-test/23/',
          result: 'FAILURE',
          building: false,
          duration: 120000,
          timestamp: Date.now() - 1800000
        },
        nextBuildNumber: 24,
        inQueue: false,
        description: 'Run API tests and integration tests'
      },
      {
        name: 'deploy-production',
        url: 'http://jenkins.local/job/deploy-production/',
        color: 'yellow',
        buildable: true,
        lastBuild: {
          number: 12,
          url: 'http://jenkins.local/job/deploy-production/12/',
          result: null,
          building: true,
          duration: 0,
          timestamp: Date.now() - 300000
        },
        nextBuildNumber: 13,
        inQueue: false,
        description: 'Deploy application to production environment'
      },
      {
        name: 'security-scan',
        url: 'http://jenkins.local/job/security-scan/',
        color: 'blue',
        buildable: true,
        lastBuild: {
          number: 8,
          url: 'http://jenkins.local/job/security-scan/8/',
          result: 'SUCCESS',
          building: false,
          duration: 240000,
          timestamp: Date.now() - 7200000
        },
        nextBuildNumber: 9,
        inQueue: true,
        description: 'Run security vulnerability scans'
      }
    ];
    setJobs(mockJobs);
  };

  const fetchBuilds = async () => {
    const mockBuilds: JenkinsBuild[] = [
      {
        number: 45,
        url: 'http://jenkins.local/job/frontend-build/45/',
        result: 'SUCCESS',
        building: false,
        duration: 180000,
        timestamp: Date.now() - 3600000,
        description: 'Build #45',
        fullDisplayName: 'frontend-build #45',
        changeSet: {
          items: [
            {
              author: { fullName: 'John Doe' },
              comment: 'Fix authentication bug',
              date: '2024-01-15T10:30:00Z'
            }
          ]
        }
      },
      {
        number: 23,
        url: 'http://jenkins.local/job/backend-api-test/23/',
        result: 'FAILURE',
        building: false,
        duration: 120000,
        timestamp: Date.now() - 1800000,
        description: 'Build #23',
        fullDisplayName: 'backend-api-test #23',
        changeSet: {
          items: [
            {
              author: { fullName: 'Jane Smith' },
              comment: 'Add new API endpoint',
              date: '2024-01-15T11:00:00Z'
            }
          ]
        }
      },
      {
        number: 12,
        url: 'http://jenkins.local/job/deploy-production/12/',
        result: null,
        building: true,
        duration: 0,
        timestamp: Date.now() - 300000,
        description: 'Build #12',
        fullDisplayName: 'deploy-production #12',
        changeSet: {
          items: []
        }
      }
    ];
    setBuilds(mockBuilds);
  };

  const fetchNodes = async () => {
    const mockNodes: JenkinsNode[] = [
      {
        displayName: 'master',
        description: 'Jenkins master node',
        numExecutors: 2,
        mode: 'NORMAL',
        offline: false,
        temporarilyOffline: false,
        offlineCause: null,
        monitorData: {
          'hudson.node_monitors.SwapSpaceMonitor': {
            availableSwapSpace: 2147483648,
            totalSwapSpace: 4294967296
          },
          'hudson.node_monitors.TemporarySpaceMonitor': {
            size: 10737418240
          },
          'hudson.node_monitors.DiskSpaceMonitor': {
            size: 53687091200
          }
        }
      },
      {
        displayName: 'build-agent-1',
        description: 'Linux build agent',
        numExecutors: 4,
        mode: 'NORMAL',
        offline: false,
        temporarilyOffline: false,
        offlineCause: null,
        monitorData: {
          'hudson.node_monitors.SwapSpaceMonitor': {
            availableSwapSpace: 4294967296,
            totalSwapSpace: 8589934592
          },
          'hudson.node_monitors.TemporarySpaceMonitor': {
            size: 21474836480
          },
          'hudson.node_monitors.DiskSpaceMonitor': {
            size: 107374182400
          }
        }
      },
      {
        displayName: 'build-agent-2',
        description: 'Windows build agent',
        numExecutors: 2,
        mode: 'EXCLUSIVE',
        offline: true,
        temporarilyOffline: true,
        offlineCause: 'Maintenance',
        monitorData: {
          'hudson.node_monitors.SwapSpaceMonitor': {
            availableSwapSpace: 0,
            totalSwapSpace: 4294967296
          },
          'hudson.node_monitors.TemporarySpaceMonitor': {
            size: 0
          },
          'hudson.node_monitors.DiskSpaceMonitor': {
            size: 0
          }
        }
      }
    ];
    setNodes(mockNodes);
  };

  const triggerBuild = async (jobName: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setJobs(prev => prev.map(job => 
        job.name === jobName 
          ? { ...job, inQueue: true }
          : job
      ));
      
      // Simulate build start
      setTimeout(() => {
        setJobs(prev => prev.map(job => 
          job.name === jobName 
            ? { 
                ...job, 
                inQueue: false,
                lastBuild: {
                  ...job.lastBuild!,
                  building: true,
                  result: null
                }
              }
            : job
        ));
      }, 3000);
    } catch (error) {
      console.error('Error triggering build:', error);
    } finally {
      setLoading(false);
    }
  };

  const getJobStatusColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-600';
      case 'red': return 'bg-red-600';
      case 'yellow': return 'bg-yellow-600';
      case 'grey': return 'bg-gray-600';
      case 'disabled': return 'bg-gray-500';
      default: return 'bg-gray-600';
    }
  };

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Jenkins Jobs</h2>
        <div className="flex space-x-3">
          <Button onClick={fetchJobs} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {jobs.map(job => (
          <Card key={job.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getJobStatusColor(job.color)}`}>
                  <Hammer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{job.name}</h3>
                  <p className="text-gray-400">{job.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    {job.lastBuild && (
                      <>
                        <span>Last build: #{job.lastBuild.number}</span>
                        <span>
                          {job.lastBuild.building ? 'Building...' : 
                           job.lastBuild.result || 'Unknown'}
                        </span>
                        <span>
                          {new Date(job.lastBuild.timestamp).toLocaleString()}
                        </span>
                      </>
                    )}
                    {job.inQueue && (
                      <span className="text-yellow-400">In Queue</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge 
                  status={
                    job.lastBuild?.building ? 'building' :
                    job.lastBuild?.result?.toLowerCase() || 'unknown'
                  } 
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => triggerBuild(job.name)}
                    loading={loading}
                    disabled={job.inQueue || job.lastBuild?.building}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Build
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

  const renderBuilds = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Build History</h2>
        <Button onClick={fetchBuilds} loading={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {builds.map(build => (
          <Card key={`${build.fullDisplayName}-${build.number}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  build.building ? 'bg-blue-600' :
                  build.result === 'SUCCESS' ? 'bg-green-600' :
                  build.result === 'FAILURE' ? 'bg-red-600' :
                  build.result === 'UNSTABLE' ? 'bg-yellow-600' : 'bg-gray-600'
                }`}>
                  {build.building && <Clock className="w-6 h-6 text-white" />}
                  {build.result === 'SUCCESS' && <CheckCircle className="w-6 h-6 text-white" />}
                  {build.result === 'FAILURE' && <XCircle className="w-6 h-6 text-white" />}
                  {build.result === 'UNSTABLE' && <AlertTriangle className="w-6 h-6 text-white" />}
                  {!build.building && !build.result && <Clock className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{build.fullDisplayName}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>
                      {build.building ? 'Building...' : 
                       build.result || 'Unknown'}
                    </span>
                    <span>
                      Duration: {build.building ? 'In progress' : 
                                `${Math.floor(build.duration / 1000)}s`}
                    </span>
                    <span>
                      {new Date(build.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {build.changeSet.items.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-400">Changes by: </span>
                      {build.changeSet.items.map((item, index) => (
                        <span key={index} className="text-blue-400">
                          {item.author.fullName}
                          {index < build.changeSet.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge 
                  status={
                    build.building ? 'building' :
                    build.result?.toLowerCase() || 'unknown'
                  } 
                />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Terminal className="w-4 h-4" />
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

  const renderNodes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Build Nodes</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Node
        </Button>
      </div>

      <div className="grid gap-4">
        {nodes.map(node => (
          <Card key={node.displayName}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  node.offline ? 'bg-red-600' : 'bg-green-600'
                }`}>
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{node.displayName}</h3>
                  <p className="text-gray-400">{node.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>Executors: {node.numExecutors}</span>
                    <span>Mode: {node.mode}</span>
                    {node.offlineCause && (
                      <span className="text-red-400">Offline: {node.offlineCause}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm">
                    <span>
                      Disk: {Math.round(node.monitorData['hudson.node_monitors.DiskSpaceMonitor'].size / 1024 / 1024 / 1024)}GB
                    </span>
                    <span>
                      Temp: {Math.round(node.monitorData['hudson.node_monitors.TemporarySpaceMonitor'].size / 1024 / 1024 / 1024)}GB
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={node.offline ? 'offline' : 'online'} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Terminal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderQueue = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Build Queue</h2>
      
      <div className="grid gap-4">
        {jobs.filter(job => job.inQueue).map(job => (
          <Card key={job.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-600 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{job.name}</h3>
                  <p className="text-gray-400">Waiting for available executor</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Next build: #{job.nextBuildNumber}</span>
                    <span>Queued for: 2 minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status="queued" />
                <Button size="sm" variant="secondary">
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {jobs.filter(job => job.inQueue).length === 0 && (
          <Card>
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No jobs in queue</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  const renderPlugins = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Installed Plugins</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Install Plugin
        </Button>
      </div>

      <div className="grid gap-4">
        {[
          { name: 'Git Plugin', version: '4.8.3', enabled: true, description: 'Git SCM support' },
          { name: 'Pipeline', version: '2.6', enabled: true, description: 'Pipeline as Code' },
          { name: 'Docker Pipeline', version: '1.28', enabled: true, description: 'Docker integration' },
          { name: 'Blue Ocean', version: '1.25.0', enabled: false, description: 'Modern UI for Jenkins' },
          { name: 'SonarQube Scanner', version: '2.15', enabled: true, description: 'Code quality analysis' }
        ].map((plugin, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{plugin.name}</h3>
                <p className="text-gray-400">{plugin.description}</p>
                <p className="text-sm text-gray-500 mt-1">Version: {plugin.version}</p>
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge status={plugin.enabled ? 'enabled' : 'disabled'} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Settings className="w-4 h-4" />
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

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Jenkins Settings</h2>
      
      <Card title="System Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Jenkins URL</label>
            <input
              type="url"
              defaultValue="http://jenkins.local:8080"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">System Admin Email</label>
            <input
              type="email"
              defaultValue="admin@jenkins.local"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Executors</label>
            <input
              type="number"
              defaultValue="2"
              min="1"
              max="10"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>

      <Card title="Security">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Security</p>
              <p className="text-sm text-gray-400">Enable Jenkins security features</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Security Realm</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="jenkins">Jenkins' own user database</option>
              <option value="ldap">LDAP</option>
              <option value="unix">Unix user/group database</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Authorization</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="anyone">Anyone can do anything</option>
              <option value="logged-in">Logged-in users can do anything</option>
              <option value="matrix">Matrix-based security</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'jobs': return renderJobs();
      case 'builds': return renderBuilds();
      case 'nodes': return renderNodes();
      case 'queue': return renderQueue();
      case 'plugins': return renderPlugins();
      case 'settings': return renderSettings();
      default: return renderJobs();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Hammer className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold">Jenkins</h1>
            <p className="text-gray-400">Build automation and continuous integration</p>
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