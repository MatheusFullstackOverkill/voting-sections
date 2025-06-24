package init

import (
	"log"
	"os"
	"strconv"

	"github.com/caarlos0/env/v6"
	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL string `env:"DATABASE_URL,required"`
	Port        int    `env:"PORT,required"`
}

var GlobaConfig Config = Config{}

func SetConfig() {
	err := godotenv.Load(".env")
	if err != nil {
		DATABASE_URL := os.Getenv("DATABASE_URL")

		if DATABASE_URL == "" || os.Getenv("PORT") == "" {
			log.Fatalf("unable to environment variables: %e", err)
		}

		PORT, _ := strconv.Atoi(os.Getenv("PORT"))

		GlobaConfig = Config{DatabaseURL: DATABASE_URL, Port: PORT}
	}

	err = env.Parse(&GlobaConfig)
	if err != nil {
		log.Fatalf("unable to parse ennvironment variables: %e", err)
	}
}
