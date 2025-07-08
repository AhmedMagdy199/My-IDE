package service

import (
    "errors"
    "time"

    "github.com/golang-jwt/jwt"
)

type AuthService struct {
    secretKey []byte
}

func NewAuthService(secretKey string) *AuthService {
    return &AuthService{
        secretKey: []byte(secretKey),
    }
}

func (s *AuthService) GenerateTokens(userID string) (*TokenPair, error) {
    accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": userID,
        "exp":     time.Now().Add(time.Hour * 24).Unix(),
    })

    accessTokenString, err := accessToken.SignedString(s.secretKey)
    if err != nil {
        return nil, err
    }

    refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": userID,
        "exp":     time.Now().Add(time.Hour * 24 * 7).Unix(),
    })

    refreshTokenString, err := refreshToken.SignedString(s.secretKey)
    if err != nil {
        return nil, err
    }

    return &TokenPair{
        AccessToken:  accessTokenString,
        RefreshToken: refreshTokenString,
    }, nil
}