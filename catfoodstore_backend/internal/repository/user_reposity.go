package repository

import (
	"context"
	"database/sql"
	"fmt"

	"catfoodstore_backend/internal/models"
)

type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (*models.User, error)
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	const query = `
    	SELECT id, email, password, role, created_at
    	FROM users
    	WHERE email = $1
	`


	var u models.User
	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&u.ID,
		&u.Email,
		&u.Password,
		&u.Role,
		&u.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("GetByEmail: %w", err)
	}

	return &u, nil
}
