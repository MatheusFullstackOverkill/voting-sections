package middlewares

import (
	app "backend/init"
	repository "backend/repository/users"
	jwt_pkg "backend/utils/jwt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

var openRoutes = map[string][]string{
	"/api/login":                   {"POST"},
	"/api/users":                   {"POST"},
	"/api/topics":                  {"GET"},
	"/api/topics/:topic_id":        {"GET"},
	"/api/topics/:topic_id/result": {"GET"},
}

func Authentication(c *fiber.Ctx) error {
	currentRoute := string(c.Request().URI().Path())
	currentMethod := string(c.Request().Header.Method())

	var topicId = ""

	routeSplit := strings.Split(currentRoute, "/api/topics/")
	if len(routeSplit) > 1 && routeSplit[1] != "" {
		topicId = routeSplit[1]
	}

	if currentMethod == "OPTIONS" {
		return c.Next()
	}

	for route, methods := range openRoutes {
		route = strings.Replace(route, ":topic_id", topicId, 1)

		if currentRoute == route {
			for _, method := range methods {
				if currentMethod == method {
					return c.Next()
				}
			}
		}
	}

	authorization_header := string(c.Request().Header.Peek("authorization"))

	if len("Bearer") >= len(authorization_header) {
		return c.Status(401).JSON(map[string]string{"message": "invalid token"})
	}

	authorization_header = authorization_header[len("Bearer "):]

	token_data, err := jwt_pkg.VerifyToken(authorization_header)

	if err != nil {
		return c.Status(401).JSON(map[string]string{"message": "invalid token"})
	}

	userID := int(token_data["user_id"].(float64))

	user := repository.RetrieveUserByID(userID)
	if user.UserID == 0 {
		return c.Status(401).JSON(map[string]string{"message": "invalid token"})
	}

	app.RequestUser = &app.RequestUserStruct{UserID: user.UserID}

	return c.Next()
}
