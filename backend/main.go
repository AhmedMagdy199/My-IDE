package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"devops-ide/services"

	"github.com/docker/docker/client"
	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
	"go.uber.org/zap"
)

type Response struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type Container struct {
	ID      string            `json:"id"`
	Name    string            `json:"name"`
	Image   string            `json:"image"`
	Status  string            `json:"status"`
	Command string            `json:"command"`
	Ports   []string          `json:"ports"`
	Labels  map[string]string `json:"labels"`
	Health  string            `json:"health"`
}

type Server struct {
	router       *mux.Router
	dockerClient *client.Client
	logger       *zap.Logger
	metrics      *Metrics
	devopsHelper *services.DevOpsHelper
	wg          sync.WaitGroup
}

type Metrics struct {
	requestCounter   *prometheus.CounterVec
	requestDuration  *prometheus.HistogramVec
	responseCounter *prometheus.CounterVec
}

func NewMetrics() *Metrics {
	m := &Metrics{
		requestCounter: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "http_requests_total",
				Help: "Total number of HTTP requests",
			},
			[]string{"method", "endpoint"},
		),
		requestDuration: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "http_request_duration_seconds",
				Help:    "HTTP request duration in seconds",
				Buckets: prometheus.DefBuckets,
			},
			[]string{"method", "endpoint"},
		),
		responseCounter: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "http_responses_total",
				Help: "Total number of HTTP responses",
			},
			[]string{"method", "endpoint", "status"},
		),
	}

	prometheus.MustRegister(m.requestCounter)
	prometheus.MustRegister(m.requestDuration)
	prometheus.MustRegister(m.responseCounter)

	return m
}

func NewServer() (*Server, error) {
	logger, err := zap.NewProduction()
	if err != nil {
		return nil, err
	}

	dockerClient, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		logger.Error("Failed to create Docker client", zap.Error(err))
		return nil, err
	}

	// Initialize DevOps helper
	devopsHelper := services.NewDevOpsHelper(logger)
	
	// Initialize services with configuration
	config := map[string]interface{}{
		"sonarqube": map[string]interface{}{
			"url":         getEnv("SONAR_URL", "http://localhost:9000"),
			"token":       getEnv("SONAR_TOKEN", ""),
			"project_key": getEnv("SONAR_PROJECT_KEY", "devops-ide"),
		},
		"jenkins": map[string]interface{}{
			"url":      getEnv("JENKINS_URL", "http://localhost:8080"),
			"username": getEnv("JENKINS_USER", "admin"),
			"token":    getEnv("JENKINS_TOKEN", ""),
		},
		"github": map[string]interface{}{
			"token": getEnv("GITHUB_TOKEN", ""),
		},
	}
	
	if err := devopsHelper.InitializeServices(config); err != nil {
		logger.Error("Failed to initialize DevOps services", zap.Error(err))
	}

	s := &Server{
		router:       mux.NewRouter(),
		dockerClient: dockerClient,
		logger:      logger,
		metrics:     NewMetrics(),
		devopsHelper: devopsHelper,
	}

	s.setupRoutes()
	return s, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func (s *Server) metricsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		// Create a custom response writer to capture the status code
		rw := &responseWriter{w, http.StatusOK}
		
		// Track request
		s.metrics.requestCounter.WithLabelValues(r.Method, r.URL.Path).Inc()
		
		// Call the next handler
		next.ServeHTTP(rw, r)
		
		// Track response and duration
		duration := time.Since(start).Seconds()
		s.metrics.requestDuration.WithLabelValues(r.Method, r.URL.Path).Observe(duration)
		s.metrics.responseCounter.WithLabelValues(r.Method, r.URL.Path, string(rw.statusCode)).Inc()
	})
}

func (s *Server) loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		rw := &responseWriter{w, http.StatusOK}
		next.ServeHTTP(rw, r)
		
		duration := time.Since(start)
		
		s.logger.Info("Request completed",
			zap.String("method", r.Method),
			zap.String("path", r.URL.Path),
			zap.Int("status", rw.statusCode),
			zap.Duration("duration", duration),
			zap.String("remote_addr", r.RemoteAddr),
		)
	})
}

func (s *Server) setupRoutes() {
	// Apply middleware to all routes
	s.router.Use(s.metricsMiddleware)
	s.router.Use(s.loggingMiddleware)

	// Health and metrics endpoints
	s.router.HandleFunc("/health", s.healthCheckHandler).Methods("GET")
	s.router.Handle("/metrics", promhttp.Handler())

	// API routes
	api := s.router.PathPrefix("/api").Subrouter()
	
	// Container management
	api.HandleFunc("/containers", s.getContainersHandler).Methods("GET")
	api.HandleFunc("/containers/{id}", s.getContainerHandler).Methods("GET")
	api.HandleFunc("/containers/{id}/start", s.startContainerHandler).Methods("POST")
	api.HandleFunc("/containers/{id}/stop", s.stopContainerHandler).Methods("POST")
	api.HandleFunc("/containers/{id}/logs", s.getContainerLogsHandler).Methods("GET")
	
	// DevOps tools integration
	api.HandleFunc("/devops/commands", s.getDevOpsCommandsHandler).Methods("GET")
	api.HandleFunc("/devops/execute", s.executeDevOpsCommandHandler).Methods("POST")
	api.HandleFunc("/devops/history", s.getCommandHistoryHandler).Methods("GET")
	api.HandleFunc("/devops/tools/status", s.getToolStatusHandler).Methods("GET")
}

func (s *Server) healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	health := struct {
		Status    string `json:"status"`
		Timestamp string `json:"timestamp"`
	}{
		Status:    "healthy",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	s.jsonResponse(w, http.StatusOK, Response{Data: health})
}

func (s *Server) getContainersHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	if s.dockerClient == nil {
		s.errorResponse(w, http.StatusServiceUnavailable, "Docker client not available")
		return
	}

	containers, err := s.dockerClient.ContainerList(ctx, client.ContainerListOptions{All: true})
	if err != nil {
		s.logger.Error("Failed to list containers", zap.Error(err))
		s.errorResponse(w, http.StatusInternalServerError, "Failed to list containers")
		return
	}

	var result []Container
	for _, c := range containers {
		container := Container{
			ID:      c.ID[:12],
			Name:    c.Names[0],
			Image:   c.Image,
			Status:  c.Status,
			Command: c.Command,
			Labels:  c.Labels,
			Ports:   make([]string, 0),
		}

		for _, p := range c.Ports {
			container.Ports = append(container.Ports, p.String())
		}

		// Get container health status
		inspect, err := s.dockerClient.ContainerInspect(ctx, c.ID)
		if err == nil && inspect.State != nil && inspect.State.Health != nil {
			container.Health = inspect.State.Health.Status
		}

		result = append(result, container)
	}

	s.jsonResponse(w, http.StatusOK, Response{Data: result})
}

func (s *Server) getContainerHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	ctx := r.Context()
	container, err := s.dockerClient.ContainerInspect(ctx, id)
	if err != nil {
		s.logger.Error("Failed to inspect container", zap.Error(err), zap.String("container_id", id))
		s.errorResponse(w, http.StatusNotFound, "Container not found")
		return
	}

	s.jsonResponse(w, http.StatusOK, Response{Data: container})
}

func (s *Server) startContainerHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	ctx := r.Context()
	err := s.dockerClient.ContainerStart(ctx, id, client.ContainerStartOptions{})
	if err != nil {
		s.logger.Error("Failed to start container", zap.Error(err), zap.String("container_id", id))
		s.errorResponse(w, http.StatusInternalServerError, "Failed to start container")
		return
	}

	s.jsonResponse(w, http.StatusOK, Response{Message: "Container started successfully"})
}

func (s *Server) stopContainerHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	ctx := r.Context()
	timeout := time.Second * 30
	err := s.dockerClient.ContainerStop(ctx, id, &timeout)
	if err != nil {
		s.logger.Error("Failed to stop container", zap.Error(err), zap.String("container_id", id))
		s.errorResponse(w, http.StatusInternalServerError, "Failed to stop container")
		return
	}

	s.jsonResponse(w, http.StatusOK, Response{Message: "Container stopped successfully"})
}

func (s *Server) getContainerLogsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	ctx := r.Context()
	options := client.ContainerLogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Timestamps: true,
		Tail:       "100",
	}

	logs, err := s.dockerClient.ContainerLogs(ctx, id, options)
	if err != nil {
		s.logger.Error("Failed to get container logs", zap.Error(err), zap.String("container_id", id))
		s.errorResponse(w, http.StatusInternalServerError, "Failed to get container logs")
		return
	}
	defer logs.Close()

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	_, err = io.Copy(w, logs)
	if err != nil {
		s.logger.Error("Failed to stream container logs", zap.Error(err))
	}
}

// DevOps tools handlers
func (s *Server) getDevOpsCommandsHandler(w http.ResponseWriter, r *http.Request) {
	commands := s.devopsHelper.GetAvailableCommands()
	s.jsonResponse(w, http.StatusOK, Response{Data: commands})
}

func (s *Server) executeDevOpsCommandHandler(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Command string   `json:"command"`
		Args    []string `json:"args"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		s.errorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	
	result, err := s.devopsHelper.ExecuteCommand(request.Command, request.Args)
	if err != nil {
		s.logger.Error("Failed to execute DevOps command", zap.Error(err))
		s.errorResponse(w, http.StatusInternalServerError, "Failed to execute command")
		return
	}
	
	// Save command history
	if err := s.devopsHelper.SaveCommandHistory(result); err != nil {
		s.logger.Warn("Failed to save command history", zap.Error(err))
	}
	
	s.jsonResponse(w, http.StatusOK, Response{Data: result})
}

func (s *Server) getCommandHistoryHandler(w http.ResponseWriter, r *http.Request) {
	history, err := s.devopsHelper.GetCommandHistory(20)
	if err != nil {
		s.logger.Error("Failed to get command history", zap.Error(err))
		s.errorResponse(w, http.StatusInternalServerError, "Failed to get command history")
		return
	}
	
	s.jsonResponse(w, http.StatusOK, Response{Data: history})
}

func (s *Server) getToolStatusHandler(w http.ResponseWriter, r *http.Request) {
	statuses, err := s.devopsHelper.CheckToolAvailability()
	if err != nil {
		s.logger.Error("Failed to check tool status", zap.Error(err))
		s.errorResponse(w, http.StatusInternalServerError, "Failed to check tool status")
		return
	}
	
	s.jsonResponse(w, http.StatusOK, Response{Data: statuses})
}

func (s *Server) jsonResponse(w http.ResponseWriter, status int, response Response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(response)
}

func (s *Server) errorResponse(w http.ResponseWriter, status int, message string) {
	s.jsonResponse(w, status, Response{Error: message})
}

func (s *Server) Start(port string) error {
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
		MaxAge:         300,
	})

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      corsHandler.Handler(s.router),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt, syscall.SIGTERM)
		<-sigint

		s.logger.Info("Received shutdown signal. Initiating graceful shutdown...")

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := srv.Shutdown(ctx); err != nil {
			s.logger.Error("HTTP server shutdown error", zap.Error(err))
		}

		s.wg.Done()
	}()

	s.wg.Add(1)
	s.logger.Info("Starting server", zap.String("port", port))

	if err := srv.ListenAndServe(); err != http.ErrServerClosed {
		return err
	}

	s.wg.Wait()
	return nil
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func main() {
	server, err := NewServer()
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	if err := server.Start("8080"); err != nil {
		server.logger.Fatal("Server failed to start", zap.Error(err))
	}
}