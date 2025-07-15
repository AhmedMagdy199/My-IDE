import React, { useState } from 'react';

const Consul: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">HashiCorp Consul</h1>
          <p className="text-slate-600 text-lg">Service mesh and service discovery platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'services', label: 'Services', icon: '🔗' },
                { id: 'mesh', label: 'Service Mesh', icon: '🕸️' },
                { id: 'kv', label: 'Key-Value', icon: '🗝️' },
                { id: 'acl', label: 'Access Control', icon: '🔐' },
                { id: 'intentions', label: 'Intentions', icon: '🎯' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  🔍
                </span>
                Service Discovery
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'API Gateway', status: 'healthy', instances: 3, port: 8080 },
                  { name: 'Auth Service', status: 'healthy', instances: 2, port: 8081 },
                  { name: 'File Service', status: 'warning', instances: 1, port: 8082 },
                  { name: 'WebSocket Service', status: 'healthy', instances: 2, port: 8083 },
                  { name: 'Database Service', status: 'critical', instances: 0, port: 5432 }
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'healthy' ? 'bg-emerald-500' :
                        service.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <span className="font-medium text-slate-800">{service.name}</span>
                        <div className="text-sm text-slate-500">Port: {service.port} | Instances: {service.instances}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.status === 'healthy' ? 'bg-emerald-100 text-emerald-800' :
                      service.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  📊
                </span>
                Cluster Metrics
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">CPU Usage</span>
                    <span className="text-sm text-slate-500">45%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Memory Usage</span>
                    <span className="text-sm text-slate-500">67%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-300" style={{ width: '67%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Network I/O</span>
                    <span className="text-sm text-slate-500">23%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-300" style={{ width: '23%' }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">3</div>
                      <div className="text-sm text-slate-500">Active Nodes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">8</div>
                      <div className="text-sm text-slate-500">Services</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Mesh Tab */}
        {activeTab === 'mesh' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  🔗
                </span>
                Connect Proxies
              </h2>
              <div className="space-y-4">
                {[
                  { service: 'api-gateway', proxy: 'envoy', version: '1.24.1', status: 'connected' },
                  { service: 'auth-service', proxy: 'envoy', version: '1.24.1', status: 'connected' },
                  { service: 'file-service', proxy: 'envoy', version: '1.23.2', status: 'disconnected' },
                  { service: 'websocket-service', proxy: 'envoy', version: '1.24.1', status: 'connected' }
                ].map((proxy, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-slate-800">{proxy.service}</h3>
                        <p className="text-sm text-slate-600">{proxy.proxy} v{proxy.version}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        proxy.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {proxy.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  🛡️
                </span>
                mTLS Status
              </h2>
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-emerald-800">Certificate Authority</span>
                    <span className="text-emerald-600 text-sm">Active</span>
                  </div>
                  <p className="text-sm text-emerald-700 mt-1">Root CA expires in 87 days</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-800">Auto-rotation</span>
                    <span className="text-blue-600 text-sm">Enabled</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">Certificates rotate every 24 hours</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-purple-800">Encryption</span>
                    <span className="text-purple-600 text-sm">TLS 1.3</span>
                  </div>
                  <p className="text-sm text-purple-700 mt-1">All service communication encrypted</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key-Value Tab */}
        {activeTab === 'kv' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                🗝️
              </span>
              Key-Value Store
            </h2>
            <div className="space-y-3">
              {[
                { key: 'config/database/host', value: 'postgres.internal', type: 'string' },
                { key: 'config/database/port', value: '5432', type: 'number' },
                { key: 'config/redis/enabled', value: 'true', type: 'boolean' },
                { key: 'config/api/rate_limit', value: '1000', type: 'number' },
                { key: 'config/logging/level', value: 'info', type: 'string' },
                { key: 'feature_flags/new_ui', value: 'false', type: 'boolean' },
                { key: 'secrets/jwt_secret', value: '***hidden***', type: 'secret' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.type === 'string' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'number' ? 'bg-green-100 text-green-800' :
                      item.type === 'boolean' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.type}
                    </span>
                    <span className="font-mono text-sm text-slate-700">{item.key}</span>
                  </div>
                  <span className="font-mono text-sm text-slate-600">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Access Control Tab */}
        {activeTab === 'acl' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  👥
                </span>
                ACL Tokens
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'Bootstrap Token', type: 'management', status: 'active', created: '2024-01-15' },
                  { name: 'API Gateway Token', type: 'client', status: 'active', created: '2024-01-16' },
                  { name: 'Monitoring Token', type: 'client', status: 'active', created: '2024-01-17' },
                  { name: 'Backup Token', type: 'client', status: 'expired', created: '2024-01-10' }
                ].map((token, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-slate-800">{token.name}</h3>
                        <p className="text-sm text-slate-600">Type: {token.type}</p>
                        <p className="text-sm text-slate-500">Created: {token.created}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        token.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {token.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  📋
                </span>
                ACL Policies
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'global-management', rules: 15, services: 'all', nodes: 'all' },
                  { name: 'api-gateway-policy', rules: 8, services: 'api-gateway', nodes: 'read' },
                  { name: 'monitoring-policy', rules: 5, services: 'read', nodes: 'read' },
                  { name: 'backup-policy', rules: 3, services: 'none', nodes: 'read' }
                ].map((policy, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-slate-800 mb-2">{policy.name}</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">Rules:</span>
                        <span className="ml-1 font-medium">{policy.rules}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Services:</span>
                        <span className="ml-1 font-medium">{policy.services}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Nodes:</span>
                        <span className="ml-1 font-medium">{policy.nodes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Intentions Tab */}
        {activeTab === 'intentions' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                🎯
              </span>
              Service Intentions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Destination</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Protocol</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { source: 'api-gateway', destination: 'auth-service', action: 'allow', protocol: 'http', created: '2024-01-15' },
                    { source: 'api-gateway', destination: 'file-service', action: 'allow', protocol: 'http', created: '2024-01-15' },
                    { source: 'auth-service', destination: 'database', action: 'allow', protocol: 'tcp', created: '2024-01-16' },
                    { source: '*', destination: 'monitoring', action: 'deny', protocol: 'http', created: '2024-01-14' },
                    { source: 'websocket-service', destination: 'redis', action: 'allow', protocol: 'tcp', created: '2024-01-17' }
                  ].map((intention, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-sm text-slate-700">{intention.source}</td>
                      <td className="py-3 px-4 font-mono text-sm text-slate-700">{intention.destination}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          intention.action === 'allow' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {intention.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{intention.protocol}</td>
                      <td className="py-3 px-4 text-sm text-slate-500">{intention.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Health Checks Section - Always visible */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                ❤️
              </span>
              Health Checks
            </h2>
            <div className="space-y-3">
              {[
                { name: 'HTTP Health Check', status: 'passing', interval: '10s' },
                { name: 'TCP Health Check', status: 'passing', interval: '30s' },
                { name: 'Script Health Check', status: 'warning', interval: '60s' },
                { name: 'gRPC Health Check', status: 'passing', interval: '15s' }
              ].map((check, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      check.status === 'passing' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></div>
                    <div>
                      <span className="text-sm font-medium text-slate-700">{check.name}</span>
                      <div className="text-xs text-slate-500">Every {check.interval}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                🏛️
              </span>
              Cluster Status
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Leader</span>
                  <span className="text-xs text-emerald-600 font-medium">consul-1</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Followers</span>
                  <span className="text-xs text-blue-600 font-medium">2/2</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                📈
              </span>
              Performance
            </h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">99.9%</div>
                <div className="text-sm text-slate-500">Uptime</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-600">2.3ms</div>
                  <div className="text-xs text-slate-500">Avg Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">1.2k</div>
                  <div className="text-xs text-slate-500">Req/sec</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consul;