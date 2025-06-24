package init

import (
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
}
