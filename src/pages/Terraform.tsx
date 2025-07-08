import React, { useState, useEffect } from 'react';
import { 
  Layers, 
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
  Code
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Editor from '@monaco-editor/react';

interface TerraformWorkspace {
  id: string;
  name: string;
  path: string;
  status: 'clean' | 'dirty' | 'planning' | 'applying' | 'error';
  lastApplied: string;
  resources: number;
  provider: 'aws' | 'azure' | 'gcp' | 'local';
}

interface TerraformResource {
  address: string;
  type: string;
  name: string;
  provider: string;
  status: 'created' | 'modified' | 'destroyed' | 'unchanged';
  attributes: Record<string, any>;
}

interface TerraformPlan {
  id: string;
  workspace: string;
  summary: {
    add: number;
    change: number;
    destroy: number;
  };
  resources: TerraformResource[];
  createdAt: string;
  status: 'pending' | 'applied' | 'failed';
}

export default function Terraform() {
  const [activeTab, setActiveTab] = useState('workspaces');
  const [workspaces, setWorkspaces] = useState<TerraformWorkspace[]>([]);
  const [plans, setPlans] = useState<TerraformPlan[]>([]);
  const [resources, setResources] = useState<TerraformResource[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [terraformCode, setTerraformCode] = useState('');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'workspaces', label: 'Workspaces' },
    { id: 'plans', label: 'Plans' },
    { id: 'resources', label: 'Resources' },
    { id: 'code', label: 'Code Editor' },
    { id: 'state', label: 'State' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    fetchWorkspaces();
    fetchPlans();
    fetchResources();
    loadTerraformCode();
  }, []);

  const fetchWorkspaces = async () => {
    const mockWorkspaces: TerraformWorkspace[] = [
      {
        id: '1',
        name: 'production',
        path: '/terraform/environments/prod',
        status: 'clean',
        lastApplied: '2 hours ago',
        resources: 45,
        provider: 'aws'
      },
      {
        id: '2',
        name: 'staging',
        path: '/terraform/environments/staging',
        status: 'dirty',
        lastApplied: '1 day ago',
        resources: 23,
        provider: 'aws'
      },
      {
        id: '3',
        name: 'development',
        path: '/terraform/environments/dev',
        status: 'planning',
        lastApplied: '3 days ago',
        resources: 12,
        provider: 'gcp'
      }
    ];
    setWorkspaces(mockWorkspaces);
  };

  const fetchPlans = async () => {
    const mockPlans: TerraformPlan[] = [
      {
        id: '1',
        workspace: 'production',
        summary: { add: 2, change: 1, destroy: 0 },
        resources: [],
        createdAt: '2024-01-15 10:30:00',
        status: 'pending'
      },
      {
        id: '2',
        workspace: 'staging',
        summary: { add: 5, change: 3, destroy: 1 },
        resources: [],
        createdAt: '2024-01-14 15:45:00',
        status: 'applied'
      }
    ];
    setPlans(mockPlans);
  };

  const fetchResources = async () => {
    const mockResources: TerraformResource[] = [
      {
        address: 'aws_instance.web_server',
        type: 'aws_instance',
        name: 'web_server',
        provider: 'aws',
        status: 'created',
        attributes: {
          instance_type: 't3.micro',
          ami: 'ami-0c02fb55956c7d316',
          availability_zone: 'us-east-1a'
        }
      },
      {
        address: 'aws_security_group.web_sg',
        type: 'aws_security_group',
        name: 'web_sg',
        provider: 'aws',
        status: 'unchanged',
        attributes: {
          name: 'web-security-group',
          description: 'Security group for web servers'
        }
      },
      {
        address: 'aws_s3_bucket.assets',
        type: 'aws_s3_bucket',
        name: 'assets',
        provider: 'aws',
        status: 'modified',
        attributes: {
          bucket: 'my-app-assets-bucket',
          versioning: true
        }
      }
    ];
    setResources(mockResources);
  };

  const loadTerraformCode = () => {
    const defaultCode = `# Terraform Configuration
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "\${var.environment}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "\${var.environment}-igw"
    Environment = var.environment
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "\${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "\${var.environment}-public-subnet"
    Environment = var.environment
  }
}

# Security Group
resource "aws_security_group" "web" {
  name_prefix = "\${var.environment}-web-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "\${var.environment}-web-sg"
    Environment = var.environment
  }
}

# EC2 Instance
resource "aws_instance" "web" {
  ami                    = "ami-0c02fb55956c7d316"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y httpd
    systemctl start httpd
    systemctl enable httpd
    echo "<h1>Hello from Terraform!</h1>" > /var/www/html/index.html
  EOF

  tags = {
    Name        = "\${var.environment}-web-server"
    Environment = var.environment
  }
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "instance_public_ip" {
  description = "Public IP of the web server"
  value       = aws_instance.web.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the web server"
  value       = aws_instance.web.public_dns
}`;
    setTerraformCode(defaultCode);
  };

  const runTerraformPlan = async (workspaceId: string) => {
    setLoading(true);
    try {
      // Simulate terraform plan
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setWorkspaces(prev => prev.map(ws => 
        ws.id === workspaceId 
          ? { ...ws, status: 'planning' }
          : ws
      ));
      
      // Simulate plan completion
      setTimeout(() => {
        setWorkspaces(prev => prev.map(ws => 
          ws.id === workspaceId 
            ? { ...ws, status: 'dirty' }
            : ws
        ));
      }, 2000);
    } catch (error) {
      console.error('Error running terraform plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const runTerraformApply = async (workspaceId: string) => {
    setLoading(true);
    try {
      // Simulate terraform apply
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      setWorkspaces(prev => prev.map(ws => 
        ws.id === workspaceId 
          ? { ...ws, status: 'applying' }
          : ws
      ));
      
      // Simulate apply completion
      setTimeout(() => {
        setWorkspaces(prev => prev.map(ws => 
          ws.id === workspaceId 
            ? { ...ws, status: 'clean', lastApplied: 'Just now' }
            : ws
        ));
      }, 3000);
    } catch (error) {
      console.error('Error running terraform apply:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWorkspaces = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Terraform Workspaces</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workspace
        </Button>
      </div>

      <div className="grid gap-4">
        {workspaces.map(workspace => (
          <Card key={workspace.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  workspace.provider === 'aws' ? 'bg-orange-600' :
                  workspace.provider === 'azure' ? 'bg-blue-600' :
                  workspace.provider === 'gcp' ? 'bg-red-600' : 'bg-gray-600'
                }`}>
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{workspace.name}</h3>
                  <p className="text-gray-400">{workspace.path}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="capitalize">{workspace.provider}</span>
                    <span>{workspace.resources} resources</span>
                    <span>Last applied: {workspace.lastApplied}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={workspace.status} />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => runTerraformPlan(workspace.id)}
                    loading={loading && workspace.status === 'planning'}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Plan
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => runTerraformApply(workspace.id)}
                    loading={loading && workspace.status === 'applying'}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Apply
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

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Terraform Plans</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <div className="grid gap-4">
        {plans.map(plan => (
          <Card key={plan.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  plan.status === 'applied' ? 'bg-green-600' :
                  plan.status === 'failed' ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Plan for {plan.workspace}</h3>
                  <p className="text-gray-400">Created: {plan.createdAt}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="text-green-400">+{plan.summary.add} to add</span>
                    <span className="text-yellow-400">~{plan.summary.change} to change</span>
                    <span className="text-red-400">-{plan.summary.destroy} to destroy</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={plan.status} />
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

  const renderResources = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Terraform Resources</h2>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {resources.map((resource, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                    {resource.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {resource.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {resource.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={resource.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Edit className="w-4 h-4" />
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

  const renderCodeEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Terraform Code Editor</h2>
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
            defaultLanguage="hcl"
            value={terraformCode}
            onChange={(value) => setTerraformCode(value || '')}
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
          Plan
        </Button>
      </div>
    </div>
  );

  const renderState = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Terraform State</h2>
      
      <Card>
        <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto">
          <div className="space-y-1">
            <div>{`{`}</div>
            <div className="ml-2">"version": 4,</div>
            <div className="ml-2">"terraform_version": "1.6.0",</div>
            <div className="ml-2">"serial": 1,</div>
            <div className="ml-2">"lineage": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",</div>
            <div className="ml-2">"outputs": {`{`}</div>
            <div className="ml-4">"vpc_id": {`{`}</div>
            <div className="ml-6">"value": "vpc-0123456789abcdef0",</div>
            <div className="ml-6">"type": "string"</div>
            <div className="ml-4">{`}`},</div>
            <div className="ml-4">"instance_public_ip": {`{`}</div>
            <div className="ml-6">"value": "54.123.45.67",</div>
            <div className="ml-6">"type": "string"</div>
            <div className="ml-4">{`}`}</div>
            <div className="ml-2">{`}`},</div>
            <div className="ml-2">"resources": [</div>
            <div className="ml-4">{`{`}</div>
            <div className="ml-6">"mode": "managed",</div>
            <div className="ml-6">"type": "aws_instance",</div>
            <div className="ml-6">"name": "web",</div>
            <div className="ml-6">"provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",</div>
            <div className="ml-6">"instances": [</div>
            <div className="ml-8">{`{`}</div>
            <div className="ml-10">"schema_version": 1,</div>
            <div className="ml-10">"attributes": {`{`}</div>
            <div className="ml-12">"id": "i-0123456789abcdef0",</div>
            <div className="ml-12">"instance_type": "t3.micro",</div>
            <div className="ml-12">"public_ip": "54.123.45.67",</div>
            <div className="ml-12">"private_ip": "10.0.1.100"</div>
            <div className="ml-10">{`}`}</div>
            <div className="ml-8">{`}`}</div>
            <div className="ml-6">]</div>
            <div className="ml-4">{`}`}</div>
            <div className="ml-2">]</div>
            <div>{`}`}</div>
          </div>
        </div>
      </Card>

      <div className="flex space-x-3">
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Download State
        </Button>
        <Button variant="secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh State
        </Button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Terraform Settings</h2>
      
      <Card title="Provider Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Default Provider</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="aws">Amazon Web Services</option>
              <option value="azure">Microsoft Azure</option>
              <option value="gcp">Google Cloud Platform</option>
              <option value="local">Local Provider</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Terraform Version</label>
            <input
              type="text"
              defaultValue="1.6.0"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">State Backend</label>
            <select className="w-full bg-gray-700 rounded-md px-3 py-2">
              <option value="local">Local</option>
              <option value="s3">AWS S3</option>
              <option value="azurerm">Azure Storage</option>
              <option value="gcs">Google Cloud Storage</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Execution Settings">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Auto-approve plans</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Parallel resource operations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Detailed logging</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parallelism</label>
            <input
              type="number"
              defaultValue="10"
              min="1"
              max="50"
              className="w-full bg-gray-700 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'workspaces': return renderWorkspaces();
      case 'plans': return renderPlans();
      case 'resources': return renderResources();
      case 'code': return renderCodeEditor();
      case 'state': return renderState();
      case 'settings': return renderSettings();
      default: return renderWorkspaces();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <Layers className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold">Terraform</h1>
            <p className="text-gray-400">Infrastructure as Code management</p>
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