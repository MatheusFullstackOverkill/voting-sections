package auth

import (
	"backend/interfaces"
	users_repo "backend/repository/users"
	"backend/utils/bcrypto"
	"backend/utils/encrypt"
	jwt_pkg "backend/utils/jwt"

	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	loginData := interfaces.LoginRequest{}

	if err := c.BodyParser(&loginData); err != nil {
		return err
	}

	decriptedPassword, err := encrypt.Decrypt(loginData.Password)
	if err != nil {
		return c.Status(400).JSON(map[string]string{"error": "invalid request"})
	}

	user := users_repo.RetrieveUserByEmail(loginData.Email)
	if user.UserID == 0 {
		return c.Status(400).JSON(map[string]string{"error": "user not found"})
	}

	check := bcrypto.CheckPasswordHash(decriptedPassword, user.Password)

	if !check {
		return c.Status(400).JSON(map[string]string{"error": "user not found"})
	}

	jwt, err := jwt_pkg.CreateToken(user.UserID)
	if err != nil {
		return c.Status(400).JSON(map[string]string{"error": "an unexpected error has ocurred"})
	}

	jwt_pkg.VerifyToken(jwt)

	loginResponse := &interfaces.LoginResponse{Authtoken: jwt}

	return c.JSON(loginResponse)
}
