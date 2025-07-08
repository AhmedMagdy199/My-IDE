# Getting Started Guide 🚀

Welcome to the DevOps IDE! This comprehensive guide will help you set up and start using your powerful DevOps development environment.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Service Configuration](#service-configuration)
4. [DevOps Tools Setup](#devops-tools-setup)
5. [First Steps](#first-steps)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (version 18 or newer) - [Download](https://nodejs.org/)
- **Go** (version 1.21 or newer) - [Download](https://golang.org/dl/)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/downloads)

### Optional DevOps Tools
- **kubectl** (for Kubernetes features) - [Install Guide](https://kubernetes.io/docs/tasks/tools/)
- **AWS CLI** (for AWS features) - [Install Guide](https://aws.amazon.com/cli/)
- **Terraform** (version 1.0 or newer) - [Download](https://www.terraform.io/downloads)
- **SonarQube Scanner** - [Download](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)
- **Trivy** - [Install Guide](https://aquasecurity.github.io/trivy/latest/getting-started/installation/)

## Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/your-username/devops-ide.git
cd devops-ide

# Install frontend dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### 2. Configure Environment
Edit the `.env` file with your actual values:

```bash
# Essential Configuration
API_PORT=8080
VITE_API_URL=http://localhost:8080

# DevOps Tools (Optional - configure as needed)
SONAR_URL=http://localhost:9000
SONAR_TOKEN=your-sonar-token
SONAR_PROJECT_KEY=devops-ide

JENKINS_URL=http://localhost:8080
JENKINS_USER=admin
JENKINS_TOKEN=your-jenkins-token

GITHUB_TOKEN=your-github-token
```

### 3. Start the Application
```bash
# Start the backend server
cd backend
go run main.go

# In a new terminal, start the frontend
npm run dev
```

The application will be available at: `http://localhost:5173` 🌟

## Service Configuration

### Docker Services (Recommended)
For a complete DevOps environment, start the Docker services:

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

This will start:
- **API Gateway** (port 8080)
- **Authentication Service** (port 8081)
- **File Service** (port 8082)
- **WebSocket Service** (port 8086)
- **Prometheus** (port 9090)
- **Grafana** (port 3000)
- **PostgreSQL** and **MongoDB** databases
- **Redis** cache

### Manual Service Setup
If you prefer to run services manually:

```bash
# Backend API
cd backend
go run main.go

# Frontend
npm run dev
```

## DevOps Tools Setup

### SonarQube Integration
1. **Install SonarQube Scanner**:
   ```bash
   # macOS
   brew install sonar-scanner
   
   # Linux
   wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip
   unzip sonar-scanner-cli-4.8.0.2856-linux.zip
   export PATH=$PATH:/path/to/sonar-scanner/bin
   ```

2. **Configure SonarQube**:
   ```bash
   # Set environment variables
   export SONAR_URL=http://your-sonarqube-server:9000
   export SONAR_TOKEN=your-sonar-token
   export SONAR_PROJECT_KEY=your-project-key
   ```

3. **Test Integration**:
   ```bash
   # Via API
   curl -X POST http://localhost:8080/api/devops/execute \
     -H "Content-Type: application/json" \
     -d '{"command": "sonar-scan", "args": ["/path/to/project"]}'
   ```

### Trivy Security Scanner
1. **Install Trivy**:
   ```bash
   # macOS
   brew install trivy
   
   # Linux
   sudo apt-get install wget apt-transport-https gnupg lsb-release
   wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
   echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
   sudo apt-get update
   sudo apt-get install trivy
   ```

2. **Test Trivy**:
   ```bash
   # Scan filesystem
   curl -X POST http://localhost:8080/api/devops/execute \
     -H "Content-Type: application/json" \
     -d '{"command": "trivy-fs", "args": ["/path/to/scan"]}'
   
   # Scan Docker image
   curl -X POST http://localhost:8080/api/devops/execute \
     -H "Content-Type: application/json" \
     -d '{"command": "trivy-image", "args": ["nginx:latest"]}'
   ```

### Jenkins Integration
1. **Configure Jenkins**:
   ```bash
   export JENKINS_URL=http://your-jenkins-server:8080
   export JENKINS_USER=your-username
   export JENKINS_TOKEN=your-api-token
   ```

2. **Test Jenkins**:
   ```bash
   # List jobs
   curl -X POST http://localhost:8080/api/devops/execute \
     -H "Content-Type: application/json" \
     -d '{"command": "jenkins-jobs", "args": []}'
   
   # Trigger job
   curl -X POST http://localhost:8080/api/devops/execute \
     -H "Content-Type: application/json" \
     -d '{"command": "jenkins-trigger", "args": ["job-name"]}'
   ```

### GitHub Actions Integration
1. **Create GitHub Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` and `workflow` scopes
   - Set the token in your environment:
   ```bash
   export GITHUB_TOKEN=your-github-token
   ```

2. **Test GitHub Integration**:
   ```bash
   # List workflows
   curl -X POST http://localhost:8080/api/devops/execute \
     -H "Content-Type: application/json" \
     -d '{"command": "github-workflows", "args": ["owner", "repo"]}'
   ```

## First Steps

### 1. Explore the Dashboard
- Navigate to `http://localhost:5173`
- Check the **Dashboard** for system overview
- Review **Service Health** indicators

### 2. Test DevOps Tools
- Go to **Terminal** section
- Try these commands:
  ```bash
  # Check tool availability
  tool-status
  
  # Get help
  help
  
  # Run a security scan
  trivy-image nginx:latest
  ```

### 3. Configure Monitoring
- Access **Prometheus** at `http://localhost:9090`
- Access **Grafana** at `http://localhost:3000`
  - Username: `admin`
  - Password: `admin`

### 4. Set Up Cloud Integration
- Navigate to **Cloud** section
- Configure your cloud provider credentials
- Test connectivity

## Available Features

### 🔧 Core Features
- **Real-time Dashboard** - System metrics and health monitoring
- **Integrated Terminal** - Full terminal access with DevOps commands
- **Container Management** - Docker container lifecycle management
- **Cloud Integration** - AWS, Azure, GCP support

### 🛠️ DevOps Tools
- **Code Quality** - SonarQube integration for code analysis
- **Security Scanning** - Trivy for vulnerability detection
- **CI/CD** - Jenkins and GitHub Actions integration
- **Infrastructure** - Kubernetes and Terraform management
- **Monitoring** - Prometheus and Grafana integration

### 📊 Monitoring & Observability
- **System Metrics** - CPU, memory, disk, network monitoring
- **Application Metrics** - Custom application metrics
- **Log Aggregation** - Centralized logging
- **Alerting** - Configurable alerts and notifications

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check if ports are in use
lsof -i :5173  # Frontend
lsof -i :8080  # Backend

# Kill processes if needed
kill -9 <PID>
```

#### Docker Issues
```bash
# Restart Docker services
docker-compose down
docker-compose up -d

# Check service logs
docker-compose logs <service-name>

# Reset Docker environment
docker system prune -a
```

#### Tool Not Found Errors
```bash
# Check tool availability
which sonar-scanner
which trivy
which kubectl

# Install missing tools (see prerequisites)
```

#### Permission Issues
```bash
# Fix file permissions
chmod +x scripts/*
sudo chown -R $USER:$USER .

# Docker permission (Linux)
sudo usermod -aG docker $USER
newgrp docker
```

### Getting Help

#### Check Service Status
```bash
# API health check
curl http://localhost:8080/health

# Tool status
curl http://localhost:8080/api/devops/tools/status
```

#### View Logs
```bash
# Backend logs
cd backend && go run main.go

# Frontend logs
npm run dev

# Docker service logs
docker-compose logs -f
```

#### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=debug

# Run with verbose output
npm run dev -- --verbose
```

## Next Steps

1. **Customize Configuration** - Modify settings for your environment
2. **Add Team Members** - Set up user accounts and permissions
3. **Configure Integrations** - Connect your existing tools and services
4. **Set Up Monitoring** - Configure alerts and dashboards
5. **Explore Advanced Features** - Dive into automation and workflows

## Support

- **Documentation**: Check the `/docs` directory for detailed guides
- **API Reference**: Visit `http://localhost:8080/api/docs` when running
- **Community**: Join our community discussions
- **Issues**: Report bugs and feature requests on GitHub

---

**Happy DevOps-ing!** 🚀

For more detailed information, check out our [IDE Services Guide](./IDE_SERVICES_GUIDE.md) and explore the individual tool documentation in the `/docs` directory.