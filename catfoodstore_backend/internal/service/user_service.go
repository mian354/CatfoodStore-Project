package service

import (
	"context"
	"errors"
	"strings"

	"catfoodstore_backend/internal/models"
	"catfoodstore_backend/internal/repository"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

type UserService interface {
	Login(ctx context.Context, email, password string) (*models.User, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{userRepo: repo}
}

func (s *userService) Login(ctx context.Context, email, password string) (*models.User, error) {
	email = strings.TrimSpace(email)
	if email == "" || password == "" {
		return nil, ErrInvalidCredentials
	}

	u, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if u == nil || u.Password != password {
		return nil, ErrInvalidCredentials
	}

	return u, nil
}
