package domain

type User struct {
    ID       string `json:"id"`
    Email    string `json:"email"`
    Password string `json:"-"`
}

type TokenPair struct {
    AccessToken  string `json:"access_token"`
    RefreshToken string `json:"refresh_token"`
}