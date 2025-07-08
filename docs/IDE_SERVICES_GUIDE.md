# IDE Services Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Service Endpoints](#service-endpoints)
3. [DevOps Tools Integration](#devops-tools-integration)
4. [Authentication & Security](#authentication--security)
5. [Real-time Features](#real-time-features)
6. [API Reference](#api-reference)
7. [Development Guide](#development-guide)

## Architecture Overview

The DevOps IDE follows a microservices architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Backend       │
│   (React)       │◄──►│   (Port 8080)   │◄──►│   Services      │
│   Port 5173     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   DevOps Tools  │
                       │   Integration   │
                       │                 │
                       │ • SonarQube     │
                       │ • Trivy         │
                       │ • Jenkins       │
                       │ • GitHub        │
                       │ • Docker        │
                       │ • Kubernetes    │
                       └─────────────────┘
```

### Core Services

#### API Gateway (Port 8080)
- **Purpose**: Central entry point for all API requests
- **Features**: Request routing, authentication, rate limiting, logging
- **Health Check**: `GET /health`

#### DevOps Helper Service
- **Purpose**: Unified interface for DevOps tool integration
- **Features**: Command execution, tool status monitoring, result caching
- **Location**: `backend/services/devops_helper.go`

#### WebSocket Service (Port 8086)
- **Purpose**: Real-time communication for live updates
- **Features**: Terminal sessions, live logs, system monitoring
- **Protocols**: WebSocket, Server-Sent Events

## Service Endpoints

### Core API Endpoints

#### Health & Monitoring
```http
GET /health
GET /metrics
```

#### Container Management
```http
GET    /api/containers              # List all containers
GET    /api/containers/{id}         # Get container details
POST   /api/containers/{id}/start   # Start container
POST   /api/containers/{id}/stop    # Stop container
GET    /api/containers/{id}/logs    # Get container logs
```

#### DevOps Tools
```http
GET    /api/devops/commands         # List available commands
POST   /api/devops/execute          # Execute DevOps command
GET    /api/devops/history          # Get command history
GET    /api/devops/tools/status     # Check tool availability
```

### DevOps Command API

#### Execute Command
```http
POST /api/devops/execute
Content-Type: application/json

{
  "command": "sonar-scan",
  "args": ["/path/to/project"]
}
```

#### Response Format
```json
{
  "data": {
    "command": "sonar-scan /path/to/project",
    "success": true,
    "output": "Scan completed successfully",
    "data": {
      "metrics": {...},
      "issues": {...}
    },
    "duration": "45.2s",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## DevOps Tools Integration

### SonarQube Integration

#### Configuration
```bash
# Environment Variables
SONAR_URL=http://localhost:9000
SONAR_TOKEN=your-sonar-token
SONAR_PROJECT_KEY=your-project-key
```

#### Available Commands
```bash
# Trigger code quality scan
sonar-scan /path/to/project

# Get project metrics
sonar-metrics
```

#### API Usage
```javascript
// Trigger scan
const response = await fetch('/api/devops/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    command: 'sonar-scan',
    args: ['/workspace/project']
  })
});

const result = await response.json();
console.log('Scan result:', result.data);
```

#### Response Structure
```json
{
  "success": true,
  "status": "SUCCESS",
  "message": "Scan completed successfully",
  "metrics": {
    "projectStatus": {
      "status": "OK",
      "conditions": [...]
    }
  },
  "measures": {
    "component": {
      "measures": [
        {"metric": "ncloc", "value": "1234"},
        {"metric": "bugs", "value": "0"},
        {"metric": "vulnerabilities", "value": "2"}
      ]
    }
  }
}
```

### Trivy Security Scanner

#### Available Commands
```bash
# Scan filesystem
trivy-fs /path/to/scan

# Scan Docker image
trivy-image nginx:latest

# Scan Git repository
trivy-repo https://github.com/user/repo
```

#### API Usage
```javascript
// Scan Docker image
const response = await fetch('/api/devops/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    command: 'trivy-image',
    args: ['nginx:latest']
  })
});
```

#### Response Structure
```json
{
  "success": true,
  "target": "nginx:latest",
  "scanType": "image",
  "totalVulnerabilities": 15,
  "critical": 2,
  "high": 5,
  "medium": 6,
  "low": 2,
  "report": {
    "results": [...]
  }
}
```

### Jenkins Integration

#### Configuration
```bash
JENKINS_URL=http://localhost:8080
JENKINS_USER=admin
JENKINS_TOKEN=your-api-token
```

#### Available Commands
```bash
# List all jobs
jenkins-jobs

# Trigger job
jenkins-trigger job-name

# Get build status
jenkins-status job-name 123

# Get build logs
jenkins-logs job-name 123
```

#### API Usage
```javascript
// Trigger Jenkins job
const response = await fetch('/api/devops/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    command: 'jenkins-trigger',
    args: ['my-deployment-job']
  })
});
```

### GitHub Actions Integration

#### Configuration
```bash
GITHUB_TOKEN=your-github-token
```

#### Available Commands
```bash
# List workflows
github-workflows owner repo

# List workflow runs
github-runs owner repo

# Trigger workflow
github-trigger owner repo workflow-id ref
```

#### API Usage
```javascript
// List GitHub workflows
const response = await fetch('/api/devops/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    command: 'github-workflows',
    args: ['myorg', 'myrepo']
  })
});
```

## Authentication & Security

### API Authentication
```http
Authorization: Bearer <jwt-token>
```

### Environment Security
- All sensitive data stored in environment variables
- API tokens encrypted at rest
- HTTPS enforced in production
- Rate limiting on all endpoints

### Tool Access Control
- Commands executed in sandboxed environment
- File system access restricted to workspace
- Network access controlled via firewall rules

## Real-time Features

### WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:8086/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleRealTimeUpdate(data);
};
```

### Message Types
```typescript
interface WebSocketMessage {
  type: 'command_result' | 'tool_status' | 'system_metric';
  payload: any;
  timestamp: string;
}
```

### Live Terminal
```javascript
// Terminal session management
const terminal = new Terminal();
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);

// Connect to backend terminal
const ws = new WebSocket('ws://localhost:8086/terminal');
terminal.onData(data => ws.send(data));
ws.onmessage = event => terminal.write(event.data);
```

## API Reference

### Error Handling

#### Standard Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error"
  }
}
```

#### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

### Rate Limiting
- **Default**: 100 requests per minute per IP
- **Authenticated**: 1000 requests per hour per user
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

### Pagination
```http
GET /api/devops/history?page=1&limit=20
```

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Development Guide

### Adding New DevOps Tools

#### 1. Create Service Implementation
```go
// backend/services/newtool.go
package services

type NewToolService struct {
    BaseURL string
    Token   string
    Logger  *zap.Logger
}

func NewNewToolService(baseURL, token string, logger *zap.Logger) *NewToolService {
    return &NewToolService{
        BaseURL: baseURL,
        Token:   token,
        Logger:  logger,
    }
}

func (n *NewToolService) ExecuteCommand(args []string) (*CommandResult, error) {
    // Implementation here
}
```

#### 2. Register in DevOps Helper
```go
// backend/services/devops_helper.go
func (d *DevOpsHelper) InitializeServices(config map[string]interface{}) error {
    // Add new tool initialization
    if newToolConfig, ok := config["newtool"].(map[string]interface{}); ok {
        d.NewTool = NewNewToolService(
            newToolConfig["url"].(string),
            newToolConfig["token"].(string),
            d.Logger,
        )
    }
}
```

#### 3. Add Command Handlers
```go
func (d *DevOpsHelper) GetAvailableCommands() []DevOpsCommand {
    return append(commands, DevOpsCommand{
        Name:        "newtool-command",
        Description: "Execute new tool command",
        Category:    "New Category",
        Example:     "newtool-command arg1 arg2",
    })
}

func (d *DevOpsHelper) ExecuteCommand(command string, args []string) (*CommandResult, error) {
    switch command {
    case "newtool-command":
        return d.executeNewToolCommand(args, result)
    // ... other cases
    }
}
```

#### 4. Add Frontend Integration
```typescript
// src/services/devops.ts
export const executeDevOpsCommand = async (command: string, args: string[]) => {
  const response = await fetch('/api/devops/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, args })
  });
  return response.json();
};
```

### Testing DevOps Integration

#### Unit Tests
```go
// backend/services/newtool_test.go
func TestNewToolService_ExecuteCommand(t *testing.T) {
    service := NewNewToolService("http://test", "token", logger)
    result, err := service.ExecuteCommand([]string{"test"})
    
    assert.NoError(t, err)
    assert.True(t, result.Success)
}
```

#### Integration Tests
```bash
# Test API endpoint
curl -X POST http://localhost:8080/api/devops/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "newtool-command", "args": ["test"]}'
```

### Monitoring & Logging

#### Structured Logging
```go
logger.Info("Command executed",
    zap.String("command", command),
    zap.Strings("args", args),
    zap.Duration("duration", duration),
    zap.Bool("success", result.Success),
)
```

#### Metrics Collection
```go
// Add custom metrics
commandCounter := prometheus.NewCounterVec(
    prometheus.CounterOpts{
        Name: "devops_commands_total",
        Help: "Total number of DevOps commands executed",
    },
    []string{"command", "status"},
)
```

### Configuration Management

#### Environment Variables
```bash
# Tool-specific configuration
NEWTOOL_URL=http://localhost:9000
NEWTOOL_TOKEN=your-token
NEWTOOL_TIMEOUT=30s

# Feature flags
ENABLE_NEWTOOL=true
NEWTOOL_DEBUG=false
```

#### Configuration Validation
```go
func validateConfig(config map[string]interface{}) error {
    required := []string{"url", "token"}
    for _, key := range required {
        if _, ok := config[key]; !ok {
            return fmt.Errorf("missing required config: %s", key)
        }
    }
    return nil
}
```

## Best Practices

### Security
1. **Never log sensitive data** (tokens, passwords)
2. **Validate all inputs** before executing commands
3. **Use least privilege** for tool access
4. **Implement timeout** for long-running operations

### Performance
1. **Cache tool results** when appropriate
2. **Use connection pooling** for HTTP clients
3. **Implement circuit breakers** for external services
4. **Monitor resource usage** and set limits

### Error Handling
1. **Provide meaningful error messages**
2. **Log errors with context**
3. **Implement retry logic** for transient failures
4. **Graceful degradation** when tools are unavailable

### Documentation
1. **Document all API endpoints**
2. **Provide usage examples**
3. **Keep configuration up to date**
4. **Include troubleshooting guides**

---

This guide provides a comprehensive overview of the DevOps IDE services architecture and integration patterns. For specific tool documentation, refer to the individual service files in the `backend/services/` directory.