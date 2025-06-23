package init

import "github.com/gofiber/fiber/v2"

var App *fiber.App

type RequestUserStruct struct {
	UserID int
}

var RequestUser *RequestUserStruct
var Basepath string

func InitApp() {
	App = fiber.New()

	App.Static("/uploads", "uploads")
}
