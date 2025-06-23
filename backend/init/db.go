package init

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error

	DB, err = gorm.Open(postgres.Open(GlobaConfig.DatabaseURL), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to the database")
	}

	c, ioErr := os.ReadFile("migrations/1_setup_up.sql")
	if ioErr != nil {
		panic("Failed to read migrations file")
	}
	sql := string(c)
	DB.Exec(sql)
}
