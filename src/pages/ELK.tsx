import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Settings,
  Plus,
  Trash2,
  Edit,
  Filter,
  TrendingUp,
  Database,
  Server,
  Globe
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MetricsChart } from '@/components/common/MetricsChart';

interface ElasticsearchIndex {
  name: string;
  health: 'green' | 'yellow' | 'red';
  status: 'open' | 'close';
  uuid: string;
  pri: number;
  rep: number;
  docsCount: number;
  docsDeleted: number;
  storeSize: string;
  priStoreSize: string;
}

interface LogstashPipeline {
  id: string;
  status: 'running' | 'stopped' | 'error';
  workers: number;
  batchSize: number;
  batchDelay: number;
  configReloadAutomatic: boolean;
  configReloadInterval: string;
}

interface KibanaVisualization {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'table' | 'metric';
  description: string;
  savedObjectsCount: number;
  lastModified: string;
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
  host: string;
  tags: string[];
}

export default function ELK() {
  const [activeTab, setActiveTab] = useState('overview');
  const [indices, setIndices] = useState<ElasticsearchIndex[]>([]);
  const [pipelines, setPipelines] = useState<LogstashPipeline[]>([]);
  const [visualizations, setVisualizations] = useState<KibanaVisualization[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'elasticsearch', label: 'Elasticsearch' },
    { id: 'logstash', label: 'Logstash' },
    { id: 'kibana', label: 'Kibana' },
    { id: 'logs', label: 'Logs' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchIndices();
    fetchPipelines();
    fetchVisualizations();
    fetchLogs();
    fetchMetrics();
  }, []);

  const fetchIndices = async () => {
    const mockIndices: ElasticsearchIndex[] = [
      {
        name: 'logstash-2024.01.15',
        health: 'green',
        status: 'open',
        uuid: 'abc123def456',
        pri: 1,
        rep: 1,
        docsCount: 1234567,
        docsDeleted: 0,
        storeSize: '2.3gb',
        priStoreSize: '1.2gb'
      },
      {
        name: 'application-logs-2024.01',
        health: 'yellow',
        status: 'open',
        uuid: 'def456ghi789',
        pri: 5,
        rep: 1,
        docsCount: 987654,
        docsDeleted: 123,
        storeSize: '1.8gb',
        priStoreSize: '900mb'
      },
      {
        name: 'security-events',
        health: 'green',
        status: 'open',
        uuid: 'ghi789jkl012',
        pri: 3,
        rep: 2,
        docsCount: 456789,
        docsDeleted: 45,
        storeSize: '756mb',
        priStoreSize: '252mb'
      }
    ];
    setIndices(mockIndices);
  };

  const fetchPipelines = async () => {
    const mockPipelines: LogstashPipeline[] = [
      {
        id: 'main',
        status: 'running',
        workers: 4,
        batchSize: 125,
        batchDelay: 50,
        configReloadAutomatic: true,
        configReloadInterval: '3s'
      },
      {
        id: 'security-pipeline',
        status: 'running',
        workers: 2,
        batchSize: 100,
        batchDelay: 25,
        configReloadAutomatic: false,
        configReloadInterval: '10s'
      },
      {
        id: 'metrics-pipeline',
        status: 'stopped',
        workers: 1,
        batchSize: 50,
        batchDelay: 10,
        configReloadAutomatic: true,
        configReloadInterval: '5s'
      }
    ];
    setPipelines(mockPipelines);
  };

  const fetchVisualizations = async () => {
    const mockVisualizations: KibanaVisualization[] = [
      {
        id: '1',
        title: 'Application Error Rate',
        type: 'line',
        description: 'Error rate over time for all applications',
        savedObjectsCount: 15,
        lastModified: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Top Error Messages',
        type: 'table',
        description: 'Most frequent error messages',
        savedObjectsCount: 8,
        lastModified: '2024-01-14T16:45:00Z'
      },
      {
        id: '3',
        title: 'Service Response Times',
        type: 'bar',
        description: 'Average response times by service',
        savedObjectsCount: 12,
        lastModified: '2024-01-13T09:15:00Z'
      }
    ];
    setVisualizations(mockVisualizations);
  };

  const fetchLogs = async () => {
    const mockLogs: LogEntry[] = [
      {
        timestamp: '2024-01-15T11:30:15.123Z',
        level: 'ERROR',
        service: 'api-gateway',
        message: 'Failed to connect to downstream service',
        host: 'api-01',
        tags: ['error', 'connection', 'timeout']
      },
      {
        timestamp: '2024-01-15T11:30:10.456Z',
        level: 'INFO',
        service: 'user-service',
        message: 'User authentication successful',
        host: 'user-01',
        tags: ['auth', 'success']
      },
      {
        timestamp: '2024-01-15T11:30:05.789Z',
        level: 'WARN',
        service: 'database',
        message: 'Connection pool near capacity',
        host: 'db-01',
        tags: ['database', 'performance', 'warning']
      },
      {
        timestamp: '2024-01-15T11:30:00.012Z',
        level: 'DEBUG',
        service: 'cache-service',
        message: 'Cache hit for key: user:12345',
        host: 'cache-01',
        tags: ['cache', 'hit', 'performance']
      }
    ];
    setLogs(mockLogs);
  };

  const fetchMetrics = async () => {
    const now = Date.now();
    const mockMetrics = Array.from({ length: 60 }, (_, i) => ({
      timestamp: now - (59 - i) * 60000,
      indexing_rate: Math.random() * 1000 + 500,
      search_rate: Math.random() * 500 + 200,
      cpu_usage: Math.random() * 80 + 10,
      memory_usage: Math.random() * 70 + 20,
      disk_usage: Math.random() * 60 + 30
    }));
    setMetrics(mockMetrics);
  };

  const renderOverview = () => {
    const totalDocs = indices.reduce((sum, idx) => sum + idx.docsCount, 0);
    const totalSize = indices.reduce((sum, idx) => {
      const sizeNum = parseFloat(idx.storeSize.replace(/[^\d.]/g, ''));
      return sum + (idx.storeSize.includes('gb') ? sizeNum * 1024 : sizeNum);
    }, 0);
    const healthyIndices = indices.filter(idx => idx.health === 'green').length;
    const runningPipelines = pipelines.filter(p => p.status === 'running').length;

    return (
      <div className="space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-600 to-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Cluster Health</p>
                <p className="text-white text-2xl font-bold">
                  {healthyIndices === indices.length ? 'Green' : 'Yellow'}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Documents</p>
                <p className="text-white text-2xl font-bold">
                  {(totalDocs / 1000000).toFixed(1)}M
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Storage Used</p>
                <p className="text-white text-2xl font-bold">
                  {(totalSize / 1024).toFixed(1)}GB
                </p>
              </div>
              <Database className="w-8 h-8 text-purple-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Active Pipelines</p>
                <p className="text-white text-2xl font-bold">{runningPipelines}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Metrics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Indexing Rate">
            <MetricsChart
              data={metrics}
              dataKey="indexing_rate"
              name="Docs/sec"
              color="#3B82F6"
            />
          </Card>

          <Card title="Search Rate">
            <MetricsChart
              data={metrics}
              dataKey="search_rate"
              name="Queries/sec"
              color="#10B981"
            />
          </Card>

          <Card title="CPU Usage">
            <MetricsChart
              data={metrics}
              dataKey="cpu_usage"
              name="CPU %"
              color="#F59E0B"
            />
          </Card>

          <Card title="Memory Usage">
            <MetricsChart
              data={metrics}
              dataKey="memory_usage"
              name="Memory %"
              color="#8B5CF6"
            />
          </Card>
        </div>

        {/* Recent Logs */}
        <Card title="Recent Log Events">
          <div className="space-y-3">
            {logs.slice(0, 5).map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {log.level === 'ERROR' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                  {log.level === 'WARN' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                  {log.level === 'INFO' && <CheckCircle className="w-5 h-5 text-blue-400" />}
                  {log.level === 'DEBUG' && <Activity className="w-5 h-5 text-gray-400" />}
                  <div>
                    <p className="font-medium">{log.service}: {log.message}</p>
                    <p className="text-sm text-gray-400">
                      {log.host} • {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <StatusBadge status={log.level.toLowerCase()} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderElasticsearch = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Elasticsearch Indices</h2>
        <div className="flex space-x-3">
          <Button onClick={fetchIndices} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Index
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Index
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {indices.map(index => (
                <tr key={index.name} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                    {index.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={index.health} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={index.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {index.docsCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {index.storeSize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderLogstash = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Logstash Pipelines</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Pipeline
        </Button>
      </div>

      <div className="grid gap-4">
        {pipelines.map(pipeline => (
          <Card key={pipeline.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  pipeline.status === 'running' ? 'bg-green-600' :
                  pipeline.status === 'stopped' ? 'bg-gray-600' : 'bg-red-600'
                }`}>
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{pipeline.id}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Workers: {pipeline.workers}</span>
                    <span>Batch Size: {pipeline.batchSize}</span>
                    <span>Batch Delay: {pipeline.batchDelay}ms</span>
                    <span>Auto Reload: {pipeline.configReloadAutomatic ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={pipeline.status} />
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderKibana = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kibana Dashboards</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Dashboard
        </Button>
      </div>

      <div className="grid gap-4">
        {visualizations.map(viz => (
          <Card key={viz.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  viz.type === 'line' ? 'bg-blue-600' :
                  viz.type === 'bar' ? 'bg-green-600' :
                  viz.type === 'pie' ? 'bg-purple-600' :
                  viz.type === 'table' ? 'bg-orange-600' : 'bg-gray-600'
                }`}>
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{viz.title}</h3>
                  <p className="text-gray-400">{viz.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className="capitalize">{viz.type} chart</span>
                    <span>{viz.savedObjectsCount} objects</span>
                    <span>Modified: {new Date(viz.lastModified).toLocaleDateString()}</span>
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
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Log Search</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 bg-gray-700 rounded-md text-sm w-64"
            />
          </div>
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={fetchLogs} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="p-3 bg-gray-700 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {log.level === 'ERROR' && <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />}
                  {log.level === 'WARN' && <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />}
                  {log.level === 'INFO' && <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />}
                  {log.level === 'DEBUG' && <Activity className="w-5 h-5 text-gray-400 mt-0.5" />}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{log.service}</span>
                      <span className="text-sm text-gray-400">@{log.host}</span>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{log.message}</p>
                    <div className="flex flex-wrap gap-1">
                      {log.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <StatusBadge status={log.level.toLowerCase()} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">ELK Stack Settings</h2>
      
      <Card title="Elasticsearch Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cluster Name</label>
            <input
              type="text"
              defaultValue="elasticsearch-cluster"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Node Name</label>
            <input
              type="text"
              defaultValue="elasticsearch-node-1"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">HTTP Port</label>
            <input
              type="number"
              defaultValue="9200"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transport Port</label>
            <input
              type="number"
              defaultValue="9300"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>

      <Card title="Logstash Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pipeline Workers</label>
            <input
              type="number"
              defaultValue="4"
              min="1"
              max="16"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pipeline Batch Size</label>
            <input
              type="number"
              defaultValue="125"
              min="1"
              max="1000"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pipeline Batch Delay</label>
            <input
              type="number"
              defaultValue="50"
              min="1"
              max="1000"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Config reload automatic</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Dead letter queue enabled</span>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Kibana Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Server Port</label>
            <input
              type="number"
              defaultValue="5601"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Server Host</label>
            <input
              type="text"
              defaultValue="0.0.0.0"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Elasticsearch URL</label>
            <input
              type="url"
              defaultValue="http://elasticsearch:9200"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Index Pattern</label>
            <input
              type="text"
              defaultValue="logstash-*"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'elasticsearch': return renderElasticsearch();
      case 'logstash': return renderLogstash();
      case 'kibana': return renderKibana();
      case 'logs': return renderLogs();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <FileText className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold">ELK Stack</h1>
            <p className="text-gray-400">Elasticsearch, Logstash, and Kibana for log management</p>
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