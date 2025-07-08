import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Key, 
  Eye, 
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
  Save,
  Shield,
  Users,
  Settings,
  Copy,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Database
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface VaultSecret {
  path: string;
  keys: string[];
  metadata: {
    created_time: string;
    deletion_time: string;
    destroyed: boolean;
    version: number;
  };
}

interface VaultPolicy {
  name: string;
  rules: string;
  created_at: string;
  updated_at: string;
}

interface VaultAuth {
  type: string;
  description: string;
  accessor: string;
  config: {
    default_lease_ttl: number;
    max_lease_ttl: number;
  };
}

interface VaultMount {
  type: string;
  description: string;
  accessor: string;
  config: {
    default_lease_ttl: number;
    max_lease_ttl: number;
  };
  options: Record<string, any>;
}

export default function Vault() {
  const [activeTab, setActiveTab] = useState('secrets');
  const [secrets, setSecrets] = useState<VaultSecret[]>([]);
  const [policies, setPolicies] = useState<VaultPolicy[]>([]);
  const [authMethods, setAuthMethods] = useState<VaultAuth[]>([]);
  const [mounts, setMounts] = useState<VaultMount[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSecretValues, setShowSecretValues] = useState<Record<string, boolean>>({});

  const tabs = [
    { id: 'secrets', label: 'Secrets' },
    { id: 'policies', label: 'Policies' },
    { id: 'auth', label: 'Auth Methods' },
    { id: 'mounts', label: 'Secret Engines' },
    { id: 'audit', label: 'Audit Logs' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchSecrets();
    fetchPolicies();
    fetchAuthMethods();
    fetchMounts();
  }, []);

  const fetchSecrets = async () => {
    const mockSecrets: VaultSecret[] = [
      {
        path: 'secret/database/postgres',
        keys: ['username', 'password', 'host', 'port'],
        metadata: {
          created_time: '2024-01-15T10:30:00Z',
          deletion_time: '',
          destroyed: false,
          version: 1
        }
      },
      {
        path: 'secret/api/github',
        keys: ['token', 'webhook_secret'],
        metadata: {
          created_time: '2024-01-14T15:45:00Z',
          deletion_time: '',
          destroyed: false,
          version: 2
        }
      },
      {
        path: 'secret/aws/credentials',
        keys: ['access_key_id', 'secret_access_key', 'region'],
        metadata: {
          created_time: '2024-01-10T09:20:00Z',
          deletion_time: '',
          destroyed: false,
          version: 1
        }
      },
      {
        path: 'secret/ssl/certificates',
        keys: ['private_key', 'certificate', 'ca_bundle'],
        metadata: {
          created_time: '2024-01-05T14:10:00Z',
          deletion_time: '',
          destroyed: false,
          version: 3
        }
      }
    ];
    setSecrets(mockSecrets);
  };

  const fetchPolicies = async () => {
    const mockPolicies: VaultPolicy[] = [
      {
        name: 'admin',
        rules: `path "*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}`,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        name: 'developer',
        rules: `path "secret/data/dev/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

path "secret/metadata/dev/*" {
  capabilities = ["list"]
}`,
        created_at: '2024-01-05T10:00:00Z',
        updated_at: '2024-01-10T15:30:00Z'
      },
      {
        name: 'readonly',
        rules: `path "secret/data/*" {
  capabilities = ["read"]
}

path "secret/metadata/*" {
  capabilities = ["read", "list"]
}`,
        created_at: '2024-01-08T12:00:00Z',
        updated_at: '2024-01-08T12:00:00Z'
      }
    ];
    setPolicies(mockPolicies);
  };

  const fetchAuthMethods = async () => {
    const mockAuthMethods: VaultAuth[] = [
      {
        type: 'token',
        description: 'token based credentials',
        accessor: 'auth_token_12345',
        config: {
          default_lease_ttl: 0,
          max_lease_ttl: 0
        }
      },
      {
        type: 'userpass',
        description: 'username and password authentication',
        accessor: 'auth_userpass_67890',
        config: {
          default_lease_ttl: 3600,
          max_lease_ttl: 86400
        }
      },
      {
        type: 'ldap',
        description: 'LDAP authentication',
        accessor: 'auth_ldap_abcdef',
        config: {
          default_lease_ttl: 7200,
          max_lease_ttl: 86400
        }
      }
    ];
    setAuthMethods(mockAuthMethods);
  };

  const fetchMounts = async () => {
    const mockMounts: VaultMount[] = [
      {
        type: 'kv',
        description: 'key/value secret storage',
        accessor: 'kv_12345',
        config: {
          default_lease_ttl: 0,
          max_lease_ttl: 0
        },
        options: {
          version: '2'
        }
      },
      {
        type: 'database',
        description: 'database credentials',
        accessor: 'database_67890',
        config: {
          default_lease_ttl: 3600,
          max_lease_ttl: 86400
        },
        options: {}
      },
      {
        type: 'aws',
        description: 'AWS credentials',
        accessor: 'aws_abcdef',
        config: {
          default_lease_ttl: 3600,
          max_lease_ttl: 43200
        },
        options: {}
      }
    ];
    setMounts(mockMounts);
  };

  const toggleSecretVisibility = (path: string) => {
    setShowSecretValues(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderSecrets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vault Secrets</h2>
        <div className="flex space-x-3">
          <Button onClick={fetchSecrets} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Secret
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {secrets.map(secret => (
          <Card key={secret.path}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{secret.path}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Version: {secret.metadata.version}</span>
                    <span>Keys: {secret.keys.length}</span>
                    <span>Created: {new Date(secret.metadata.created_time).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {secret.keys.map(key => (
                        <span
                          key={key}
                          className="px-2 py-1 bg-gray-600 text-xs rounded"
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={secret.metadata.destroyed ? 'destroyed' : 'active'} />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleSecretVisibility(secret.path)}
                  >
                    {showSecretValues[secret.path] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Copy className="w-4 h-4" />
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

            {showSecretValues[secret.path] && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <h4 className="font-medium mb-2">Secret Values:</h4>
                <div className="space-y-2">
                  {secret.keys.map(key => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-mono text-sm">{key}:</span>
                      <span className="font-mono text-sm text-gray-300">••••••••</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Access Policies</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Policy
        </Button>
      </div>

      <div className="grid gap-4">
        {policies.map(policy => (
          <Card key={policy.name}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{policy.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Created: {new Date(policy.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(policy.updated_at).toLocaleDateString()}</span>
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
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400">
              <pre>{policy.rules}</pre>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAuthMethods = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Authentication Methods</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Enable Auth Method
        </Button>
      </div>

      <div className="grid gap-4">
        {authMethods.map(auth => (
          <Card key={auth.accessor}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  auth.type === 'token' ? 'bg-purple-600' :
                  auth.type === 'userpass' ? 'bg-blue-600' :
                  auth.type === 'ldap' ? 'bg-orange-600' : 'bg-gray-600'
                }`}>
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg capitalize">{auth.type}</h3>
                  <p className="text-gray-400">{auth.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Accessor: {auth.accessor}</span>
                    <span>Default TTL: {auth.config.default_lease_ttl}s</span>
                    <span>Max TTL: {auth.config.max_lease_ttl}s</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="secondary">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMounts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Secret Engines</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Enable Engine
        </Button>
      </div>

      <div className="grid gap-4">
        {mounts.map(mount => (
          <Card key={mount.accessor}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  mount.type === 'kv' ? 'bg-blue-600' :
                  mount.type === 'database' ? 'bg-green-600' :
                  mount.type === 'aws' ? 'bg-orange-600' : 'bg-gray-600'
                }`}>
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{mount.type.toUpperCase()}</h3>
                  <p className="text-gray-400">{mount.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Accessor: {mount.accessor}</span>
                    <span>Default TTL: {mount.config.default_lease_ttl}s</span>
                    <span>Max TTL: {mount.config.max_lease_ttl}s</span>
                  </div>
                  {mount.options.version && (
                    <div className="mt-1">
                      <span className="px-2 py-1 bg-blue-600 text-xs rounded">
                        Version {mount.options.version}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="secondary">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Trash2 className="w-4 h-4" />
                </Button>
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
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Enable Audit Device
          </Button>
        </div>
      </div>

      <Card>
        <div className="space-y-3">
          {[
            {
              timestamp: '2024-01-15T11:30:00Z',
              type: 'request',
              operation: 'read',
              path: 'secret/data/database/postgres',
              client_token: 'hvs.CAESIJ...',
              status: 'success'
            },
            {
              timestamp: '2024-01-15T11:25:00Z',
              type: 'request',
              operation: 'create',
              path: 'secret/data/api/github',
              client_token: 'hvs.CAESIJ...',
              status: 'success'
            },
            {
              timestamp: '2024-01-15T11:20:00Z',
              type: 'request',
              operation: 'delete',
              path: 'secret/data/temp/test',
              client_token: 'hvs.CAESIJ...',
              status: 'permission_denied'
            }
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {log.status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {log.status === 'permission_denied' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                <div>
                  <p className="font-medium">{log.operation.toUpperCase()} {log.path}</p>
                  <p className="text-sm text-gray-400">
                    Token: {log.client_token.substring(0, 15)}... • {log.timestamp}
                  </p>
                </div>
              </div>
              <StatusBadge status={log.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Vault Settings</h2>
      
      <Card title="Server Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Vault Address</label>
            <input
              type="url"
              defaultValue="https://vault.example.com:8200"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API Version</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="v1">v1</option>
              <option value="v2">v2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Lease TTL</label>
            <input
              type="text"
              defaultValue="768h"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Lease TTL</label>
            <input
              type="text"
              defaultValue="8760h"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>

      <Card title="Security Settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable TLS</p>
              <p className="text-sm text-gray-400">Use HTTPS for all communications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Disable Mlock</p>
              <p className="text-sm text-gray-400">Disable memory locking</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Seal Type</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="shamir">Shamir</option>
              <option value="awskms">AWS KMS</option>
              <option value="azurekeyvault">Azure Key Vault</option>
              <option value="gcpckms">GCP Cloud KMS</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Backup & Recovery">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Automatic Snapshots</p>
              <p className="text-sm text-gray-400">Enable automatic backup snapshots</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Snapshot Interval</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="1h">Every hour</option>
              <option value="6h">Every 6 hours</option>
              <option value="24h">Daily</option>
              <option value="168h">Weekly</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Create Snapshot
            </Button>
            <Button variant="secondary">
              <Upload className="w-4 h-4 mr-2" />
              Restore Snapshot
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'secrets': return renderSecrets();
      case 'policies': return renderPolicies();
      case 'auth': return renderAuthMethods();
      case 'mounts': return renderMounts();
      case 'audit': return renderAuditLogs();
      case 'settings': return renderSettings();
      default: return renderSecrets();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Lock className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold">HashiCorp Vault</h1>
            <p className="text-gray-400">Secure secrets management and data protection</p>
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