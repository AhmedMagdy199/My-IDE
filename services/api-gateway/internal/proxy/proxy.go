package proxy

import (
    "net/http"
    "net/http/httputil"
    "net/url"
)

func CreateServiceProxy(targetURL string) http.Handler {
    url, err := url.Parse("http://" + targetURL)
    if err != nil {
        panic(err)
    }
    return httputil.NewSingleHostReverseProxy(url)
}