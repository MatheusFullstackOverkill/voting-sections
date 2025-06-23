package init

import (
	"log"

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
		log.Fatalf("unable to load .env file: %e", err)
	}

	err = env.Parse(&GlobaConfig)
	if err != nil {
		log.Fatalf("unable to parse ennvironment variables: %e", err)
	}
}
