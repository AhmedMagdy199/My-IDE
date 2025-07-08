import { 
  LayoutDashboard, 
  Cloud, 
  GitBranch, 
  Terminal,
  Settings,
  Monitor,
  Database,
  Shield,
  Layers,
  Activity,
  Cog,
  GitMerge,
  Boxes,
  Container,
  Workflow,
  Hammer,
  Lock,
  Network,
  FileText,
  Zap,
  Server,
  HardDrive
} from 'lucide-react';

export const navigationItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/',
    badge: null
  },
  { 
    icon: Cloud, 
    label: 'Cloud', 
    path: '/cloud',
    badge: { count: 2, variant: 'blue' }
  },
  { 
    icon: GitBranch, 
    label: 'Git', 
    path: '/git',
    badge: null
  },
  { 
    icon: Terminal, 
    label: 'Terminal', 
    path: '/terminal',
    badge: null
  },
  { 
    icon: Boxes, 
    label: 'Kubernetes', 
    path: '/kubernetes',
    badge: { count: 3, variant: 'blue' }
  },
  { 
    icon: Layers, 
    label: 'Terraform', 
    path: '/terraform',
    badge: null
  },
  { 
    icon: Container, 
    label: 'Docker', 
    path: '/docker',
    badge: { count: 5, variant: 'blue' }
  },
  { 
    icon: Workflow, 
    label: 'GitHub Actions', 
    path: '/github-actions',
    badge: { count: 2, variant: 'green' }
  },
  { 
    icon: Hammer, 
    label: 'Jenkins', 
    path: '/jenkins',
    badge: { count: 1, variant: 'yellow' }
  },
  { 
    icon: Lock, 
    label: 'Vault', 
    path: '/vault',
    badge: null
  },
  { 
    icon: Network, 
    label: 'Consul', 
    path: '/consul',
    badge: { count: 3, variant: 'purple' }
  },
  { 
    icon: Monitor, 
    label: 'Prometheus', 
    path: '/prometheus',
    badge: { count: 1, variant: 'yellow' }
  },
  { 
    icon: Cog, 
    label: 'Ansible', 
    path: '/ansible',
    badge: null
  },
  { 
    icon: GitMerge, 
    label: 'ArgoCD', 
    path: '/argocd',
    badge: { count: 2, variant: 'green' }
  },
  { 
    icon: Zap, 
    label: 'Grafana', 
    path: '/grafana',
    badge: null
  },
  { 
    icon: FileText, 
    label: 'ELK Stack', 
    path: '/elk',
    badge: { count: 1, variant: 'orange' }
  },
  { 
    icon: Activity, 
    label: 'Monitoring', 
    path: '/monitoring',
    badge: { count: 1, variant: 'yellow' }
  },
  { 
    icon: Database, 
    label: 'Database', 
    path: '/database',
    badge: null
  },
  { 
    icon: Shield, 
    label: 'Security', 
    path: '/security',
    badge: { count: 3, variant: 'red' }
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    path: '/settings',
    badge: null
  },
];