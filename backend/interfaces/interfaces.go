package interfaces

import (
	"time"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Authtoken string `json:"auth_token"`
}

type UserRequest struct {
	UserID   int    `json:"user_id"`
	FullName string `json:"full_name"`
	CPF      string `json:"cpf"`
	Email    string `json:"email"`
	Password string `form:"password"`
}

type UserResponse struct {
	UserID    int       `json:"user_id"`
	FullName  string    `json:"full_name"`
	Email     string    `json:"email"`
	CPF       string    `json:"cpf"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type User struct {
	UserID    int       `json:"user_id"`
	FullName  string    `json:"full_name"`
	Email     string    `json:"email"`
	CPF       string    `json:"cpf"`
	Password  string    `form:"password"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Topic struct {
	TopicID          int        `json:"topic_id"`
	CreatorID        int        `json:"creator_id"`
	Title            string     `json:"title"`
	Description      string     `json:"description"`
	Status           string     `json:"status"`
	CreatedAt        time.Time  `json:"created_at"`
	SessionStartedAt *time.Time `json:"session_started_at"`
	DurationMinutes  *int       `json:"duration_minutes"`
}

type Vote struct {
	VoteID    int       `json:"vote_id"`
	TopicID   int       `json:"topic_id"`
	UserID    int       `json:"user_id"`
	Approved  bool      `json:"approved"`
	CreatedAt time.Time `json:"created_at"`
}

type TopicResults struct {
	Result         string `json:"result"`
	ApprovedCount  int    `json:"approved_count"`
	RepprovedCount int    `json:"repproved_count"`
}

type ListParams struct {
	Offset int `query:"offset"`
	Limit  int `query:"limit"`
}

type ListResult[T any] struct {
	Data  []T `json:"data"`
	Count int `json:"count"`
}

type TopicSearchParams struct {
	Search *string `query:"search"`
	ListParams
}
