import React, { useState, useEffect } from 'react';
import { 
  Database as DatabaseIcon, 
  Play, 
  Save, 
  Download,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Settings,
  Server,
  Table,
  Key,
  Users,
  Lock,
  Unlock,
  Copy,
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Editor from '@monaco-editor/react';

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
  host: string;
  port: number;
  database: string;
  username: string;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected: string;
}

interface TableInfo {
  name: string;
  type: 'table' | 'view' | 'collection';
  rows: number;
  size: string;
  lastModified: string;
}

interface QueryResult {
  columns: string[];
  rows: any[][];
  executionTime: number;
  rowCount: number;
}

export default function Database() {
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNewConnection, setShowNewConnection] = useState(false);

  const tabs = [
    { id: 'connections', label: 'Connections' },
    { id: 'query', label: 'Query Editor' },
    { id: 'tables', label: 'Tables' },
    { id: 'backup', label: 'Backup & Restore' },
    { id: 'users', label: 'User Management' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchConnections();
    fetchTables();
  }, []);

  const fetchConnections = async () => {
    const mockConnections: DatabaseConnection[] = [
      {
        id: '1',
        name: 'Production PostgreSQL',
        type: 'postgresql',
        host: 'prod-db.example.com',
        port: 5432,
        database: 'app_production',
        username: 'app_user',
        status: 'connected',
        lastConnected: '2 minutes ago'
      },
      {
        id: '2',
        name: 'Development MySQL',
        type: 'mysql',
        host: 'dev-mysql.example.com',
        port: 3306,
        database: 'app_development',
        username: 'dev_user',
        status: 'connected',
        lastConnected: '5 minutes ago'
      },
      {
        id: '3',
        name: 'Analytics MongoDB',
        type: 'mongodb',
        host: 'analytics-mongo.example.com',
        port: 27017,
        database: 'analytics',
        username: 'analytics_user',
        status: 'disconnected',
        lastConnected: '1 hour ago'
      },
      {
        id: '4',
        name: 'Cache Redis',
        type: 'redis',
        host: 'cache-redis.example.com',
        port: 6379,
        database: '0',
        username: 'cache_user',
        status: 'connected',
        lastConnected: '1 minute ago'
      }
    ];
    setConnections(mockConnections);
  };

  const fetchTables = async () => {
    const mockTables: TableInfo[] = [
      {
        name: 'users',
        type: 'table',
        rows: 15420,
        size: '2.3 MB',
        lastModified: '2 hours ago'
      },
      {
        name: 'orders',
        type: 'table',
        rows: 45678,
        size: '8.7 MB',
        lastModified: '30 minutes ago'
      },
      {
        name: 'products',
        type: 'table',
        rows: 2341,
        size: '1.1 MB',
        lastModified: '1 day ago'
      },
      {
        name: 'user_analytics',
        type: 'view',
        rows: 15420,
        size: '0 B',
        lastModified: '3 hours ago'
      }
    ];
    setTables(mockTables);
  };

  const executeQuery = async () => {
    setLoading(true);
    try {
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult: QueryResult = {
        columns: ['id', 'name', 'email', 'created_at', 'status'],
        rows: [
          [1, 'John Doe', 'john@example.com', '2024-01-15 10:30:00', 'active'],
          [2, 'Jane Smith', 'jane@example.com', '2024-01-14 15:45:00', 'active'],
          [3, 'Bob Wilson', 'bob@example.com', '2024-01-13 09:20:00', 'inactive'],
          [4, 'Alice Cooper', 'alice@example.com', '2024-01-12 14:10:00', 'active'],
          [5, 'Charlie Brown', 'charlie@example.com', '2024-01-11 11:30:00', 'pending']
        ],
        executionTime: 45,
        rowCount: 5
      };
      setQueryResult(mockResult);
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectToDatabase = async (connectionId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'connected', lastConnected: 'Just now' }
          : conn
      ));
    } catch (error) {
      console.error('Error connecting to database:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderConnections = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Database Connections</h2>
        <Button onClick={() => setShowNewConnection(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Connection
        </Button>
      </div>

      <div className="grid gap-4">
        {connections.map(connection => (
          <Card key={connection.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  connection.type === 'postgresql' ? 'bg-blue-600' :
                  connection.type === 'mysql' ? 'bg-orange-600' :
                  connection.type === 'mongodb' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  <DatabaseIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{connection.name}</h3>
                  <p className="text-gray-400">{connection.host}:{connection.port}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Database: {connection.database}</span>
                    <span>User: {connection.username}</span>
                    <span>Last connected: {connection.lastConnected}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={connection.status} />
                <div className="flex space-x-2">
                  {connection.status === 'disconnected' ? (
                    <Button
                      size="sm"
                      onClick={() => connectToDatabase(connection.id)}
                      loading={loading}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedConnection(connection.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
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

      {showNewConnection && (
        <Card title="New Database Connection">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Connection Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 rounded-md px-3 py-2"
                  placeholder="My Database"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Database Type</label>
                <select className="w-full bg-gray-700 rounded-md px-3 py-2">
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="redis">Redis</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Host</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 rounded-md px-3 py-2"
                  placeholder="localhost"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Port</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 rounded-md px-3 py-2"
                  placeholder="5432"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Database</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 rounded-md px-3 py-2"
                  placeholder="database_name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 rounded-md px-3 py-2"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-gray-700 rounded-md px-3 py-2"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowNewConnection(false)}>
                Cancel
              </Button>
              <Button>Test & Save</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderQueryEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">SQL Query Editor</h2>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Save className="w-4 h-4 mr-2" />
            Save Query
          </Button>
          <Button onClick={executeQuery} loading={loading}>
            <Play className="w-4 h-4 mr-2" />
            Execute
          </Button>
        </div>
      </div>

      <Card>
        <div className="h-64">
          <Editor
            height="100%"
            defaultLanguage="sql"
            value={sqlQuery}
            onChange={(value) => setSqlQuery(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true
            }}
          />
        </div>
      </Card>

      {queryResult && (
        <Card title="Query Results">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{queryResult.rowCount} rows returned</span>
              <span>Execution time: {queryResult.executionTime}ms</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    {queryResult.columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {queryResult.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-700">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3">
              <Button size="sm" variant="secondary">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderTables = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Database Tables</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tables..."
              className="pl-10 pr-4 py-2 bg-gray-700 rounded-md text-sm"
            />
          </div>
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={fetchTables} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {tables.map(table => (
          <Card key={table.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  table.type === 'table' ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  <Table className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{table.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className="capitalize">{table.type}</span>
                    <span>{table.rows.toLocaleString()} rows</span>
                    <span>{table.size}</span>
                    <span>Modified {table.lastModified}</span>
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

  const renderBackup = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Backup & Restore</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Create Backup">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Backup Name</label>
              <input
                type="text"
                defaultValue={`backup_${new Date().toISOString().split('T')[0]}`}
                className="w-full bg-gray-700 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tables to Backup</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tables.map(table => (
                  <label key={table.name} className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{table.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Compression</label>
              <select className="w-full bg-gray-700 rounded-md px-3 py-2">
                <option value="gzip">GZIP</option>
                <option value="none">None</option>
              </select>
            </div>

            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Create Backup
            </Button>
          </div>
        </Card>

        <Card title="Restore Database">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Backup File</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Drop backup file here or click to browse</p>
                <input type="file" className="hidden" accept=".sql,.gz" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Drop existing tables</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Create tables if not exists</span>
              </label>
            </div>

            <Button className="w-full" variant="secondary">
              <Upload className="w-4 h-4 mr-2" />
              Restore Database
            </Button>
          </div>
        </Card>
      </div>

      <Card title="Backup History">
        <div className="space-y-3">
          {[
            { name: 'backup_2024-01-15', size: '45.2 MB', date: '2024-01-15 10:30:00', status: 'completed' },
            { name: 'backup_2024-01-14', size: '44.8 MB', date: '2024-01-14 10:30:00', status: 'completed' },
            { name: 'backup_2024-01-13', size: '44.1 MB', date: '2024-01-13 10:30:00', status: 'completed' }
          ].map((backup, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium">{backup.name}</p>
                  <p className="text-sm text-gray-400">{backup.size} • {backup.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge status={backup.status} />
                <Button size="sm" variant="secondary">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Database Users</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4">
        {[
          { username: 'admin', role: 'superuser', status: 'active', lastLogin: '2 hours ago' },
          { username: 'app_user', role: 'readwrite', status: 'active', lastLogin: '5 minutes ago' },
          { username: 'readonly_user', role: 'readonly', status: 'active', lastLogin: '1 day ago' },
          { username: 'backup_user', role: 'backup', status: 'inactive', lastLogin: '1 week ago' }
        ].map((user, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.username}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className="capitalize">{user.role}</span>
                    <span>Last login: {user.lastLogin}</span>
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
                    <Edit className="w-4 h-4" />
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
      <h2 className="text-xl font-semibold">Database Settings</h2>
      
      <Card title="Connection Pool">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Connections</label>
              <input
                type="number"
                defaultValue="100"
                className="w-full bg-gray-700 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Connection Timeout</label>
              <input
                type="number"
                defaultValue="30"
                className="w-full bg-gray-700 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Query Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Default Row Limit</label>
            <input
              type="number"
              defaultValue="1000"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Auto-format SQL queries</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Show execution time</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Enable query caching</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'connections': return renderConnections();
      case 'query': return renderQueryEditor();
      case 'tables': return renderTables();
      case 'backup': return renderBackup();
      case 'users': return renderUsers();
      case 'settings': return renderSettings();
      default: return renderConnections();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <DatabaseIcon className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold">Database Management</h1>
            <p className="text-gray-400">Connect, query, and manage your databases</p>
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