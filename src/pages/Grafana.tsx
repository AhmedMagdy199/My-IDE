import React, { useState, useEffect } from 'react';
import { 
  Zap, 
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
  Save,
  Share,
  Star,
  Users,
  Folder,
  Search
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MetricsChart } from '@/components/common/MetricsChart';

interface GrafanaDashboard {
  id: number;
  uid: string;
  title: string;
  tags: string[];
  type: string;
  uri: string;
  url: string;
  slug: string;
  starred: boolean;
  folderId: number;
  folderTitle: string;
  folderUrl: string;
  isStarred: boolean;
}

interface GrafanaDataSource {
  id: number;
  uid: string;
  name: string;
  type: string;
  url: string;
  access: string;
  isDefault: boolean;
  basicAuth: boolean;
  readOnly: boolean;
}

interface GrafanaAlert {
  id: number;
  dashboardId: number;
  dashboardUid: string;
  dashboardSlug: string;
  panelId: number;
  name: string;
  state: 'alerting' | 'ok' | 'no_data' | 'paused' | 'pending';
  newStateDate: string;
  evalDate: string;
  evalData: any;
  executionError: string;
  url: string;
}

interface GrafanaUser {
  id: number;
  name: string;
  login: string;
  email: string;
  avatarUrl: string;
  isGrafanaAdmin: boolean;
  isDisabled: boolean;
  lastSeenAt: string;
  lastSeenAtAge: string;
}

export default function Grafana() {
  const [activeTab, setActiveTab] = useState('dashboards');
  const [dashboards, setDashboards] = useState<GrafanaDashboard[]>([]);
  const [dataSources, setDataSources] = useState<GrafanaDataSource[]>([]);
  const [alerts, setAlerts] = useState<GrafanaAlert[]>([]);
  const [users, setUsers] = useState<GrafanaUser[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'dashboards', label: 'Dashboards' },
    { id: 'datasources', label: 'Data Sources' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'users', label: 'Users' },
    { id: 'folders', label: 'Folders' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchDashboards();
    fetchDataSources();
    fetchAlerts();
    fetchUsers();
    fetchMetrics();
  }, []);

  const fetchDashboards = async () => {
    const mockDashboards: GrafanaDashboard[] = [
      {
        id: 1,
        uid: 'dashboard-1',
        title: 'System Overview',
        tags: ['system', 'monitoring'],
        type: 'dash-db',
        uri: 'db/system-overview',
        url: '/d/dashboard-1/system-overview',
        slug: 'system-overview',
        starred: true,
        folderId: 0,
        folderTitle: 'General',
        folderUrl: '',
        isStarred: true
      },
      {
        id: 2,
        uid: 'dashboard-2',
        title: 'Application Metrics',
        tags: ['application', 'performance'],
        type: 'dash-db',
        uri: 'db/application-metrics',
        url: '/d/dashboard-2/application-metrics',
        slug: 'application-metrics',
        starred: false,
        folderId: 1,
        folderTitle: 'Applications',
        folderUrl: '/dashboards/f/applications',
        isStarred: false
      },
      {
        id: 3,
        uid: 'dashboard-3',
        title: 'Infrastructure Health',
        tags: ['infrastructure', 'health'],
        type: 'dash-db',
        uri: 'db/infrastructure-health',
        url: '/d/dashboard-3/infrastructure-health',
        slug: 'infrastructure-health',
        starred: true,
        folderId: 2,
        folderTitle: 'Infrastructure',
        folderUrl: '/dashboards/f/infrastructure',
        isStarred: true
      }
    ];
    setDashboards(mockDashboards);
  };

  const fetchDataSources = async () => {
    const mockDataSources: GrafanaDataSource[] = [
      {
        id: 1,
        uid: 'prometheus-uid',
        name: 'Prometheus',
        type: 'prometheus',
        url: 'http://prometheus:9090',
        access: 'proxy',
        isDefault: true,
        basicAuth: false,
        readOnly: false
      },
      {
        id: 2,
        uid: 'elasticsearch-uid',
        name: 'Elasticsearch',
        type: 'elasticsearch',
        url: 'http://elasticsearch:9200',
        access: 'proxy',
        isDefault: false,
        basicAuth: false,
        readOnly: false
      },
      {
        id: 3,
        uid: 'influxdb-uid',
        name: 'InfluxDB',
        type: 'influxdb',
        url: 'http://influxdb:8086',
        access: 'proxy',
        isDefault: false,
        basicAuth: true,
        readOnly: false
      }
    ];
    setDataSources(mockDataSources);
  };

  const fetchAlerts = async () => {
    const mockAlerts: GrafanaAlert[] = [
      {
        id: 1,
        dashboardId: 1,
        dashboardUid: 'dashboard-1',
        dashboardSlug: 'system-overview',
        panelId: 2,
        name: 'High CPU Usage',
        state: 'alerting',
        newStateDate: '2024-01-15T11:30:00Z',
        evalDate: '2024-01-15T11:30:00Z',
        evalData: {},
        executionError: '',
        url: '/d/dashboard-1/system-overview?panelId=2&fullscreen'
      },
      {
        id: 2,
        dashboardId: 2,
        dashboardUid: 'dashboard-2',
        dashboardSlug: 'application-metrics',
        panelId: 1,
        name: 'Response Time Alert',
        state: 'pending',
        newStateDate: '2024-01-15T11:25:00Z',
        evalDate: '2024-01-15T11:25:00Z',
        evalData: {},
        executionError: '',
        url: '/d/dashboard-2/application-metrics?panelId=1&fullscreen'
      },
      {
        id: 3,
        dashboardId: 1,
        dashboardUid: 'dashboard-1',
        dashboardSlug: 'system-overview',
        panelId: 3,
        name: 'Disk Space Warning',
        state: 'ok',
        newStateDate: '2024-01-15T10:00:00Z',
        evalDate: '2024-01-15T11:30:00Z',
        evalData: {},
        executionError: '',
        url: '/d/dashboard-1/system-overview?panelId=3&fullscreen'
      }
    ];
    setAlerts(mockAlerts);
  };

  const fetchUsers = async () => {
    const mockUsers: GrafanaUser[] = [
      {
        id: 1,
        name: 'Admin User',
        login: 'admin',
        email: 'admin@example.com',
        avatarUrl: '/avatar/admin',
        isGrafanaAdmin: true,
        isDisabled: false,
        lastSeenAt: '2024-01-15T11:30:00Z',
        lastSeenAtAge: '5m'
      },
      {
        id: 2,
        name: 'John Doe',
        login: 'john.doe',
        email: 'john.doe@example.com',
        avatarUrl: '/avatar/john',
        isGrafanaAdmin: false,
        isDisabled: false,
        lastSeenAt: '2024-01-15T10:45:00Z',
        lastSeenAtAge: '45m'
      },
      {
        id: 3,
        name: 'Jane Smith',
        login: 'jane.smith',
        email: 'jane.smith@example.com',
        avatarUrl: '/avatar/jane',
        isGrafanaAdmin: false,
        isDisabled: true,
        lastSeenAt: '2024-01-10T14:20:00Z',
        lastSeenAtAge: '5d'
      }
    ];
    setUsers(mockUsers);
  };

  const fetchMetrics = async () => {
    const now = Date.now();
    const mockMetrics = Array.from({ length: 60 }, (_, i) => ({
      timestamp: now - (59 - i) * 60000,
      dashboard_views: Math.random() * 100 + 50,
      active_users: Math.random() * 20 + 5,
      alert_count: Math.random() * 10 + 2,
      query_rate: Math.random() * 500 + 200
    }));
    setMetrics(mockMetrics);
  };

  const renderDashboards = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Grafana Dashboards</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dashboards..."
              className="pl-10 pr-4 py-2 bg-gray-700 rounded-md text-sm"
            />
          </div>
          <Button onClick={fetchDashboards} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Dashboard
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {dashboards.map(dashboard => (
          <Card key={dashboard.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{dashboard.title}</h3>
                    {dashboard.isStarred && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-400">{dashboard.folderTitle}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {dashboard.tags.map(tag => (
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

              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share className="w-4 h-4" />
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

  const renderDataSources = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data Sources</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Data Source
        </Button>
      </div>

      <div className="grid gap-4">
        {dataSources.map(dataSource => (
          <Card key={dataSource.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  dataSource.type === 'prometheus' ? 'bg-red-600' :
                  dataSource.type === 'elasticsearch' ? 'bg-yellow-600' :
                  dataSource.type === 'influxdb' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{dataSource.name}</h3>
                    {dataSource.isDefault && (
                      <span className="px-2 py-1 bg-green-600 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 capitalize">{dataSource.type}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>{dataSource.url}</span>
                    <span>Access: {dataSource.access}</span>
                    {dataSource.basicAuth && (
                      <span>Basic Auth: Enabled</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={dataSource.readOnly ? 'readonly' : 'active'} />
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
          New Alert Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {alerts.map(alert => (
          <Card key={alert.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  alert.state === 'alerting' ? 'bg-red-600' :
                  alert.state === 'pending' ? 'bg-yellow-600' :
                  alert.state === 'ok' ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {alert.state === 'alerting' && <AlertTriangle className="w-6 h-6 text-white" />}
                  {alert.state === 'pending' && <Clock className="w-6 h-6 text-white" />}
                  {alert.state === 'ok' && <CheckCircle className="w-6 h-6 text-white" />}
                  {alert.state === 'paused' && <Clock className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{alert.name}</h3>
                  <p className="text-gray-400">{alert.dashboardSlug}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Panel ID: {alert.panelId}</span>
                    <span>Last Eval: {new Date(alert.evalDate).toLocaleString()}</span>
                    <span>State Since: {new Date(alert.newStateDate).toLocaleString()}</span>
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

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      <div className="grid gap-4">
        {users.map(user => (
          <Card key={user.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  user.isDisabled ? 'bg-gray-600' : 
                  user.isGrafanaAdmin ? 'bg-purple-600' : 'bg-blue-600'
                }`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    {user.isGrafanaAdmin && (
                      <span className="px-2 py-1 bg-purple-600 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Login: {user.login}</span>
                    <span>Last seen: {user.lastSeenAtAge} ago</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={user.isDisabled ? 'disabled' : 'active'} />
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

  const renderFolders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dashboard Folders</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Folder
        </Button>
      </div>

      <div className="grid gap-4">
        {[
          { id: 0, title: 'General', dashboardCount: 1, permissions: 'Admin' },
          { id: 1, title: 'Applications', dashboardCount: 1, permissions: 'Editor' },
          { id: 2, title: 'Infrastructure', dashboardCount: 1, permissions: 'Viewer' }
        ].map(folder => (
          <Card key={folder.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-600 rounded-lg">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{folder.title}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>{folder.dashboardCount} dashboards</span>
                    <span>Permissions: {folder.permissions}</span>
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

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Grafana Settings</h2>
      
      <Card title="Server Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Server URL</label>
            <input
              type="url"
              defaultValue="http://grafana:3000"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">HTTP Port</label>
            <input
              type="number"
              defaultValue="3000"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Domain</label>
            <input
              type="text"
              defaultValue="localhost"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Root URL</label>
            <input
              type="url"
              defaultValue="%(protocol)s://%(domain)s:%(http_port)s/"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>

      <Card title="Authentication">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Anonymous Access</p>
              <p className="text-sm text-gray-400">Allow anonymous users to access dashboards</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Assign Organization</p>
              <p className="text-sm text-gray-400">Automatically assign new users to organization</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Role</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="Viewer">Viewer</option>
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Alerting">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Alerting</p>
              <p className="text-sm text-gray-400">Enable Grafana alerting engine</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Evaluation Timeout</label>
            <input
              type="text"
              defaultValue="30s"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Attempts</label>
            <input
              type="number"
              defaultValue="3"
              min="1"
              max="10"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboards': return renderDashboards();
      case 'datasources': return renderDataSources();
      case 'alerts': return renderAlerts();
      case 'users': return renderUsers();
      case 'folders': return renderFolders();
      case 'settings': return renderSettings();
      default: return renderDashboards();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Zap className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold">Grafana</h1>
            <p className="text-gray-400">Analytics and monitoring dashboards</p>
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