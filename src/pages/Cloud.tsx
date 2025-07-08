import React, { useState, useEffect } from 'react';
import { 
  Cloud as CloudIcon, 
  Server, 
  Database, 
  DollarSign, 
  Play, 
  Square, 
  RefreshCw,
  Settings,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MetricsChart } from '@/components/common/MetricsChart';

interface CloudResource {
  id: string;
  name: string;
  type: 'ec2' | 's3' | 'rds' | 'lambda';
  status: 'running' | 'stopped' | 'pending' | 'terminated';
  region: string;
  cost: number;
  specs?: {
    cpu?: string;
    memory?: string;
    storage?: string;
  };
  lastActivity: string;
}

interface CloudMetrics {
  timestamp: number;
  cpu: number;
  memory: number;
  network: number;
  cost: number;
}

export default function Cloud() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProvider, setSelectedProvider] = useState('aws');
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [metrics, setMetrics] = useState<CloudMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    aws: { accessKey: '', secretKey: '', region: 'us-east-1' },
    azure: { subscriptionId: '', clientId: '', clientSecret: '', tenantId: '' },
    gcp: { projectId: '', keyFile: '' }
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'instances', label: 'Instances' },
    { id: 'storage', label: 'Storage' },
    { id: 'costs', label: 'Costs' },
    { id: 'settings', label: 'Settings' }
  ];

  const providers = [
    { id: 'aws', name: 'Amazon Web Services', icon: CloudIcon },
    { id: 'azure', name: 'Microsoft Azure', icon: CloudIcon },
    { id: 'gcp', name: 'Google Cloud Platform', icon: CloudIcon }
  ];

  useEffect(() => {
    fetchResources();
    fetchMetrics();
    const interval = setInterval(() => {
      fetchResources();
      fetchMetrics();
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedProvider]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Simulate API call to cloud provider
      const mockResources: CloudResource[] = [
        {
          id: 'i-1234567890abcdef0',
          name: 'web-server-prod',
          type: 'ec2',
          status: 'running',
          region: 'us-east-1',
          cost: 45.67,
          specs: { cpu: '2 vCPUs', memory: '4 GB', storage: '20 GB SSD' },
          lastActivity: '2 minutes ago'
        },
        {
          id: 'i-0987654321fedcba0',
          name: 'api-server-staging',
          type: 'ec2',
          status: 'stopped',
          region: 'us-west-2',
          cost: 0,
          specs: { cpu: '1 vCPU', memory: '2 GB', storage: '10 GB SSD' },
          lastActivity: '1 hour ago'
        },
        {
          id: 'bucket-prod-assets',
          name: 'prod-assets-bucket',
          type: 's3',
          status: 'running',
          region: 'us-east-1',
          cost: 12.34,
          specs: { storage: '150 GB' },
          lastActivity: '5 minutes ago'
        }
      ];
      setResources(mockResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    // Simulate metrics data
    const mockMetrics: CloudMetrics[] = Array.from({ length: 24 }, (_, i) => ({
      timestamp: Date.now() - (23 - i) * 3600000,
      cpu: Math.random() * 80 + 10,
      memory: Math.random() * 70 + 20,
      network: Math.random() * 100,
      cost: Math.random() * 50 + 10
    }));
    setMetrics(mockMetrics);
  };

  const handleInstanceAction = async (resourceId: string, action: 'start' | 'stop' | 'restart') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResources(prev => prev.map(resource => 
        resource.id === resourceId 
          ? { 
              ...resource, 
              status: action === 'start' ? 'running' : action === 'stop' ? 'stopped' : 'pending',
              lastActivity: 'Just now'
            }
          : resource
      ));
    } catch (error) {
      console.error(`Error ${action}ing instance:`, error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Instances</p>
              <p className="text-white text-2xl font-bold">
                {resources.filter(r => r.type === 'ec2').length}
              </p>
            </div>
            <Server className="w-8 h-8 text-blue-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Running</p>
              <p className="text-white text-2xl font-bold">
                {resources.filter(r => r.status === 'running').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Storage</p>
              <p className="text-white text-2xl font-bold">
                {resources.filter(r => r.type === 's3').length}
              </p>
            </div>
            <Database className="w-8 h-8 text-purple-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Monthly Cost</p>
              <p className="text-white text-2xl font-bold">
                ${resources.reduce((sum, r) => sum + r.cost, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="CPU Usage">
          <MetricsChart
            data={metrics}
            dataKey="cpu"
            name="CPU %"
            color="#3B82F6"
          />
        </Card>

        <Card title="Memory Usage">
          <MetricsChart
            data={metrics}
            dataKey="memory"
            name="Memory %"
            color="#10B981"
          />
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-3">
          {resources.slice(0, 5).map(resource => (
            <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {resource.type === 'ec2' ? <Server className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                <div>
                  <p className="font-medium">{resource.name}</p>
                  <p className="text-sm text-gray-400">{resource.region}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge status={resource.status} />
                <span className="text-sm text-gray-400">{resource.lastActivity}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderInstances = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">EC2 Instances</h2>
        <Button onClick={fetchResources} loading={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {resources.filter(r => r.type === 'ec2').map(instance => (
          <Card key={instance.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{instance.name}</h3>
                  <p className="text-gray-400">{instance.id}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="flex items-center">
                      <Cpu className="w-4 h-4 mr-1" />
                      {instance.specs?.cpu}
                    </span>
                    <span className="flex items-center">
                      <MemoryStick className="w-4 h-4 mr-1" />
                      {instance.specs?.memory}
                    </span>
                    <span className="flex items-center">
                      <HardDrive className="w-4 h-4 mr-1" />
                      {instance.specs?.storage}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <StatusBadge status={instance.status} />
                  <p className="text-sm text-gray-400 mt-1">{instance.region}</p>
                  <p className="text-sm font-medium">${instance.cost}/month</p>
                </div>

                <div className="flex space-x-2">
                  {instance.status === 'stopped' ? (
                    <Button
                      size="sm"
                      onClick={() => handleInstanceAction(instance.id, 'start')}
                      loading={loading}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleInstanceAction(instance.id, 'stop')}
                      loading={loading}
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleInstanceAction(instance.id, 'restart')}
                    loading={loading}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Storage Resources</h2>
      
      <div className="grid gap-4">
        {resources.filter(r => r.type === 's3').map(bucket => (
          <Card key={bucket.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{bucket.name}</h3>
                  <p className="text-gray-400">{bucket.id}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {bucket.specs?.storage} • {bucket.region}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <StatusBadge status={bucket.status} />
                <p className="text-sm font-medium mt-1">${bucket.cost}/month</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCosts = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Cost Analysis</h2>
      
      <Card title="Monthly Cost Trend">
        <MetricsChart
          data={metrics}
          dataKey="cost"
          name="Cost ($)"
          color="#F59E0B"
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Cost by Service">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>EC2 Instances</span>
              <span className="font-medium">
                ${resources.filter(r => r.type === 'ec2').reduce((sum, r) => sum + r.cost, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>S3 Storage</span>
              <span className="font-medium">
                ${resources.filter(r => r.type === 's3').reduce((sum, r) => sum + r.cost, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Cost Optimization">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">2 stopped instances still incurring costs</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Reserved instances saving 30%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Cloud Provider Settings</h2>
      
      <div className="grid gap-6">
        {providers.map(provider => (
          <Card key={provider.id} title={provider.name}>
            <div className="space-y-4">
              {provider.id === 'aws' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Access Key ID</label>
                    <input
                      type="text"
                      value={credentials.aws.accessKey}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        aws: { ...prev.aws, accessKey: e.target.value }
                      }))}
                      className="w-full bg-gray-700 rounded-md px-3 py-2"
                      placeholder="AKIA..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Secret Access Key</label>
                    <input
                      type="password"
                      value={credentials.aws.secretKey}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        aws: { ...prev.aws, secretKey: e.target.value }
                      }))}
                      className="w-full bg-gray-700 rounded-md px-3 py-2"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Region</label>
                    <select
                      value={credentials.aws.region}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        aws: { ...prev.aws, region: e.target.value }
                      }))}
                      className="w-full bg-gray-700 rounded-md px-3 py-2"
                    >
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="us-west-2">US West (Oregon)</option>
                      <option value="eu-west-1">Europe (Ireland)</option>
                      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    </select>
                  </div>
                </>
              )}
              
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'instances': return renderInstances();
      case 'storage': return renderStorage();
      case 'costs': return renderCosts();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CloudIcon className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold">Cloud Management</h1>
              <p className="text-gray-400">Manage your cloud infrastructure across providers</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-gray-700 rounded-md px-3 py-2"
            >
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
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