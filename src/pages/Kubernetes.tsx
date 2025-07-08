import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
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
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  Terminal,
  Activity,
  Server,
  Network,
  Database
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MetricsChart } from '@/components/common/MetricsChart';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface KubernetesPod {
  name: string;
  namespace: string;
  status: 'Running' | 'Pending' | 'Succeeded' | 'Failed' | 'Unknown';
  ready: string;
  restarts: number;
  age: string;
  node: string;
  ip: string;
  containers: Array<{
    name: string;
    image: string;
    ready: boolean;
    restartCount: number;
  }>;
}

interface KubernetesService {
  name: string;
  namespace: string;
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName';
  clusterIP: string;
  externalIP: string;
  ports: string;
  age: string;
  selector: Record<string, string>;
}

interface KubernetesDeployment {
  name: string;
  namespace: string;
  ready: string;
  upToDate: number;
  available: number;
  age: string;
  strategy: string;
  replicas: {
    desired: number;
    current: number;
    ready: number;
  };
}

interface KubernetesNode {
  name: string;
  status: 'Ready' | 'NotReady' | 'Unknown';
  roles: string[];
  age: string;
  version: string;
  internalIP: string;
  externalIP: string;
  os: string;
  kernel: string;
  runtime: string;
  resources: {
    cpu: { capacity: string; allocatable: string; used: number };
    memory: { capacity: string; allocatable: string; used: number };
    pods: { capacity: number; allocatable: number; used: number };
  };
}

interface KubernetesNamespace {
  name: string;
  status: 'Active' | 'Terminating';
  age: string;
  labels: Record<string, string>;
  resourceQuota?: {
    cpu: { hard: string; used: string };
    memory: { hard: string; used: string };
    pods: { hard: number; used: number };
  };
}

export default function Kubernetes() {
  const [activeTab, setActiveTab] = useState('overview');
  const [pods, setPods] = useState<KubernetesPod[]>([]);
  const [services, setServices] = useState<KubernetesService[]>([]);
  const [deployments, setDeployments] = useState<KubernetesDeployment[]>([]);
  const [nodes, setNodes] = useState<KubernetesNode[]>([]);
  const [namespaces, setNamespaces] = useState<KubernetesNamespace[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNamespace, setSelectedNamespace] = useState('default');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'pods', label: 'Pods' },
    { id: 'services', label: 'Services' },
    { id: 'deployments', label: 'Deployments' },
    { id: 'nodes', label: 'Nodes' },
    { id: 'namespaces', label: 'Namespaces' },
    { id: 'yaml', label: 'YAML Editor' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchPods();
    fetchServices();
    fetchDeployments();
    fetchNodes();
    fetchNamespaces();
    fetchMetrics();
  }, [selectedNamespace]);

  const fetchPods = async () => {
    const mockPods: KubernetesPod[] = [
      {
        name: 'frontend-deployment-7d4b8c9f8d-abc12',
        namespace: 'default',
        status: 'Running',
        ready: '1/1',
        restarts: 0,
        age: '2d',
        node: 'worker-node-1',
        ip: '10.244.1.15',
        containers: [
          {
            name: 'frontend',
            image: 'nginx:1.21',
            ready: true,
            restartCount: 0
          }
        ]
      },
      {
        name: 'backend-api-6b5d7c8f9a-def34',
        namespace: 'api',
        status: 'Running',
        ready: '1/1',
        restarts: 1,
        age: '1d',
        node: 'worker-node-2',
        ip: '10.244.2.23',
        containers: [
          {
            name: 'api',
            image: 'node:16-alpine',
            ready: true,
            restartCount: 1
          }
        ]
      },
      {
        name: 'database-statefulset-0',
        namespace: 'database',
        status: 'Running',
        ready: '1/1',
        restarts: 0,
        age: '5d',
        node: 'worker-node-3',
        ip: '10.244.3.45',
        containers: [
          {
            name: 'postgres',
            image: 'postgres:14',
            ready: true,
            restartCount: 0
          }
        ]
      },
      {
        name: 'monitoring-prometheus-0',
        namespace: 'monitoring',
        status: 'Pending',
        ready: '0/1',
        restarts: 0,
        age: '5m',
        node: 'worker-node-1',
        ip: '',
        containers: [
          {
            name: 'prometheus',
            image: 'prom/prometheus:latest',
            ready: false,
            restartCount: 0
          }
        ]
      }
    ];
    setPods(mockPods);
  };

  const fetchServices = async () => {
    const mockServices: KubernetesService[] = [
      {
        name: 'frontend-service',
        namespace: 'default',
        type: 'LoadBalancer',
        clusterIP: '10.96.1.100',
        externalIP: '203.0.113.10',
        ports: '80:30080/TCP',
        age: '2d',
        selector: { app: 'frontend' }
      },
      {
        name: 'backend-api-service',
        namespace: 'api',
        type: 'ClusterIP',
        clusterIP: '10.96.2.200',
        externalIP: '<none>',
        ports: '8080/TCP',
        age: '1d',
        selector: { app: 'backend-api' }
      },
      {
        name: 'database-service',
        namespace: 'database',
        type: 'ClusterIP',
        clusterIP: '10.96.3.150',
        externalIP: '<none>',
        ports: '5432/TCP',
        age: '5d',
        selector: { app: 'postgres' }
      },
      {
        name: 'kubernetes',
        namespace: 'default',
        type: 'ClusterIP',
        clusterIP: '10.96.0.1',
        externalIP: '<none>',
        ports: '443/TCP',
        age: '10d',
        selector: {}
      }
    ];
    setServices(mockServices);
  };

  const fetchDeployments = async () => {
    const mockDeployments: KubernetesDeployment[] = [
      {
        name: 'frontend-deployment',
        namespace: 'default',
        ready: '3/3',
        upToDate: 3,
        available: 3,
        age: '2d',
        strategy: 'RollingUpdate',
        replicas: { desired: 3, current: 3, ready: 3 }
      },
      {
        name: 'backend-api',
        namespace: 'api',
        ready: '2/2',
        upToDate: 2,
        available: 2,
        age: '1d',
        strategy: 'RollingUpdate',
        replicas: { desired: 2, current: 2, ready: 2 }
      },
      {
        name: 'monitoring-grafana',
        namespace: 'monitoring',
        ready: '1/1',
        upToDate: 1,
        available: 1,
        age: '3d',
        strategy: 'Recreate',
        replicas: { desired: 1, current: 1, ready: 1 }
      }
    ];
    setDeployments(mockDeployments);
  };

  const fetchNodes = async () => {
    const mockNodes: KubernetesNode[] = [
      {
        name: 'master-node',
        status: 'Ready',
        roles: ['control-plane', 'master'],
        age: '10d',
        version: 'v1.28.2',
        internalIP: '192.168.1.10',
        externalIP: '203.0.113.10',
        os: 'Ubuntu 22.04.3 LTS',
        kernel: '5.15.0-88-generic',
        runtime: 'containerd://1.7.2',
        resources: {
          cpu: { capacity: '4', allocatable: '3900m', used: 45 },
          memory: { capacity: '8Gi', allocatable: '7.5Gi', used: 62 },
          pods: { capacity: 110, allocatable: 110, used: 15 }
        }
      },
      {
        name: 'worker-node-1',
        status: 'Ready',
        roles: ['worker'],
        age: '10d',
        version: 'v1.28.2',
        internalIP: '192.168.1.11',
        externalIP: '<none>',
        os: 'Ubuntu 22.04.3 LTS',
        kernel: '5.15.0-88-generic',
        runtime: 'containerd://1.7.2',
        resources: {
          cpu: { capacity: '2', allocatable: '1900m', used: 78 },
          memory: { capacity: '4Gi', allocatable: '3.5Gi', used: 85 },
          pods: { capacity: 110, allocatable: 110, used: 25 }
        }
      },
      {
        name: 'worker-node-2',
        status: 'Ready',
        roles: ['worker'],
        age: '10d',
        version: 'v1.28.2',
        internalIP: '192.168.1.12',
        externalIP: '<none>',
        os: 'Ubuntu 22.04.3 LTS',
        kernel: '5.15.0-88-generic',
        runtime: 'containerd://1.7.2',
        resources: {
          cpu: { capacity: '2', allocatable: '1900m', used: 34 },
          memory: { capacity: '4Gi', allocatable: '3.5Gi', used: 56 },
          pods: { capacity: 110, allocatable: 110, used: 18 }
        }
      }
    ];
    setNodes(mockNodes);
  };

  const fetchNamespaces = async () => {
    const mockNamespaces: KubernetesNamespace[] = [
      {
        name: 'default',
        status: 'Active',
        age: '10d',
        labels: {}
      },
      {
        name: 'kube-system',
        status: 'Active',
        age: '10d',
        labels: { 'kubernetes.io/metadata.name': 'kube-system' }
      },
      {
        name: 'api',
        status: 'Active',
        age: '5d',
        labels: { environment: 'production', team: 'backend' },
        resourceQuota: {
          cpu: { hard: '2', used: '1.5' },
          memory: { hard: '4Gi', used: '2.8Gi' },
          pods: { hard: 10, used: 6 }
        }
      },
      {
        name: 'monitoring',
        status: 'Active',
        age: '3d',
        labels: { environment: 'production', team: 'platform' }
      },
      {
        name: 'database',
        status: 'Active',
        age: '5d',
        labels: { environment: 'production', team: 'data' }
      }
    ];
    setNamespaces(mockNamespaces);
  };

  const fetchMetrics = async () => {
    const now = Date.now();
    const mockMetrics = Array.from({ length: 60 }, (_, i) => ({
      timestamp: now - (59 - i) * 60000,
      cpu: Math.random() * 80 + 10 + Math.sin(i / 10) * 20,
      memory: Math.random() * 70 + 20 + Math.cos(i / 8) * 15,
      pods: Math.random() * 50 + 30,
      network: Math.random() * 100 + 50
    }));
    setMetrics(mockMetrics);
  };

  const scaleDeployment = async (deploymentName: string, replicas: number) => {
    setLoading(true);
    try {
      // Simulate scaling operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDeployments(prev => prev.map(dep => 
        dep.name === deploymentName 
          ? { 
              ...dep, 
              replicas: { ...dep.replicas, desired: replicas },
              ready: `${replicas}/${replicas}`
            }
          : dep
      ));
    } catch (error) {
      console.error('Error scaling deployment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    const totalPods = pods.length;
    const runningPods = pods.filter(p => p.status === 'Running').length;
    const totalNodes = nodes.length;
    const readyNodes = nodes.filter(n => n.status === 'Ready').length;

    return (
      <div className="space-y-6">
        {/* Cluster Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Cluster Status</p>
                <p className="text-white text-2xl font-bold">Healthy</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Nodes</p>
                <p className="text-white text-2xl font-bold">{readyNodes}/{totalNodes}</p>
              </div>
              <Server className="w-8 h-8 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Pods</p>
                <p className="text-white text-2xl font-bold">{runningPods}/{totalPods}</p>
              </div>
              <Boxes className="w-8 h-8 text-purple-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Namespaces</p>
                <p className="text-white text-2xl font-bold">{namespaces.length}</p>
              </div>
              <Network className="w-8 h-8 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Resource Usage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nodes.map(node => (
            <Card key={node.name} title={node.name}>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">CPU</span>
                    <span className="text-sm">{node.resources.cpu.used}%</span>
                  </div>
                  <ProgressBar value={node.resources.cpu.used} color="blue" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Memory</span>
                    <span className="text-sm">{node.resources.memory.used}%</span>
                  </div>
                  <ProgressBar value={node.resources.memory.used} color="green" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Pods</span>
                    <span className="text-sm">{node.resources.pods.used}/{node.resources.pods.capacity}</span>
                  </div>
                  <ProgressBar 
                    value={(node.resources.pods.used / node.resources.pods.capacity) * 100} 
                    color="purple" 
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Metrics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Cluster CPU Usage">
            <MetricsChart
              data={metrics}
              dataKey="cpu"
              name="CPU %"
              color="#3B82F6"
            />
          </Card>

          <Card title="Cluster Memory Usage">
            <MetricsChart
              data={metrics}
              dataKey="memory"
              name="Memory %"
              color="#10B981"
            />
          </Card>
        </div>
      </div>
    );
  };

  const renderPods = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pods</h2>
        <div className="flex space-x-3">
          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            className="bg-gray-700 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Namespaces</option>
            {namespaces.map(ns => (
              <option key={ns.name} value={ns.name}>{ns.name}</option>
            ))}
          </select>
          <Button onClick={fetchPods} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
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
                  Namespace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ready
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Restarts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Node
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pods
                .filter(pod => selectedNamespace === 'all' || pod.namespace === selectedNamespace)
                .map(pod => (
                <tr key={pod.name} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                    {pod.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.namespace}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={pod.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.ready}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.restarts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.node}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Terminal className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Trash2 className="w-4 h-4" />
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

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Services</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Service
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
                  Namespace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cluster IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  External IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ports
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {services.map(service => (
                <tr key={`${service.namespace}-${service.name}`} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {service.namespace}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {service.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {service.clusterIP}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {service.externalIP}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {service.ports}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {service.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderDeployments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Deployments</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Deployment
        </Button>
      </div>

      <div className="grid gap-4">
        {deployments.map(deployment => (
          <Card key={`${deployment.namespace}-${deployment.name}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Boxes className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{deployment.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Namespace: {deployment.namespace}</span>
                    <span>Strategy: {deployment.strategy}</span>
                    <span>Age: {deployment.age}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Ready: {deployment.ready}</span>
                    <span>Up-to-date: {deployment.upToDate}</span>
                    <span>Available: {deployment.available}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Replicas</p>
                  <p className="text-lg font-bold">
                    {deployment.replicas.ready}/{deployment.replicas.desired}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => scaleDeployment(deployment.name, deployment.replicas.desired + 1)}
                    loading={loading}
                  >
                    Scale Up
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
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

  const renderNodes = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Cluster Nodes</h2>
      
      <div className="grid gap-4">
        {nodes.map(node => (
          <Card key={node.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  node.status === 'Ready' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{node.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Roles: {node.roles.join(', ')}</span>
                    <span>Version: {node.version}</span>
                    <span>Age: {node.age}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Internal IP: {node.internalIP}</span>
                    <span>OS: {node.os}</span>
                    <span>Runtime: {node.runtime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">CPU:</span>
                    <span className="text-sm">{node.resources.cpu.used}%</span>
                  </div>
                  <ProgressBar value={node.resources.cpu.used} color="blue" size="sm" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Memory:</span>
                    <span className="text-sm">{node.resources.memory.used}%</span>
                  </div>
                  <ProgressBar value={node.resources.memory.used} color="green" size="sm" />
                </div>
                <StatusBadge status={node.status} />
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

  const renderNamespaces = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Namespaces</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Namespace
        </Button>
      </div>

      <div className="grid gap-4">
        {namespaces.map(namespace => (
          <Card key={namespace.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{namespace.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Age: {namespace.age}</span>
                    <span>Labels: {Object.keys(namespace.labels).length}</span>
                  </div>
                  {namespace.resourceQuota && (
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span>CPU: {namespace.resourceQuota.cpu.used}/{namespace.resourceQuota.cpu.hard}</span>
                      <span>Memory: {namespace.resourceQuota.memory.used}/{namespace.resourceQuota.memory.hard}</span>
                      <span>Pods: {namespace.resourceQuota.pods.used}/{namespace.resourceQuota.pods.hard}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={namespace.status} />
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

  const renderYAMLEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">YAML Editor</h2>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Apply
          </Button>
        </div>
      </div>

      <Card>
        <div className="h-96 bg-black rounded-lg p-4 font-mono text-sm text-green-400 overflow-y-auto">
          <pre>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: default
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer`}</pre>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Kubernetes Settings</h2>
      
      <Card title="Cluster Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Kubeconfig Path</label>
            <input
              type="text"
              defaultValue="~/.kube/config"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current Context</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="default">default</option>
              <option value="staging">staging</option>
              <option value="production">production</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Namespace</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              {namespaces.map(ns => (
                <option key={ns.name} value={ns.name}>{ns.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card title="Display Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Refresh Interval (seconds)</label>
            <input
              type="number"
              defaultValue="30"
              min="5"
              max="300"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Show system namespaces</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Auto-refresh enabled</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Show resource usage</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'pods': return renderPods();
      case 'services': return renderServices();
      case 'deployments': return renderDeployments();
      case 'nodes': return renderNodes();
      case 'namespaces': return renderNamespaces();
      case 'yaml': return renderYAMLEditor();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Boxes className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold">Kubernetes</h1>
            <p className="text-gray-400">Container orchestration and management</p>
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