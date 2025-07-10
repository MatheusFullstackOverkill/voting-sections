package main

import (
	"backend/handlers/auth"
	"backend/handlers/topics"
	"backend/handlers/users"
	config "backend/init"
	"backend/middlewares"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

func Setup() {
	config.SetConfig()
	config.InitApp()
	config.InitDB()

	config.App.Use(cors.New())
	config.App.Use(middlewares.Authentication)

	config.App.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, world!")
	})

	config.App.Post("/api/login", auth.Login)
	config.App.Post("/api/users", users.CreateUser)
	config.App.Get("/api/users/:user_id", users.RetriveUser)
	config.App.Get("/api/topics", topics.ListTopics)
	config.App.Post("/api/topics", topics.CreateTopic)
	config.App.Post("/api/topics/:topic_id/session", topics.UpdateTopic)
	config.App.Post("/api/topics/:topic_id/vote", topics.CreateTopicVote)
	config.App.Get("/api/topics/:topic_id/result", topics.RetriveTopicResults)
	config.App.Get("/api/topics/:topic_id", topics.RetriveTopic)

	config.App.Listen(":" + strconv.Itoa(config.GlobaConfig.Port))
}

func main() {
	Setup()
}
