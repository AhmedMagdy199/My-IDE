import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  Bell,
  Target,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MetricsChart } from '@/components/common/MetricsChart';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface PrometheusMetric {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  value: number;
  timestamp: number;
  labels: Record<string, string>;
  help: string;
}

interface PrometheusTarget {
  endpoint: string;
  state: 'up' | 'down' | 'unknown';
  lastScrape: string;
  scrapeDuration: number;
  error?: string;
  labels: Record<string, string>;
}

interface PrometheusAlert {
  id: string;
  name: string;
  state: 'firing' | 'pending' | 'inactive';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  value: number;
  threshold: number;
  activeAt: string;
  labels: Record<string, string>;
}

interface PrometheusRule {
  id: string;
  name: string;
  expr: string;
  duration: string;
  severity: string;
  description: string;
  enabled: boolean;
  lastEvaluation: string;
}

export default function Prometheus() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<PrometheusMetric[]>([]);
  const [targets, setTargets] = useState<PrometheusTarget[]>([]);
  const [alerts, setAlerts] = useState<PrometheusAlert[]>([]);
  const [rules, setRules] = useState<PrometheusRule[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryExpression, setQueryExpression] = useState('up');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'targets', label: 'Targets' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'rules', label: 'Rules' },
    { id: 'query', label: 'Query' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchMetrics();
    fetchTargets();
    fetchAlerts();
    fetchRules();
    fetchTimeSeriesData();
  }, []);

  const fetchMetrics = async () => {
    const mockMetrics: PrometheusMetric[] = [
      {
        name: 'up',
        type: 'gauge',
        value: 1,
        timestamp: Date.now(),
        labels: { instance: 'localhost:9090', job: 'prometheus' },
        help: 'Whether the instance is up'
      },
      {
        name: 'http_requests_total',
        type: 'counter',
        value: 12543,
        timestamp: Date.now(),
        labels: { method: 'GET', status: '200' },
        help: 'Total number of HTTP requests'
      },
      {
        name: 'cpu_usage_percent',
        type: 'gauge',
        value: 45.2,
        timestamp: Date.now(),
        labels: { instance: 'web-server-1' },
        help: 'CPU usage percentage'
      },
      {
        name: 'memory_usage_bytes',
        type: 'gauge',
        value: 2147483648,
        timestamp: Date.now(),
        labels: { instance: 'web-server-1' },
        help: 'Memory usage in bytes'
      }
    ];
    setMetrics(mockMetrics);
  };

  const fetchTargets = async () => {
    const mockTargets: PrometheusTarget[] = [
      {
        endpoint: 'http://localhost:9090/metrics',
        state: 'up',
        lastScrape: '2024-01-15T10:30:00Z',
        scrapeDuration: 0.045,
        labels: { job: 'prometheus', instance: 'localhost:9090' }
      },
      {
        endpoint: 'http://node-exporter:9100/metrics',
        state: 'up',
        lastScrape: '2024-01-15T10:29:45Z',
        scrapeDuration: 0.023,
        labels: { job: 'node-exporter', instance: 'node-exporter:9100' }
      },
      {
        endpoint: 'http://api-server:8080/metrics',
        state: 'down',
        lastScrape: '2024-01-15T10:25:30Z',
        scrapeDuration: 0,
        error: 'connection refused',
        labels: { job: 'api-server', instance: 'api-server:8080' }
      },
      {
        endpoint: 'http://database:5432/metrics',
        state: 'up',
        lastScrape: '2024-01-15T10:29:50Z',
        scrapeDuration: 0.067,
        labels: { job: 'postgres', instance: 'database:5432' }
      }
    ];
    setTargets(mockTargets);
  };

  const fetchAlerts = async () => {
    const mockAlerts: PrometheusAlert[] = [
      {
        id: '1',
        name: 'HighCPUUsage',
        state: 'firing',
        severity: 'critical',
        description: 'CPU usage is above 90%',
        value: 95.2,
        threshold: 90,
        activeAt: '2024-01-15T10:25:00Z',
        labels: { instance: 'web-server-1', severity: 'critical' }
      },
      {
        id: '2',
        name: 'HighMemoryUsage',
        state: 'pending',
        severity: 'warning',
        description: 'Memory usage is above 80%',
        value: 85.7,
        threshold: 80,
        activeAt: '2024-01-15T10:28:00Z',
        labels: { instance: 'web-server-2', severity: 'warning' }
      },
      {
        id: '3',
        name: 'ServiceDown',
        state: 'firing',
        severity: 'critical',
        description: 'Service is not responding',
        value: 0,
        threshold: 1,
        activeAt: '2024-01-15T10:20:00Z',
        labels: { service: 'api-server', severity: 'critical' }
      }
    ];
    setAlerts(mockAlerts);
  };

  const fetchRules = async () => {
    const mockRules: PrometheusRule[] = [
      {
        id: '1',
        name: 'HighCPUUsage',
        expr: 'cpu_usage_percent > 90',
        duration: '5m',
        severity: 'critical',
        description: 'CPU usage is consistently high',
        enabled: true,
        lastEvaluation: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'HighMemoryUsage',
        expr: 'memory_usage_percent > 80',
        duration: '3m',
        severity: 'warning',
        description: 'Memory usage is high',
        enabled: true,
        lastEvaluation: '2024-01-15T10:30:00Z'
      },
      {
        id: '3',
        name: 'ServiceDown',
        expr: 'up == 0',
        duration: '1m',
        severity: 'critical',
        description: 'Service is down',
        enabled: true,
        lastEvaluation: '2024-01-15T10:30:00Z'
      }
    ];
    setRules(mockRules);
  };

  const fetchTimeSeriesData = async () => {
    const now = Date.now();
    const mockData = Array.from({ length: 60 }, (_, i) => ({
      timestamp: now - (59 - i) * 60000,
      cpu: Math.random() * 80 + 10 + Math.sin(i / 10) * 20,
      memory: Math.random() * 70 + 20 + Math.cos(i / 8) * 15,
      requests: Math.random() * 1000 + 500,
      response_time: Math.random() * 200 + 50
    }));
    setTimeSeriesData(mockData);
  };

  const executeQuery = async () => {
    setLoading(true);
    try {
      // Simulate Prometheus query execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Executing query: ${queryExpression}`);
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    const upTargets = targets.filter(t => t.state === 'up').length;
    const totalTargets = targets.length;
    const firingAlerts = alerts.filter(a => a.state === 'firing').length;
    const activeRules = rules.filter(r => r.enabled).length;

    return (
      <div className="space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-600 to-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Targets Up</p>
                <p className="text-white text-2xl font-bold">{upTargets}/{totalTargets}</p>
              </div>
              <Target className="w-8 h-8 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Firing Alerts</p>
                <p className="text-white text-2xl font-bold">{firingAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Rules</p>
                <p className="text-white text-2xl font-bold">{activeRules}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Metrics</p>
                <p className="text-white text-2xl font-bold">{metrics.length}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-200" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="CPU Usage">
            <MetricsChart
              data={timeSeriesData}
              dataKey="cpu"
              name="CPU %"
              color="#3B82F6"
            />
          </Card>

          <Card title="Memory Usage">
            <MetricsChart
              data={timeSeriesData}
              dataKey="memory"
              name="Memory %"
              color="#10B981"
            />
          </Card>

          <Card title="Request Rate">
            <MetricsChart
              data={timeSeriesData}
              dataKey="requests"
              name="Requests/min"
              color="#F59E0B"
            />
          </Card>

          <Card title="Response Time">
            <MetricsChart
              data={timeSeriesData}
              dataKey="response_time"
              name="Response Time (ms)"
              color="#8B5CF6"
            />
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card title="Recent Alerts">
          <div className="space-y-3">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {alert.state === 'firing' && (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  {alert.state === 'pending' && (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                  {alert.state === 'inactive' && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  <div>
                    <p className="font-medium">{alert.name}</p>
                    <p className="text-sm text-gray-400">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <StatusBadge status={alert.state} />
                  <span className="text-sm text-gray-400">{alert.activeAt}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prometheus Metrics</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search metrics..."
              className="pl-10 pr-4 py-2 bg-gray-700 rounded-md text-sm"
            />
          </div>
          <Button onClick={fetchMetrics} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  metric.type === 'counter' ? 'bg-blue-600' :
                  metric.type === 'gauge' ? 'bg-green-600' :
                  metric.type === 'histogram' ? 'bg-purple-600' : 'bg-orange-600'
                }`}>
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{metric.name}</h3>
                  <p className="text-gray-400">{metric.help}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="capitalize">{metric.type}</span>
                    <span>Value: {metric.value}</span>
                    <span>Labels: {Object.keys(metric.labels).length}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </p>
                </div>
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

  const renderTargets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Scrape Targets</h2>
        <Button onClick={fetchTargets} loading={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {targets.map((target, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  target.state === 'up' ? 'bg-green-600' :
                  target.state === 'down' ? 'bg-red-600' : 'bg-gray-600'
                }`}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{target.endpoint}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Job: {target.labels.job}</span>
                    <span>Instance: {target.labels.instance}</span>
                    <span>Duration: {target.scrapeDuration}s</span>
                    <span>Last scrape: {new Date(target.lastScrape).toLocaleTimeString()}</span>
                  </div>
                  {target.error && (
                    <p className="text-red-400 text-sm mt-1">Error: {target.error}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={target.state} />
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

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Alert Rules</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Alert
        </Button>
      </div>

      <div className="grid gap-4">
        {alerts.map(alert => (
          <Card key={alert.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  alert.severity === 'critical' ? 'bg-red-600' :
                  alert.severity === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
                }`}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{alert.name}</h3>
                  <p className="text-gray-400">{alert.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="capitalize">{alert.severity}</span>
                    <span>Value: {alert.value}</span>
                    <span>Threshold: {alert.threshold}</span>
                    <span>Active since: {new Date(alert.activeAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={alert.state} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Bell className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recording & Alert Rules</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Expression
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {rules.map(rule => (
                <tr key={rule.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                    {rule.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {rule.expr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {rule.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {rule.severity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={rule.enabled ? 'enabled' : 'disabled'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Settings className="w-4 h-4" />
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

  const renderQuery = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">PromQL Query</h2>
      
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Query Expression</label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={queryExpression}
                onChange={(e) => setQueryExpression(e.target.value)}
                placeholder="Enter PromQL expression..."
                className="flex-1 bg-gray-700 rounded-md px-3 py-2 font-mono"
              />
              <Button onClick={executeQuery} loading={loading}>
                Execute
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setQueryExpression('up')}
            >
              up
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setQueryExpression('rate(http_requests_total[5m])')}
            >
              HTTP Rate
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setQueryExpression('cpu_usage_percent')}
            >
              CPU Usage
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setQueryExpression('memory_usage_percent')}
            >
              Memory Usage
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Query Results">
        <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto">
          <div className="space-y-1">
            <div>Query: {queryExpression}</div>
            <div>Execution time: 0.045s</div>
            <div>---</div>
            <div>up{`{instance="localhost:9090", job="prometheus"}`} 1</div>
            <div>up{`{instance="node-exporter:9100", job="node-exporter"}`} 1</div>
            <div>up{`{instance="api-server:8080", job="api-server"}`} 0</div>
            <div>up{`{instance="database:5432", job="postgres"}`} 1</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Prometheus Settings</h2>
      
      <Card title="Server Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prometheus URL</label>
            <input
              type="url"
              defaultValue="http://prometheus:9090"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Scrape Interval</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="15s">15 seconds</option>
              <option value="30s">30 seconds</option>
              <option value="1m">1 minute</option>
              <option value="5m">5 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Evaluation Interval</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="15s">15 seconds</option>
              <option value="30s">30 seconds</option>
              <option value="1m">1 minute</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Storage Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Retention Time</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="15d">15 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
              <option value="1y">1 year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Storage Path</label>
            <input
              type="text"
              defaultValue="/prometheus/data"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>

      <Card title="Alerting Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Alertmanager URL</label>
            <input
              type="url"
              defaultValue="http://alertmanager:9093"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Enable external labels</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Send resolved alerts</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'metrics': return renderMetrics();
      case 'targets': return renderTargets();
      case 'alerts': return renderAlerts();
      case 'rules': return renderRules();
      case 'query': return renderQuery();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Activity className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-2xl font-bold">Prometheus</h1>
            <p className="text-gray-400">Monitoring and alerting toolkit</p>
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