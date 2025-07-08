import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Cloud, 
  GitBranch, 
  Shield, 
  Database,
  Terminal,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Settings,
  Bell,
  Zap,
  Globe,
  Container,
  Layers,
  Monitor,
  FileText,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MetricsChart } from '@/components/common/MetricsChart';

interface SystemMetrics {
  timestamp: number;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  uptime: string;
  responseTime: number;
  lastCheck: string;
  url?: string;
}

interface RecentActivity {
  id: string;
  type: 'deployment' | 'alert' | 'commit' | 'build' | 'security';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  user?: string;
}

interface QuickStat {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await Promise.all([
        fetchMetrics(),
        fetchServices(),
        fetchActivities()
      ]);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    // Simulate real-time metrics
    const now = Date.now();
    const newMetrics: SystemMetrics[] = Array.from({ length: 24 }, (_, i) => ({
      timestamp: now - (23 - i) * 3600000,
      cpu: Math.random() * 80 + 10 + Math.sin(i / 4) * 15,
      memory: Math.random() * 70 + 20 + Math.cos(i / 3) * 10,
      disk: Math.random() * 30 + 40,
      network: Math.random() * 100 + Math.sin(i / 2) * 30
    }));
    setMetrics(newMetrics);
  };

  const fetchServices = async () => {
    const mockServices: ServiceStatus[] = [
      {
        name: 'API Gateway',
        status: 'healthy',
        uptime: '99.9%',
        responseTime: 45,
        lastCheck: '30 seconds ago',
        url: 'https://api.example.com'
      },
      {
        name: 'Database Cluster',
        status: 'healthy',
        uptime: '99.8%',
        responseTime: 12,
        lastCheck: '1 minute ago'
      },
      {
        name: 'Redis Cache',
        status: 'warning',
        uptime: '98.5%',
        responseTime: 156,
        lastCheck: '2 minutes ago'
      },
      {
        name: 'Message Queue',
        status: 'healthy',
        uptime: '100%',
        responseTime: 8,
        lastCheck: '45 seconds ago'
      },
      {
        name: 'File Storage',
        status: 'critical',
        uptime: '95.2%',
        responseTime: 890,
        lastCheck: '5 minutes ago'
      },
      {
        name: 'Authentication Service',
        status: 'healthy',
        uptime: '99.7%',
        responseTime: 67,
        lastCheck: '1 minute ago'
      }
    ];
    setServices(mockServices);
  };

  const fetchActivities = async () => {
    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'deployment',
        title: 'Production Deployment',
        description: 'API v2.1.3 deployed successfully to production',
        timestamp: '5 minutes ago',
        status: 'success',
        user: 'john.doe'
      },
      {
        id: '2',
        type: 'alert',
        title: 'High Memory Usage',
        description: 'Memory usage exceeded 85% on web-server-03',
        timestamp: '12 minutes ago',
        status: 'warning'
      },
      {
        id: '3',
        type: 'commit',
        title: 'Feature Update',
        description: 'Added new dashboard metrics visualization',
        timestamp: '1 hour ago',
        status: 'info',
        user: 'jane.smith'
      },
      {
        id: '4',
        type: 'build',
        title: 'Build Completed',
        description: 'Frontend build #1247 completed successfully',
        timestamp: '2 hours ago',
        status: 'success',
        user: 'ci-bot'
      },
      {
        id: '5',
        type: 'security',
        title: 'Security Scan',
        description: 'Vulnerability scan found 2 medium-risk issues',
        timestamp: '3 hours ago',
        status: 'warning'
      },
      {
        id: '6',
        type: 'deployment',
        title: 'Rollback Initiated',
        description: 'Database migration rolled back due to errors',
        timestamp: '4 hours ago',
        status: 'error',
        user: 'admin'
      }
    ];
    setActivities(mockActivities);
  };

  const getCurrentMetrics = () => {
    if (metrics.length === 0) return { cpu: 0, memory: 0, disk: 0, network: 0 };
    return metrics[metrics.length - 1];
  };

  const getQuickStats = (): QuickStat[] => {
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const totalServices = services.length;
    const criticalAlerts = activities.filter(a => a.status === 'error').length;
    const current = getCurrentMetrics();

    return [
      {
        label: 'Services Up',
        value: `${healthyServices}/${totalServices}`,
        change: healthyServices === totalServices ? 0 : -((totalServices - healthyServices) / totalServices * 100),
        trend: healthyServices === totalServices ? 'stable' : 'down',
        icon: Server,
        color: 'from-green-500 to-green-600'
      },
      {
        label: 'CPU Usage',
        value: `${current.cpu.toFixed(1)}%`,
        change: Math.random() * 10 - 5,
        trend: current.cpu > 70 ? 'up' : current.cpu < 30 ? 'down' : 'stable',
        icon: Cpu,
        color: 'from-blue-500 to-blue-600'
      },
      {
        label: 'Active Alerts',
        value: criticalAlerts,
        change: Math.random() * 20 - 10,
        trend: criticalAlerts > 0 ? 'up' : 'stable',
        icon: AlertTriangle,
        color: 'from-red-500 to-red-600'
      },
      {
        label: 'Deployments Today',
        value: 12,
        change: 15.3,
        trend: 'up',
        icon: Zap,
        color: 'from-purple-500 to-purple-600'
      }
    ];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deployment': return Zap;
      case 'alert': return AlertTriangle;
      case 'commit': return GitBranch;
      case 'build': return Settings;
      case 'security': return Shield;
      default: return Activity;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
                DevOps Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={fetchDashboardData}
                loading={loading}
                variant="secondary"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="secondary" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button variant="secondary" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getQuickStats().map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`bg-gradient-to-br ${stat.color} border-0`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                    <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-white/80 mr-1" />}
                      {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-white/80 mr-1" />}
                      <span className="text-white/80 text-sm">
                        {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Icon className="w-12 h-12 text-white/60" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="System Performance" className="col-span-1 lg:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4">CPU & Memory Usage</h4>
                <MetricsChart
                  data={metrics}
                  dataKey="cpu"
                  name="CPU %"
                  color="#3B82F6"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4">Network Traffic</h4>
                <MetricsChart
                  data={metrics}
                  dataKey="network"
                  name="Network MB/s"
                  color="#10B981"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Current Resource Usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'CPU', value: getCurrentMetrics().cpu, icon: Cpu, color: 'blue', unit: '%' },
            { name: 'Memory', value: getCurrentMetrics().memory, icon: MemoryStick, color: 'green', unit: '%' },
            { name: 'Disk', value: getCurrentMetrics().disk, icon: HardDrive, color: 'purple', unit: '%' },
            { name: 'Network', value: getCurrentMetrics().network, icon: Network, color: 'yellow', unit: 'MB/s' }
          ].map((resource) => {
            const Icon = resource.icon;
            return (
              <Card key={resource.name}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="font-medium">{resource.name}</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {resource.value.toFixed(1)}{resource.unit}
                  </span>
                </div>
                <ProgressBar 
                  value={resource.unit === '%' ? resource.value : Math.min(resource.value, 100)} 
                  color={resource.color as any}
                />
                <div className="mt-2 text-sm text-gray-400">
                  {resource.value > 80 ? 'High usage detected' : 
                   resource.value > 60 ? 'Moderate usage' : 'Normal usage'}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Services and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Status */}
          <Card title="Service Health">
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'healthy' ? 'bg-green-500' :
                      service.status === 'warning' ? 'bg-yellow-500' :
                      service.status === 'critical' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-400">
                        {service.responseTime}ms • {service.uptime} uptime
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={service.status} />
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Icon className={`w-5 h-5 mt-0.5 ${getActivityColor(activity.status)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{activity.timestamp}</span>
                        {activity.user && (
                          <>
                            <span className="mx-2">•</span>
                            <Users className="w-3 h-3 mr-1" />
                            <span>{activity.user}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={activity.status} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Container className="w-6 h-6" />
              <span>Deploy Service</span>
            </Button>
            <Button variant="secondary" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Terminal className="w-6 h-6" />
              <span>Open Terminal</span>
            </Button>
            <Button variant="secondary" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Monitor className="w-6 h-6" />
              <span>View Logs</span>
            </Button>
            <Button variant="secondary" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Shield className="w-6 h-6" />
              <span>Security Scan</span>
            </Button>
          </div>
        </Card>

        {/* Infrastructure Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Cloud Resources">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">EC2 Instances</span>
                <span className="font-medium">12 running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Load Balancers</span>
                <span className="font-medium">3 active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Databases</span>
                <span className="font-medium">5 healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="font-medium">2.3 TB used</span>
              </div>
            </div>
          </Card>

          <Card title="Kubernetes">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Clusters</span>
                <span className="font-medium">2 active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Nodes</span>
                <span className="font-medium">8 ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pods</span>
                <span className="font-medium">156 running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Services</span>
                <span className="font-medium">23 exposed</span>
              </div>
            </div>
          </Card>

          <Card title="CI/CD Pipeline">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Builds Today</span>
                <span className="font-medium">47 completed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium text-green-400">94.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Build Time</span>
                <span className="font-medium">4m 32s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Queue Length</span>
                <span className="font-medium">2 pending</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}