import React, { useState, useEffect } from 'react';
import { 
  Cog, 
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
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  Code,
  Server,
  Users,
  Book
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Editor from '@monaco-editor/react';

interface AnsiblePlaybook {
  id: string;
  name: string;
  description: string;
  path: string;
  status: 'ready' | 'running' | 'success' | 'failed';
  lastRun: string;
  duration: number;
  tasks: number;
  hosts: string[];
}

interface AnsibleInventory {
  id: string;
  name: string;
  type: 'static' | 'dynamic';
  hosts: AnsibleHost[];
  groups: AnsibleGroup[];
  lastUpdated: string;
}

interface AnsibleHost {
  name: string;
  ip: string;
  status: 'reachable' | 'unreachable' | 'unknown';
  os: string;
  groups: string[];
  variables: Record<string, any>;
}

interface AnsibleGroup {
  name: string;
  hosts: string[];
  children: string[];
  variables: Record<string, any>;
}

interface AnsibleTask {
  id: string;
  name: string;
  module: string;
  status: 'pending' | 'running' | 'ok' | 'changed' | 'failed' | 'skipped';
  host: string;
  startTime: string;
  duration: number;
  output?: string;
}

interface AnsibleExecution {
  id: string;
  playbook: string;
  status: 'running' | 'success' | 'failed';
  startTime: string;
  duration: number;
  tasks: AnsibleTask[];
  summary: {
    ok: number;
    changed: number;
    failed: number;
    skipped: number;
  };
}

export default function Ansible() {
  const [activeTab, setActiveTab] = useState('playbooks');
  const [playbooks, setPlaybooks] = useState<AnsiblePlaybook[]>([]);
  const [inventories, setInventories] = useState<AnsibleInventory[]>([]);
  const [executions, setExecutions] = useState<AnsibleExecution[]>([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [playbookCode, setPlaybookCode] = useState('');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'playbooks', label: 'Playbooks' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'executions', label: 'Executions' },
    { id: 'editor', label: 'Editor' },
    { id: 'vault', label: 'Vault' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchPlaybooks();
    fetchInventories();
    fetchExecutions();
    loadPlaybookCode();
  }, []);

  const fetchPlaybooks = async () => {
    const mockPlaybooks: AnsiblePlaybook[] = [
      {
        id: '1',
        name: 'web-server-setup',
        description: 'Configure web servers with Nginx and SSL',
        path: '/ansible/playbooks/web-server-setup.yml',
        status: 'ready',
        lastRun: '2 hours ago',
        duration: 180,
        tasks: 15,
        hosts: ['web-01', 'web-02', 'web-03']
      },
      {
        id: '2',
        name: 'database-backup',
        description: 'Automated database backup and rotation',
        path: '/ansible/playbooks/database-backup.yml',
        status: 'success',
        lastRun: '1 day ago',
        duration: 45,
        tasks: 8,
        hosts: ['db-01', 'db-02']
      },
      {
        id: '3',
        name: 'security-hardening',
        description: 'Apply security hardening configurations',
        path: '/ansible/playbooks/security-hardening.yml',
        status: 'running',
        lastRun: '5 minutes ago',
        duration: 0,
        tasks: 25,
        hosts: ['web-01', 'web-02', 'db-01', 'db-02']
      }
    ];
    setPlaybooks(mockPlaybooks);
  };

  const fetchInventories = async () => {
    const mockInventories: AnsibleInventory[] = [
      {
        id: '1',
        name: 'production',
        type: 'static',
        lastUpdated: '1 hour ago',
        hosts: [
          {
            name: 'web-01',
            ip: '10.0.1.10',
            status: 'reachable',
            os: 'Ubuntu 22.04',
            groups: ['webservers', 'production'],
            variables: { nginx_port: 80, ssl_enabled: true }
          },
          {
            name: 'web-02',
            ip: '10.0.1.11',
            status: 'reachable',
            os: 'Ubuntu 22.04',
            groups: ['webservers', 'production'],
            variables: { nginx_port: 80, ssl_enabled: true }
          },
          {
            name: 'db-01',
            ip: '10.0.2.10',
            status: 'reachable',
            os: 'Ubuntu 22.04',
            groups: ['databases', 'production'],
            variables: { mysql_port: 3306, backup_enabled: true }
          }
        ],
        groups: [
          {
            name: 'webservers',
            hosts: ['web-01', 'web-02'],
            children: [],
            variables: { http_port: 80, https_port: 443 }
          },
          {
            name: 'databases',
            hosts: ['db-01'],
            children: [],
            variables: { mysql_port: 3306 }
          }
        ]
      }
    ];
    setInventories(mockInventories);
  };

  const fetchExecutions = async () => {
    const mockExecutions: AnsibleExecution[] = [
      {
        id: '1',
        playbook: 'web-server-setup',
        status: 'success',
        startTime: '2024-01-15 10:30:00',
        duration: 180,
        summary: { ok: 45, changed: 12, failed: 0, skipped: 3 },
        tasks: []
      },
      {
        id: '2',
        playbook: 'database-backup',
        status: 'success',
        startTime: '2024-01-14 02:00:00',
        duration: 45,
        summary: { ok: 16, changed: 4, failed: 0, skipped: 0 },
        tasks: []
      },
      {
        id: '3',
        playbook: 'security-hardening',
        status: 'running',
        startTime: '2024-01-15 11:25:00',
        duration: 0,
        summary: { ok: 15, changed: 8, failed: 0, skipped: 2 },
        tasks: []
      }
    ];
    setExecutions(mockExecutions);
  };

  const loadPlaybookCode = () => {
    const defaultPlaybook = `---
- name: Configure Web Servers
  hosts: webservers
  become: yes
  vars:
    nginx_port: 80
    ssl_port: 443
    domain_name: example.com
    
  tasks:
    - name: Update package cache
      apt:
        update_cache: yes
        cache_valid_time: 3600
      tags: packages

    - name: Install Nginx
      apt:
        name: nginx
        state: present
      notify: restart nginx
      tags: nginx

    - name: Install SSL certificates
      apt:
        name: certbot
        state: present
      tags: ssl

    - name: Create Nginx configuration
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/{{ domain_name }}
        backup: yes
      notify: reload nginx
      tags: config

    - name: Enable site
      file:
        src: /etc/nginx/sites-available/{{ domain_name }}
        dest: /etc/nginx/sites-enabled/{{ domain_name }}
        state: link
      notify: reload nginx
      tags: config

    - name: Remove default site
      file:
        path: /etc/nginx/sites-enabled/default
        state: absent
      notify: reload nginx
      tags: config

    - name: Configure firewall
      ufw:
        rule: allow
        port: "{{ item }}"
        proto: tcp
      loop:
        - "{{ nginx_port }}"
        - "{{ ssl_port }}"
        - "22"
      tags: firewall

    - name: Enable firewall
      ufw:
        state: enabled
        policy: deny
        direction: incoming
      tags: firewall

    - name: Start and enable Nginx
      systemd:
        name: nginx
        state: started
        enabled: yes
      tags: nginx

    - name: Check Nginx status
      uri:
        url: "http://{{ inventory_hostname }}:{{ nginx_port }}"
        method: GET
        status_code: 200
      delegate_to: localhost
      tags: test

  handlers:
    - name: restart nginx
      systemd:
        name: nginx
        state: restarted

    - name: reload nginx
      systemd:
        name: nginx
        state: reloaded

- name: Configure Database Servers
  hosts: databases
  become: yes
  vars:
    mysql_root_password: "{{ vault_mysql_root_password }}"
    mysql_port: 3306
    
  tasks:
    - name: Install MySQL
      apt:
        name: 
          - mysql-server
          - mysql-client
          - python3-pymysql
        state: present
      tags: mysql

    - name: Start and enable MySQL
      systemd:
        name: mysql
        state: started
        enabled: yes
      tags: mysql

    - name: Set MySQL root password
      mysql_user:
        name: root
        password: "{{ mysql_root_password }}"
        login_unix_socket: /var/run/mysqld/mysqld.sock
      tags: mysql

    - name: Create MySQL configuration
      template:
        src: my.cnf.j2
        dest: /etc/mysql/mysql.conf.d/custom.cnf
        backup: yes
      notify: restart mysql
      tags: config

    - name: Configure MySQL firewall
      ufw:
        rule: allow
        port: "{{ mysql_port }}"
        proto: tcp
        src: "{{ hostvars[item]['ansible_default_ipv4']['address'] }}"
      loop: "{{ groups['webservers'] }}"
      tags: firewall

  handlers:
    - name: restart mysql
      systemd:
        name: mysql
        state: restarted`;
    setPlaybookCode(defaultPlaybook);
  };

  const runPlaybook = async (playbookId: string) => {
    setLoading(true);
    try {
      // Simulate playbook execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPlaybooks(prev => prev.map(pb => 
        pb.id === playbookId 
          ? { ...pb, status: 'running' }
          : pb
      ));
      
      // Simulate completion
      setTimeout(() => {
        setPlaybooks(prev => prev.map(pb => 
          pb.id === playbookId 
            ? { ...pb, status: 'success', lastRun: 'Just now' }
            : pb
        ));
      }, 5000);
    } catch (error) {
      console.error('Error running playbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPlaybooks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ansible Playbooks</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Playbook
        </Button>
      </div>

      <div className="grid gap-4">
        {playbooks.map(playbook => (
          <Card key={playbook.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  playbook.status === 'success' ? 'bg-green-600' :
                  playbook.status === 'failed' ? 'bg-red-600' :
                  playbook.status === 'running' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{playbook.name}</h3>
                  <p className="text-gray-400">{playbook.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>{playbook.tasks} tasks</span>
                    <span>{playbook.hosts.length} hosts</span>
                    <span>Last run: {playbook.lastRun}</span>
                    {playbook.duration > 0 && (
                      <span>Duration: {playbook.duration}s</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={playbook.status} />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => runPlaybook(playbook.id)}
                    loading={loading && playbook.status === 'running'}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
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

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ansible Inventory</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Host
        </Button>
      </div>

      {inventories.map(inventory => (
        <div key={inventory.id} className="space-y-4">
          <Card title={`Inventory: ${inventory.name}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="capitalize">{inventory.type}</span>
                  <span>{inventory.hosts.length} hosts</span>
                  <span>{inventory.groups.length} groups</span>
                  <span>Updated: {inventory.lastUpdated}</span>
                </div>
                <Button size="sm" variant="secondary">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Hosts">
              <div className="space-y-3">
                {inventory.hosts.map(host => (
                  <div key={host.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        host.status === 'reachable' ? 'bg-green-500' :
                        host.status === 'unreachable' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <p className="font-medium">{host.name}</p>
                        <p className="text-sm text-gray-400">{host.ip} • {host.os}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {host.groups.map(group => (
                            <span
                              key={group}
                              className="px-2 py-1 bg-blue-600 text-xs rounded-full"
                            >
                              {group}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Groups">
              <div className="space-y-3">
                {inventory.groups.map(group => (
                  <div key={group.name} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{group.name}</h4>
                      <span className="text-sm text-gray-400">{group.hosts.length} hosts</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {group.hosts.map(hostName => (
                        <span
                          key={hostName}
                          className="px-2 py-1 bg-gray-600 text-xs rounded"
                        >
                          {hostName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );

  const renderExecutions = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Playbook Executions</h2>
      
      <div className="grid gap-4">
        {executions.map(execution => (
          <Card key={execution.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  execution.status === 'success' ? 'bg-green-600' :
                  execution.status === 'failed' ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                  {execution.status === 'success' && <CheckCircle className="w-6 h-6 text-white" />}
                  {execution.status === 'failed' && <XCircle className="w-6 h-6 text-white" />}
                  {execution.status === 'running' && <Clock className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{execution.playbook}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Started: {execution.startTime}</span>
                    {execution.duration > 0 && (
                      <span>Duration: {execution.duration}s</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="text-green-400">OK: {execution.summary.ok}</span>
                    <span className="text-blue-400">Changed: {execution.summary.changed}</span>
                    <span className="text-red-400">Failed: {execution.summary.failed}</span>
                    <span className="text-gray-400">Skipped: {execution.summary.skipped}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={execution.status} />
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

  const renderEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Playbook Editor</h2>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Card>
        <div className="h-96">
          <Editor
            height="100%"
            defaultLanguage="yaml"
            value={playbookCode}
            onChange={(value) => setPlaybookCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true
            }}
          />
        </div>
      </Card>

      <div className="flex space-x-3">
        <Button>
          <Eye className="w-4 h-4 mr-2" />
          Validate
        </Button>
        <Button variant="secondary">
          <Code className="w-4 h-4 mr-2" />
          Format
        </Button>
        <Button variant="secondary">
          <Play className="w-4 h-4 mr-2" />
          Dry Run
        </Button>
      </div>
    </div>
  );

  const renderVault = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ansible Vault</h2>
      
      <Card title="Encrypted Variables">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium">vault_mysql_root_password</p>
              <p className="text-sm text-gray-400">MySQL root password</p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium">vault_ssl_private_key</p>
              <p className="text-sm text-gray-400">SSL private key</p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium">vault_api_keys</p>
              <p className="text-sm text-gray-400">External API keys</p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Encrypted Variable
          </Button>
        </div>
      </Card>

      <Card title="Vault Files">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium">group_vars/production/vault.yml</p>
                <p className="text-sm text-gray-400">Production secrets</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium">group_vars/staging/vault.yml</p>
                <p className="text-sm text-gray-400">Staging secrets</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ansible Settings</h2>
      
      <Card title="Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Inventory File</label>
            <input
              type="text"
              defaultValue="/etc/ansible/hosts"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Remote User</label>
            <input
              type="text"
              defaultValue="ansible"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Private Key File</label>
            <input
              type="text"
              defaultValue="~/.ssh/ansible_rsa"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Host Key Checking</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Execution Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Forks (Parallel Execution)</label>
            <input
              type="number"
              defaultValue="5"
              min="1"
              max="50"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timeout (seconds)</label>
            <input
              type="number"
              defaultValue="10"
              min="1"
              max="300"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Gather facts automatically</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Enable pipelining</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Retry files enabled</span>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Vault Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Vault Password File</label>
            <input
              type="text"
              placeholder="Path to vault password file"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Ask vault password</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Auto-decrypt vault files</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'playbooks': return renderPlaybooks();
      case 'inventory': return renderInventory();
      case 'executions': return renderExecutions();
      case 'editor': return renderEditor();
      case 'vault': return renderVault();
      case 'settings': return renderSettings();
      default: return renderPlaybooks();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Cog className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-2xl font-bold">Ansible</h1>
            <p className="text-gray-400">Configuration management and automation</p>
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