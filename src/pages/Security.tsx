import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Users,
  FileText,
  Scan,
  RefreshCw,
  Download,
  Settings,
  Bug,
  Activity,
  Clock,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  cve: string;
  package: string;
  version: string;
  fixedVersion?: string;
  status: 'open' | 'fixed' | 'ignored';
  discoveredAt: string;
}

interface SecurityScan {
  id: string;
  target: string;
  type: 'container' | 'image' | 'code' | 'dependency';
  status: 'running' | 'completed' | 'failed';
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  startedAt: string;
  completedAt?: string;
}

interface AccessLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  permissions: string[];
}

export default function Security() {
  const [activeTab, setActiveTab] = useState('overview');
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [scans, setScans] = useState<SecurityScan[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanFilter, setScanFilter] = useState('all');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vulnerabilities', label: 'Vulnerabilities' },
    { id: 'scans', label: 'Security Scans' },
    { id: 'access', label: 'Access Control' },
    { id: 'audit', label: 'Audit Logs' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchVulnerabilities();
    fetchScans();
    fetchAccessLogs();
    fetchUsers();
  }, []);

  const fetchVulnerabilities = async () => {
    const mockVulnerabilities: Vulnerability[] = [
      {
        id: '1',
        severity: 'critical',
        title: 'Remote Code Execution in Express.js',
        description: 'A vulnerability in Express.js allows remote code execution through malicious input',
        cve: 'CVE-2024-1234',
        package: 'express',
        version: '4.17.1',
        fixedVersion: '4.18.2',
        status: 'open',
        discoveredAt: '2 hours ago'
      },
      {
        id: '2',
        severity: 'high',
        title: 'SQL Injection in Database Driver',
        description: 'Improper input validation allows SQL injection attacks',
        cve: 'CVE-2024-5678',
        package: 'pg',
        version: '8.7.1',
        fixedVersion: '8.8.0',
        status: 'open',
        discoveredAt: '1 day ago'
      },
      {
        id: '3',
        severity: 'medium',
        title: 'Cross-Site Scripting (XSS)',
        description: 'Reflected XSS vulnerability in user input handling',
        cve: 'CVE-2024-9012',
        package: 'react-dom',
        version: '17.0.2',
        fixedVersion: '18.2.0',
        status: 'fixed',
        discoveredAt: '3 days ago'
      }
    ];
    setVulnerabilities(mockVulnerabilities);
  };

  const fetchScans = async () => {
    const mockScans: SecurityScan[] = [
      {
        id: '1',
        target: 'nginx:latest',
        type: 'image',
        status: 'completed',
        vulnerabilities: { critical: 2, high: 5, medium: 12, low: 8 },
        startedAt: '2024-01-15 10:30:00',
        completedAt: '2024-01-15 10:35:00'
      },
      {
        id: '2',
        target: 'app-container',
        type: 'container',
        status: 'running',
        vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
        startedAt: '2024-01-15 11:00:00'
      },
      {
        id: '3',
        target: 'src/components',
        type: 'code',
        status: 'completed',
        vulnerabilities: { critical: 1, high: 3, medium: 7, low: 15 },
        startedAt: '2024-01-15 09:15:00',
        completedAt: '2024-01-15 09:45:00'
      }
    ];
    setScans(mockScans);
  };

  const fetchAccessLogs = async () => {
    const mockLogs: AccessLog[] = [
      {
        id: '1',
        user: 'john.doe',
        action: 'LOGIN',
        resource: '/dashboard',
        ip: '192.168.1.100',
        timestamp: '2024-01-15 11:30:00',
        status: 'success'
      },
      {
        id: '2',
        user: 'jane.smith',
        action: 'DELETE',
        resource: '/api/users/123',
        ip: '192.168.1.101',
        timestamp: '2024-01-15 11:25:00',
        status: 'success'
      },
      {
        id: '3',
        user: 'unknown',
        action: 'LOGIN',
        resource: '/admin',
        ip: '10.0.0.50',
        timestamp: '2024-01-15 11:20:00',
        status: 'blocked'
      }
    ];
    setAccessLogs(mockLogs);
  };

  const fetchUsers = async () => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2 hours ago',
        permissions: ['read', 'write', 'delete', 'admin']
      },
      {
        id: '2',
        username: 'developer1',
        email: 'dev1@example.com',
        role: 'developer',
        status: 'active',
        lastLogin: '1 day ago',
        permissions: ['read', 'write']
      },
      {
        id: '3',
        username: 'viewer1',
        email: 'viewer@example.com',
        role: 'viewer',
        status: 'inactive',
        lastLogin: '1 week ago',
        permissions: ['read']
      }
    ];
    setUsers(mockUsers);
  };

  const startSecurityScan = async (target: string, type: string) => {
    setLoading(true);
    try {
      // Simulate scan start
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newScan: SecurityScan = {
        id: Date.now().toString(),
        target,
        type: type as any,
        status: 'running',
        vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
        startedAt: new Date().toISOString()
      };
      
      setScans(prev => [newScan, ...prev]);
    } catch (error) {
      console.error('Error starting scan:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    const totalVulns = vulnerabilities.length;
    const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical').length;
    const openVulns = vulnerabilities.filter(v => v.status === 'open').length;
    const activeUsers = users.filter(u => u.status === 'active').length;

    return (
      <div className="space-y-6">
        {/* Security Score */}
        <Card className="bg-gradient-to-br from-red-600 to-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Security Score</p>
              <p className="text-white text-3xl font-bold">
                {criticalVulns === 0 ? '85' : '42'}/100
              </p>
              <p className="text-red-200 text-sm mt-1">
                {criticalVulns > 0 ? 'Critical issues found' : 'Good security posture'}
              </p>
            </div>
            <Shield className="w-12 h-12 text-red-200" />
          </div>
        </Card>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-600 to-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Critical Vulnerabilities</p>
                <p className="text-white text-2xl font-bold">{criticalVulns}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Open Issues</p>
                <p className="text-white text-2xl font-bold">{openVulns}</p>
              </div>
              <Bug className="w-8 h-8 text-orange-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Users</p>
                <p className="text-white text-2xl font-bold">{activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Scans Today</p>
                <p className="text-white text-2xl font-bold">{scans.length}</p>
              </div>
              <Scan className="w-8 h-8 text-green-200" />
            </div>
          </Card>
        </div>

        {/* Vulnerability Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Vulnerability Severity">
            <div className="space-y-4">
              {[
                { severity: 'Critical', count: criticalVulns, color: 'red' },
                { severity: 'High', count: vulnerabilities.filter(v => v.severity === 'high').length, color: 'orange' },
                { severity: 'Medium', count: vulnerabilities.filter(v => v.severity === 'medium').length, color: 'yellow' },
                { severity: 'Low', count: vulnerabilities.filter(v => v.severity === 'low').length, color: 'blue' }
              ].map(item => (
                <div key={item.severity} className="flex items-center justify-between">
                  <span className="text-sm">{item.severity}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32">
                      <ProgressBar 
                        value={totalVulns > 0 ? (item.count / totalVulns) * 100 : 0} 
                        color={item.color as any}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recent Security Events">
            <div className="space-y-3">
              {accessLogs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div className="flex items-center space-x-3">
                    {log.status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {log.status === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
                    {log.status === 'blocked' && <Shield className="w-4 h-4 text-orange-400" />}
                    <div>
                      <p className="text-sm font-medium">{log.action} by {log.user}</p>
                      <p className="text-xs text-gray-400">{log.resource}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => startSecurityScan('all-containers', 'container')}
              loading={loading}
              className="h-16"
            >
              <Scan className="w-5 h-5 mr-2" />
              Scan All Containers
            </Button>
            <Button variant="secondary" className="h-16">
              <Download className="w-5 h-5 mr-2" />
              Export Security Report
            </Button>
            <Button variant="secondary" className="h-16">
              <RefreshCw className="w-5 h-5 mr-2" />
              Update Vulnerability DB
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderVulnerabilities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vulnerabilities</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search CVE, package..."
              className="pl-10 pr-4 py-2 bg-gray-700 rounded-md text-sm"
            />
          </div>
          <select className="bg-gray-700 rounded-md px-3 py-2 text-sm">
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <Button onClick={fetchVulnerabilities} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {vulnerabilities.map(vuln => (
          <Card key={vuln.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  vuln.severity === 'critical' ? 'bg-red-600' :
                  vuln.severity === 'high' ? 'bg-orange-600' :
                  vuln.severity === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                }`}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{vuln.title}</h3>
                    <StatusBadge status={vuln.severity} />
                    <span className="text-sm text-gray-400">{vuln.cve}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{vuln.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <span>Package: {vuln.package}@{vuln.version}</span>
                    {vuln.fixedVersion && (
                      <span>Fixed in: {vuln.fixedVersion}</span>
                    )}
                    <span>Discovered: {vuln.discoveredAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={vuln.status} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {vuln.status === 'open' && (
                    <Button size="sm">
                      Fix Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderScans = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Security Scans</h2>
        <div className="flex space-x-3">
          <select 
            value={scanFilter}
            onChange={(e) => setScanFilter(e.target.value)}
            className="bg-gray-700 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Scans</option>
            <option value="container">Containers</option>
            <option value="image">Images</option>
            <option value="code">Code</option>
          </select>
          <Button>
            <Scan className="w-4 h-4 mr-2" />
            New Scan
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {scans.map(scan => (
          <Card key={scan.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  scan.status === 'completed' ? 'bg-green-600' :
                  scan.status === 'running' ? 'bg-blue-600' : 'bg-red-600'
                }`}>
                  <Scan className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{scan.target}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className="capitalize">{scan.type} scan</span>
                    <span>Started: {scan.startedAt}</span>
                    {scan.completedAt && (
                      <span>Completed: {scan.completedAt}</span>
                    )}
                  </div>
                  {scan.status === 'completed' && (
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-red-400">Critical: {scan.vulnerabilities.critical}</span>
                      <span className="text-orange-400">High: {scan.vulnerabilities.high}</span>
                      <span className="text-yellow-400">Medium: {scan.vulnerabilities.medium}</span>
                      <span className="text-blue-400">Low: {scan.vulnerabilities.low}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={scan.status} />
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

  const renderAccessControl = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Access Control</h2>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4">
        {users.map(user => (
          <Card key={user.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  user.status === 'active' ? 'bg-green-600' :
                  user.status === 'inactive' ? 'bg-gray-600' : 'bg-red-600'
                }`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.username}</h3>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className="capitalize">{user.role}</span>
                    <span>Last login: {user.lastLogin}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    {user.permissions.map(permission => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-blue-600 text-xs rounded-full"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={user.status} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Key className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
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

  const renderAuditLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Audit Logs</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 bg-gray-700 rounded-md text-sm"
            />
          </div>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {accessLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      
      <Card title="Vulnerability Scanning">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Automatic Scanning</p>
              <p className="text-sm text-gray-400">Automatically scan new images and containers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Scan Schedule</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Scanner Engine</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="trivy">Trivy</option>
              <option value="clair">Clair</option>
              <option value="snyk">Snyk</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Access Control">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Multi-Factor Authentication</p>
              <p className="text-sm text-gray-400">Require MFA for all users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password Policy</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Minimum 8 characters</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Require uppercase letters</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Require special characters</span>
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'vulnerabilities': return renderVulnerabilities();
      case 'scans': return renderScans();
      case 'access': return renderAccessControl();
      case 'audit': return renderAuditLogs();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Shield className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-2xl font-bold">Security Center</h1>
            <p className="text-gray-400">Monitor and manage security across your infrastructure</p>
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