package repository

import (
	config "backend/init"
	"backend/interfaces"
)

func CreateUser(userData *interfaces.UserRequest) interfaces.UserRequest {
	createdUser := new(interfaces.UserRequest)

	config.DB.Raw(`
		INSERT INTO "user" (
			email,
			full_name,
			cpf,
			password
		) VALUES (
			?,
			?,
			?,
			?
		) RETURNING *
	`,
		userData.Email,
		userData.FullName,
		userData.CPF,
		userData.Password).Scan(createdUser)

	return *createdUser
}

func UpdateUser(userData *interfaces.UserRequest) interfaces.UserRequest {
	user := new(interfaces.UserRequest)

	config.DB.Raw(`
		UPDATE "user" SET
			email = ?,
			full_name = ?,
		WHERE user_id = ? AND deleted_at IS NULL
		RETURNING
			user_id,
			email,
			full_name,
			created_at,
			updated_at
	`,
		userData.Email,
		userData.FullName,
		userData.UserID).Scan(user)

	return *user
}

func UpdateUserSingleColumn(userID int, column string, value any) interfaces.User {
	updatedUser := new(interfaces.User)

	config.DB.Raw(`
		UPDATE "user" SET ? = ? WHERE user_id = ? AND deleted_at iS NULL RETURNING *
	`, column, value, userID).Scan(&updatedUser)

	return *updatedUser
}

func RetrieveUserByEmail(email string) interfaces.User {
	user := new(interfaces.User)

	config.DB.Raw(`
		SELECT user_id, email, password FROM "user" WHERE email = ? AND deleted_at IS NULL
	`, email).Scan(&user)

	return *user
}

func RetrieveUserByCPF(cpf string) interfaces.User {
	user := new(interfaces.User)

	config.DB.Raw(`
		SELECT user_id FROM "user" WHERE cpf = ? AND deleted_at IS NULL
	`, cpf).Scan(&user)

	return *user
}

func RetrieveUserByID(userID int) interfaces.User {
	user := new(interfaces.User)

	config.DB.Raw(`
		SELECT
			user_id,
			email,
			full_name,
			created_at,
			updated_at
		FROM "user" WHERE user_id = ? AND deleted_at IS NULL
	`, userID).Scan(user)

	return *user
}
