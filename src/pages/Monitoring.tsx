import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Server,
  Database,
  Globe,
  RefreshCw,
  Settings,
  Bell,
  Eye,
  Download
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MetricsChart } from '@/components/common/MetricsChart';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface SystemMetrics {
  timestamp: number;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  status: 'active' | 'resolved';
}

interface Service {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  responseTime: number;
  errorRate: number;
  url?: string;
}

export default function Monitoring() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'services', label: 'Services' },
    { id: 'logs', label: 'Logs' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchMetrics();
    fetchAlerts();
    fetchServices();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchMetrics();
        fetchAlerts();
        fetchServices();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Simulate Prometheus metrics
      const now = Date.now();
      const mockMetrics: SystemMetrics[] = Array.from({ length: 60 }, (_, i) => ({
        timestamp: now - (59 - i) * 60000,
        cpu: Math.random() * 80 + 10 + Math.sin(i / 10) * 20,
        memory: Math.random() * 70 + 20 + Math.cos(i / 8) * 15,
        disk: Math.random() * 50 + 30,
        network: Math.random() * 100 + Math.sin(i / 5) * 30
      }));
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        severity: 'critical',
        title: 'High CPU Usage',
        description: 'CPU usage has exceeded 90% for the last 5 minutes',
        timestamp: '2 minutes ago',
        source: 'node-exporter',
        status: 'active'
      },
      {
        id: '2',
        severity: 'warning',
        title: 'Disk Space Low',
        description: 'Disk usage is at 85% on /var/log partition',
        timestamp: '15 minutes ago',
        source: 'prometheus',
        status: 'active'
      },
      {
        id: '3',
        severity: 'info',
        title: 'Service Restart',
        description: 'API service was restarted successfully',
        timestamp: '1 hour ago',
        source: 'kubernetes',
        status: 'resolved'
      }
    ];
    setAlerts(mockAlerts);
  };

  const fetchServices = async () => {
    const mockServices: Service[] = [
      {
        name: 'API Gateway',
        status: 'healthy',
        uptime: '99.9%',
        responseTime: 45,
        errorRate: 0.1,
        url: 'https://api.example.com'
      },
      {
        name: 'Database',
        status: 'warning',
        uptime: '99.5%',
        responseTime: 120,
        errorRate: 0.5,
        url: 'postgres://db.example.com'
      },
      {
        name: 'Redis Cache',
        status: 'healthy',
        uptime: '100%',
        responseTime: 2,
        errorRate: 0,
        url: 'redis://cache.example.com'
      },
      {
        name: 'Message Queue',
        status: 'critical',
        uptime: '95.2%',
        responseTime: 500,
        errorRate: 2.1,
        url: 'rabbitmq://queue.example.com'
      }
    ];
    setServices(mockServices);
  };

  const getCurrentMetrics = () => {
    if (metrics.length === 0) return { cpu: 0, memory: 0, disk: 0, network: 0 };
    return metrics[metrics.length - 1];
  };

  const renderOverview = () => {
    const current = getCurrentMetrics();
    const activeAlerts = alerts.filter(a => a.status === 'active');
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
    const healthyServices = services.filter(s => s.status === 'healthy');

    return (
      <div className="space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">System Health</p>
                <p className="text-white text-2xl font-bold">
                  {criticalAlerts.length === 0 ? 'Good' : 'Critical'}
                </p>
              </div>
              {criticalAlerts.length === 0 ? (
                <CheckCircle className="w-8 h-8 text-blue-200" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-300" />
              )}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Services Up</p>
                <p className="text-white text-2xl font-bold">
                  {healthyServices.length}/{services.length}
                </p>
              </div>
              <Server className="w-8 h-8 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Active Alerts</p>
                <p className="text-white text-2xl font-bold">{activeAlerts.length}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg Response</p>
                <p className="text-white text-2xl font-bold">
                  {Math.round(services.reduce((sum, s) => sum + s.responseTime, 0) / services.length)}ms
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-200" />
            </div>
          </Card>
        </div>

        {/* Resource Usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="CPU Usage">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Cpu className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold">{current.cpu.toFixed(1)}%</span>
              </div>
              <ProgressBar value={current.cpu} color="blue" />
              <div className="flex items-center text-sm text-gray-400">
                {current.cpu > 80 ? (
                  <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-400 mr-1" />
                )}
                <span>Last hour average</span>
              </div>
            </div>
          </Card>

          <Card title="Memory Usage">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <MemoryStick className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold">{current.memory.toFixed(1)}%</span>
              </div>
              <ProgressBar value={current.memory} color="green" />
              <div className="text-sm text-gray-400">
                {(current.memory * 16 / 100).toFixed(1)} GB / 16 GB
              </div>
            </div>
          </Card>

          <Card title="Disk Usage">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <HardDrive className="w-5 h-5 text-purple-400" />
                <span className="text-2xl font-bold">{current.disk.toFixed(1)}%</span>
              </div>
              <ProgressBar value={current.disk} color="purple" />
              <div className="text-sm text-gray-400">
                {(current.disk * 500 / 100).toFixed(0)} GB / 500 GB
              </div>
            </div>
          </Card>

          <Card title="Network I/O">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Network className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold">{current.network.toFixed(0)} MB/s</span>
              </div>
              <ProgressBar value={Math.min(current.network, 100)} color="yellow" />
              <div className="text-sm text-gray-400">
                ↑ {(current.network * 0.3).toFixed(1)} MB/s ↓ {(current.network * 0.7).toFixed(1)} MB/s
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card title="Recent Alerts">
          <div className="space-y-3">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {alert.severity === 'critical' && (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  {alert.severity === 'warning' && (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  )}
                  {alert.severity === 'info' && (
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  )}
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-400">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <StatusBadge status={alert.status} />
                  <span className="text-sm text-gray-400">{alert.timestamp}</span>
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
        <h2 className="text-xl font-semibold">System Metrics</h2>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Auto-refresh</span>
          </label>
          <Button onClick={fetchMetrics} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="CPU Usage Over Time">
          <MetricsChart
            data={metrics}
            dataKey="cpu"
            name="CPU %"
            color="#3B82F6"
          />
        </Card>

        <Card title="Memory Usage Over Time">
          <MetricsChart
            data={metrics}
            dataKey="memory"
            name="Memory %"
            color="#10B981"
          />
        </Card>

        <Card title="Disk I/O">
          <MetricsChart
            data={metrics}
            dataKey="disk"
            name="Disk %"
            color="#8B5CF6"
          />
        </Card>

        <Card title="Network Traffic">
          <MetricsChart
            data={metrics}
            dataKey="network"
            name="Network MB/s"
            color="#F59E0B"
          />
        </Card>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Alert Management</h2>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Configure Alerts
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
                  {alert.severity === 'critical' && <AlertTriangle className="w-6 h-6 text-white" />}
                  {alert.severity === 'warning' && <AlertTriangle className="w-6 h-6 text-white" />}
                  {alert.severity === 'info' && <CheckCircle className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{alert.title}</h3>
                  <p className="text-gray-400">{alert.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>Source: {alert.source}</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={alert.status} />
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

  const renderServices = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Service Health</h2>
      
      <div className="grid gap-4">
        {services.map(service => (
          <Card key={service.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  service.status === 'healthy' ? 'bg-green-600' :
                  service.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                }`}>
                  {service.name.includes('Database') ? (
                    <Database className="w-6 h-6 text-white" />
                  ) : (
                    <Globe className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-gray-400">{service.url}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Uptime: {service.uptime}</span>
                    <span>Response: {service.responseTime}ms</span>
                    <span>Error Rate: {service.errorRate}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={service.status} />
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

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">System Logs</h2>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card>
        <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto">
          <div className="space-y-1">
            <div>[2024-01-15 10:30:15] INFO: API Gateway started successfully</div>
            <div>[2024-01-15 10:30:16] INFO: Database connection established</div>
            <div>[2024-01-15 10:30:17] INFO: Redis cache connected</div>
            <div>[2024-01-15 10:31:22] WARN: High memory usage detected: 85%</div>
            <div>[2024-01-15 10:32:45] ERROR: Failed to connect to message queue</div>
            <div>[2024-01-15 10:33:01] INFO: Message queue connection restored</div>
            <div>[2024-01-15 10:35:12] INFO: Scheduled backup completed</div>
            <div>[2024-01-15 10:36:33] WARN: CPU usage spike: 92%</div>
            <div>[2024-01-15 10:37:45] INFO: Auto-scaling triggered</div>
            <div>[2024-01-15 10:38:12] INFO: New instance launched</div>
            <div>[2024-01-15 10:39:01] INFO: Load balanced across 3 instances</div>
            <div>[2024-01-15 10:40:15] INFO: CPU usage normalized: 45%</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Monitoring Settings</h2>
      
      <Card title="Prometheus Configuration">
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
        </div>
      </Card>

      <Card title="Alert Rules">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium">High CPU Usage</p>
              <p className="text-sm text-gray-400">Trigger when CPU {'>'} 80% for 5 minutes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium">Low Disk Space</p>
              <p className="text-sm text-gray-400">Trigger when disk usage {'>'} 85%</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
      case 'alerts': return renderAlerts();
      case 'services': return renderServices();
      case 'logs': return renderLogs();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Activity className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold">Monitoring Dashboard</h1>
            <p className="text-gray-400">Real-time system monitoring and alerting</p>
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