import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key,
  Save,
  RefreshCw,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    security: true,
    updates: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Profile Settings</h2>
      
      <Card title="Personal Information">
        <div className="space-y-4">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <button className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full hover:bg-blue-700">
                <Upload className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium">John Doe</h3>
              <p className="text-gray-400">DevOps Engineer</p>
              <Button size="sm" variant="secondary" className="mt-2">
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                defaultValue="John"
                className="w-full bg-gray-700 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full bg-gray-700 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Title</label>
            <input
              type="text"
              defaultValue="DevOps Engineer"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              rows={3}
              defaultValue="Experienced DevOps engineer with expertise in cloud infrastructure, CI/CD, and container orchestration."
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </Card>

      <Card title="Account Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              defaultValue="john.doe"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Zone</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <Button variant="secondary" className="text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Appearance</h2>
      
      <Card title="Theme">
        <div className="space-y-4">
          <p className="text-gray-400">Choose your preferred theme</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'light', name: 'Light', icon: Sun, preview: 'bg-white border-gray-300' },
              { id: 'dark', name: 'Dark', icon: Moon, preview: 'bg-gray-900 border-gray-700' },
              { id: 'system', name: 'System', icon: Monitor, preview: 'bg-gradient-to-br from-white to-gray-900' }
            ].map(themeOption => {
              const Icon = themeOption.icon;
              return (
                <button
                  key={themeOption.id}
                  onClick={() => setTheme(themeOption.id)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    theme === themeOption.id 
                      ? 'border-blue-500 bg-blue-600/20' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-full h-16 rounded-md mb-3 ${themeOption.preview}`}></div>
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{themeOption.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card title="Display">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Font Size</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sidebar Width</label>
            <input
              type="range"
              min="200"
              max="400"
              defaultValue="256"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Show line numbers in code editor</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Enable syntax highlighting</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Show minimap in editor</span>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Color Scheme">
        <div className="space-y-4">
          <p className="text-gray-400">Customize the color scheme for different elements</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Primary', color: '#3B82F6' },
              { name: 'Success', color: '#10B981' },
              { name: 'Warning', color: '#F59E0B' },
              { name: 'Error', color: '#EF4444' }
            ].map(colorOption => (
              <div key={colorOption.name} className="space-y-2">
                <label className="block text-sm font-medium">{colorOption.name}</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    defaultValue={colorOption.color}
                    className="w-8 h-8 rounded border border-gray-600"
                  />
                  <input
                    type="text"
                    defaultValue={colorOption.color}
                    className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      
      <Card title="Notification Preferences">
        <div className="space-y-4">
          {[
            {
              key: 'email',
              title: 'Email Notifications',
              description: 'Receive notifications via email'
            },
            {
              key: 'push',
              title: 'Push Notifications',
              description: 'Receive browser push notifications'
            },
            {
              key: 'security',
              title: 'Security Alerts',
              description: 'Get notified about security events'
            },
            {
              key: 'updates',
              title: 'System Updates',
              description: 'Notifications about system updates'
            }
          ].map(option => (
            <div key={option.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{option.title}</p>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[option.key as keyof typeof notifications]}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev,
                    [option.key]: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Alert Thresholds">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">CPU Usage Alert (%)</label>
            <input
              type="number"
              defaultValue="80"
              min="0"
              max="100"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Memory Usage Alert (%)</label>
            <input
              type="number"
              defaultValue="85"
              min="0"
              max="100"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Disk Usage Alert (%)</label>
            <input
              type="number"
              defaultValue="90"
              min="0"
              max="100"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      
      <Card title="Password">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-gray-700 rounded-md px-3 py-2 pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <Button>
            <Save className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </div>
      </Card>

      <Card title="Two-Factor Authentication">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="secondary">
              Enable 2FA
            </Button>
          </div>
        </div>
      </Card>

      <Card title="API Keys">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Manage API Keys</p>
            <Button>
              <Key className="w-4 h-4 mr-2" />
              Generate New Key
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Production API Key', created: '2024-01-10', lastUsed: '2 hours ago' },
              { name: 'Development API Key', created: '2024-01-05', lastUsed: '1 day ago' }
            ].map((key, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">{key.name}</p>
                  <p className="text-sm text-gray-400">Created: {key.created} • Last used: {key.lastUsed}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Active Sessions">
        <div className="space-y-3">
          {[
            { device: 'Chrome on MacBook Pro', location: 'San Francisco, CA', current: true },
            { device: 'Firefox on Windows', location: 'New York, NY', current: false },
            { device: 'Safari on iPhone', location: 'Los Angeles, CA', current: false }
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">{session.device}</p>
                <p className="text-sm text-gray-400">{session.location}</p>
              </div>
              <div className="flex items-center space-x-3">
                {session.current && (
                  <span className="px-2 py-1 bg-green-600 text-xs rounded-full">Current</span>
                )}
                {!session.current && (
                  <Button size="sm" variant="secondary">
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Integrations</h2>
      
      <Card title="Cloud Providers">
        <div className="space-y-4">
          {[
            { name: 'Amazon Web Services', connected: true, icon: '🟠' },
            { name: 'Microsoft Azure', connected: false, icon: '🔵' },
            { name: 'Google Cloud Platform', connected: true, icon: '🔴' }
          ].map((provider, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{provider.icon}</span>
                <div>
                  <p className="font-medium">{provider.name}</p>
                  <p className="text-sm text-gray-400">
                    {provider.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button size="sm" variant={provider.connected ? 'secondary' : 'primary'}>
                {provider.connected ? 'Configure' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Development Tools">
        <div className="space-y-4">
          {[
            { name: 'GitHub', connected: true, icon: '⚫' },
            { name: 'GitLab', connected: false, icon: '🟠' },
            { name: 'Jenkins', connected: true, icon: '🔵' },
            { name: 'Docker Hub', connected: true, icon: '🔵' }
          ].map((tool, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-sm text-gray-400">
                    {tool.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button size="sm" variant={tool.connected ? 'secondary' : 'primary'}>
                {tool.connected ? 'Configure' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Advanced Settings</h2>
      
      <Card title="Data Management">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-gray-400">Download all your data in JSON format</p>
            </div>
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Import Data</p>
              <p className="text-sm text-gray-400">Import data from a backup file</p>
            </div>
            <Button variant="secondary">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Clear Cache</p>
              <p className="text-sm text-gray-400">Clear all cached data and preferences</p>
            </div>
            <Button variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Performance">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Auto-refresh Interval (seconds)</label>
            <input
              type="number"
              defaultValue="30"
              min="5"
              max="300"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Log Lines</label>
            <input
              type="number"
              defaultValue="1000"
              min="100"
              max="10000"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Enable hardware acceleration</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Preload resources</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Compress network requests</span>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Developer Options">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Enable debug mode</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Show performance metrics</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Enable experimental features</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Download Debug Logs
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfile();
      case 'appearance': return renderAppearance();
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
      case 'integrations': return renderIntegrations();
      case 'advanced': return renderAdvanced();
      default: return renderProfile();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <SettingsIcon className="w-8 h-8 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-400">Manage your account and application preferences</p>
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