package users

import (
	"backend/interfaces"
	users_repo "backend/repository/users"
	"backend/utils/bcrypto"
	"backend/utils/encrypt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateUser(c *fiber.Ctx) error {
	var err error
	userRequest := new(interfaces.UserRequest)

	if err := c.BodyParser(userRequest); err != nil {
		return err
	}

	currentUser := users_repo.RetrieveUserByEmail(userRequest.Email)
	if currentUser.UserID != 0 {
		return c.Status(400).JSON(map[string]string{"error": "user already exists"})
	}

	currentUser = users_repo.RetrieveUserByCPF(userRequest.CPF)
	if currentUser.UserID != 0 {
		return c.Status(400).JSON(map[string]string{"error": "user already exists"})
	}

	userRequest.Password, err = encrypt.Decrypt(userRequest.Password)
	if err != nil {
		return err
	}

	userRequest.Password, err = bcrypto.HashPassword(userRequest.Password)
	if err != nil {
		return err
	}

	user := users_repo.CreateUser(userRequest)

	return c.Status(201).JSON(user)
}

func RetriveUser(c *fiber.Ctx) error {
	userId, _ := strconv.Atoi(c.Params("user_id"))

	user := users_repo.RetrieveUserByID(userId)

	if user.UserID == 0 {
		return c.Status(400).JSON(map[string]string{"error": "user not found"})
	}

	return c.JSON(user)
}
