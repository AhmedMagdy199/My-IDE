package main

import (
    "log"
    "net/http"

    "github.com/gorilla/mux"
    "github.com/rs/cors"
)

func main() {
    r := mux.NewRouter()

    // Routes
    r.HandleFunc("/health", healthCheckHandler).Methods("GET")
    
    // Service routes
    r.PathPrefix("/auth/").Handler(createServiceProxy("auth-service:8081"))
    r.PathPrefix("/files/").Handler(createServiceProxy("file-service:8082"))
    r.PathPrefix("/jenkins/").Handler(createServiceProxy("jenkins-service:8083"))
    r.PathPrefix("/kubernetes/").Handler(createServiceProxy("kubernetes-service:8084"))
    r.PathPrefix("/terraform/").Handler(createServiceProxy("terraform-service:8085"))

    // CORS
    c := cors.New(cors.Options{
        AllowedOrigins: []string{"*"},
        AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders: []string{"Authorization", "Content-Type"},
    })

    handler := c.Handler(r)
    log.Fatal(http.ListenAndServe(":8080", handler))
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("API Gateway is healthy"))
}