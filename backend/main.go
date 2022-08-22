package main

import (
	"project/api"
	con "project/database"
	repository "project/repository"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := con.Connect()
	if err != nil {
		panic(err)
	}

	userRepo := repository.NewUserRepo(db)
	userAdmin := repository.NewTaskRepo(db)
	route := api.NewAPI(*userRepo, *userAdmin)
	route.Start()
}
