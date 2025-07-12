import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Cloud = lazy(() => import('@/pages/Cloud'));
const Docker = lazy(() => import('@/pages/Docker'));
const Git = lazy(() => import('@/pages/Git'));
const Terminal = lazy(() => import('@/pages/Terminal'));
const Kubernetes = lazy(() => import('@/pages/Kubernetes'));
const Terraform = lazy(() => import('@/pages/Terraform'));
const Prometheus = lazy(() => import('@/pages/Prometheus'));
const Ansible = lazy(() => import('@/pages/Ansible'));
const ArgoCD = lazy(() => import('@/pages/ArgoCD'));
const GitHubActions = lazy(() => import('@/pages/GitHubActions'));
const Jenkins = lazy(() => import('@/pages/Jenkins'));
const Vault = lazy(() => import('@/pages/Vault'));
const Monitoring = lazy(() => import('@/pages/Monitoring'));
const Database = lazy(() => import('@/pages/Database'));
const Security = lazy(() => import('@/pages/Security'));
const Settings = lazy(() => import('@/pages/Settings'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'cloud/*', element: <Cloud /> },
      { path: 'docker/*', element: <Docker /> },
      { path: 'git/*', element: <Git /> },
      { path: 'terminal/*', element: <Terminal /> },
      { path: 'kubernetes/*', element: <Kubernetes /> },
      { path: 'terraform/*', element: <Terraform /> },
      { path: 'prometheus/*', element: <Prometheus /> },
      { path: 'ansible/*', element: <Ansible /> },
      { path: 'argocd/*', element: <ArgoCD /> },
      { path: 'github-actions/*', element: <GitHubActions /> },
      { path: 'jenkins/*', element: <Jenkins /> },
      { path: 'vault/*', element: <Vault /> },
      { path: 'monitoring/*', element: <Monitoring /> },
      { path: 'database/*', element: <Database /> },
      { path: 'security/*', element: <Security /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);