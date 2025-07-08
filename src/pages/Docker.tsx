import React, { useState, useEffect } from 'react';
import { 
  Container, 
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
  Database,
  Image,
  Layers,
  HardDrive
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'paused' | 'restarting' | 'dead';
  ports: string[];
  created: string;
  uptime: string;
  cpu: number;
  memory: number;
  network: string;
}

interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  size: string;
  created: string;
  inUse: boolean;
}

interface DockerVolume {
  name: string;
  driver: string;
  mountpoint: string;
  size: string;
  created: string;
  inUse: boolean;
}

interface DockerNetwork {
  id: string;
  name: string;
  driver: string;
  scope: string;
  containers: number;
  created: string;
}

export default function Docker() {
  const [activeTab, setActiveTab] = useState('containers');
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [images, setImages] = useState<DockerImage[]>([]);
  const [volumes, setVolumes] = useState<DockerVolume[]>([]);
  const [networks, setNetworks] = useState<DockerNetwork[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'containers', label: 'Containers' },
    { id: 'images', label: 'Images' },
    { id: 'volumes', label: 'Volumes' },
    { id: 'networks', label: 'Networks' },
    { id: 'compose', label: 'Docker Compose' },
    { id: 'registry', label: 'Registry' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchContainers();
    fetchImages();
    fetchVolumes();
    fetchNetworks();
  }, []);

  const fetchContainers = async () => {
    const mockContainers: DockerContainer[] = [
      {
        id: 'abc123def456',
        name: 'nginx-web',
        image: 'nginx:latest',
        status: 'running',
        ports: ['80:8080', '443:8443'],
        created: '2 days ago',
        uptime: '2 days',
        cpu: 2.5,
        memory: 45.2,
        network: 'bridge'
      },
      {
        id: 'def456ghi789',
        name: 'redis-cache',
        image: 'redis:alpine',
        status: 'running',
        ports: ['6379:6379'],
        created: '1 week ago',
        uptime: '1 week',
        cpu: 0.8,
        memory: 12.3,
        network: 'bridge'
      },
      {
        id: 'ghi789jkl012',
        name: 'postgres-db',
        image: 'postgres:14',
        status: 'stopped',
        ports: ['5432:5432'],
        created: '3 days ago',
        uptime: '0',
        cpu: 0,
        memory: 0,
        network: 'bridge'
      }
    ];
    setContainers(mockContainers);
  };

  const fetchImages = async () => {
    const mockImages: DockerImage[] = [
      {
        id: 'sha256:abc123',
        repository: 'nginx',
        tag: 'latest',
        size: '142MB',
        created: '2 weeks ago',
        inUse: true
      },
      {
        id: 'sha256:def456',
        repository: 'redis',
        tag: 'alpine',
        size: '32MB',
        created: '1 month ago',
        inUse: true
      },
      {
        id: 'sha256:ghi789',
        repository: 'postgres',
        tag: '14',
        size: '374MB',
        created: '3 weeks ago',
        inUse: false
      },
      {
        id: 'sha256:jkl012',
        repository: 'node',
        tag: '18-alpine',
        size: '165MB',
        created: '1 week ago',
        inUse: false
      }
    ];
    setImages(mockImages);
  };

  const fetchVolumes = async () => {
    const mockVolumes: DockerVolume[] = [
      {
        name: 'postgres_data',
        driver: 'local',
        mountpoint: '/var/lib/docker/volumes/postgres_data/_data',
        size: '2.3GB',
        created: '3 days ago',
        inUse: true
      },
      {
        name: 'redis_data',
        driver: 'local',
        mountpoint: '/var/lib/docker/volumes/redis_data/_data',
        size: '45MB',
        created: '1 week ago',
        inUse: true
      },
      {
        name: 'nginx_logs',
        driver: 'local',
        mountpoint: '/var/lib/docker/volumes/nginx_logs/_data',
        size: '123MB',
        created: '2 days ago',
        inUse: false
      }
    ];
    setVolumes(mockVolumes);
  };

  const fetchNetworks = async () => {
    const mockNetworks: DockerNetwork[] = [
      {
        id: 'bridge123',
        name: 'bridge',
        driver: 'bridge',
        scope: 'local',
        containers: 2,
        created: '1 month ago'
      },
      {
        id: 'host456',
        name: 'host',
        driver: 'host',
        scope: 'local',
        containers: 0,
        created: '1 month ago'
      },
      {
        id: 'custom789',
        name: 'app-network',
        driver: 'bridge',
        scope: 'local',
        containers: 3,
        created: '1 week ago'
      }
    ];
    setNetworks(mockNetworks);
  };

  const handleContainerAction = async (containerId: string, action: 'start' | 'stop' | 'restart' | 'remove') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setContainers(prev => prev.map(container => 
        container.id === containerId 
          ? { 
              ...container, 
              status: action === 'start' ? 'running' : action === 'stop' ? 'stopped' : container.status
            }
          : container
      ));
    } catch (error) {
      console.error(`Error ${action}ing container:`, error);
    } finally {
      setLoading(false);
    }
  };

  const renderContainers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Docker Containers</h2>
        <div className="flex space-x-3">
          <Button onClick={fetchContainers} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Run Container
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {containers.map(container => (
          <Card key={container.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  container.status === 'running' ? 'bg-green-600' :
                  container.status === 'stopped' ? 'bg-gray-600' :
                  container.status === 'paused' ? 'bg-yellow-600' : 'bg-red-600'
                }`}>
                  <Container className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{container.name}</h3>
                  <p className="text-gray-400">{container.image}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>ID: {container.id.substring(0, 12)}</span>
                    <span>Created: {container.created}</span>
                    <span>Uptime: {container.uptime}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm">
                    <span>CPU: {container.cpu}%</span>
                    <span>Memory: {container.memory}%</span>
                    <span>Ports: {container.ports.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={container.status} />
                <div className="flex space-x-2">
                  {container.status === 'stopped' ? (
                    <Button
                      size="sm"
                      onClick={() => handleContainerAction(container.id, 'start')}
                      loading={loading}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleContainerAction(container.id, 'stop')}
                      loading={loading}
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="secondary">
                    <Terminal className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
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

  const renderImages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Docker Images</h2>
        <div className="flex space-x-3">
          <Button onClick={fetchImages} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Pull Image
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {images.map(image => (
          <Card key={image.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  image.inUse ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  <Image className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{image.repository}:{image.tag}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>ID: {image.id.substring(7, 19)}</span>
                    <span>Size: {image.size}</span>
                    <span>Created: {image.created}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={image.inUse ? 'in-use' : 'unused'} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
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

  const renderVolumes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Docker Volumes</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Volume
        </Button>
      </div>

      <div className="grid gap-4">
        {volumes.map(volume => (
          <Card key={volume.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  volume.inUse ? 'bg-purple-600' : 'bg-gray-600'
                }`}>
                  <HardDrive className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{volume.name}</h3>
                  <p className="text-gray-400">{volume.mountpoint}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Driver: {volume.driver}</span>
                    <span>Size: {volume.size}</span>
                    <span>Created: {volume.created}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={volume.inUse ? 'in-use' : 'unused'} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
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

  const renderNetworks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Docker Networks</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Network
        </Button>
      </div>

      <div className="grid gap-4">
        {networks.map(network => (
          <Card key={network.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{network.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>Driver: {network.driver}</span>
                    <span>Scope: {network.scope}</span>
                    <span>Containers: {network.containers}</span>
                    <span>Created: {network.created}</span>
                  </div>
                </div>
              </div>

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
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCompose = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Docker Compose</h2>
      
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">docker-compose.yml</h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                Up
              </Button>
            </div>
          </div>
          
          <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto">
            <pre>{`version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - api
    networks:
      - app-network

  api:
    image: node:18-alpine
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge`}</pre>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderRegistry = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Container Registry</h2>
      
      <Card title="Registry Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Registry URL</label>
            <input
              type="url"
              defaultValue="https://registry.hub.docker.com"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                className="w-full bg-gray-700 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-gray-700 rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Docker Settings</h2>
      
      <Card title="Docker Daemon">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Docker Engine Status</p>
              <p className="text-sm text-gray-400">Docker daemon is running</p>
            </div>
            <StatusBadge status="running" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Version:</span>
              <span className="ml-2">24.0.7</span>
            </div>
            <div>
              <span className="text-gray-400">API Version:</span>
              <span className="ml-2">1.43</span>
            </div>
            <div>
              <span className="text-gray-400">Go Version:</span>
              <span className="ml-2">go1.20.10</span>
            </div>
            <div>
              <span className="text-gray-400">OS/Arch:</span>
              <span className="ml-2">linux/amd64</span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Resource Limits">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Memory Limit</label>
            <input
              type="text"
              defaultValue="2GB"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">CPU Limit</label>
            <input
              type="number"
              defaultValue="2"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Enable experimental features</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Enable BuildKit</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'containers': return renderContainers();
      case 'images': return renderImages();
      case 'volumes': return renderVolumes();
      case 'networks': return renderNetworks();
      case 'compose': return renderCompose();
      case 'registry': return renderRegistry();
      case 'settings': return renderSettings();
      default: return renderContainers();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Container className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold">Docker</h1>
            <p className="text-gray-400">Container management and orchestration</p>
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