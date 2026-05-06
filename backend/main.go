package main

import (
	"log"
	"os"

	"guest-registration/backend/database"
	"guest-registration/backend/handlers"
	"guest-registration/backend/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Init()

	if err := os.MkdirAll("./uploads", os.ModePerm); err != nil {
		log.Fatal("Failed to create uploads directory:", err)
	}

	guestRepo := repository.NewGuestRepository(database.DB)
	guestHandler := handlers.NewGuestHandler(guestRepo)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT"},
		AllowHeaders: []string{"Content-Type"},
	}))

	r.Static("/uploads", "./uploads")

	api := r.Group("/api")
	{
		api.POST("/guests", guestHandler.Create)
		api.GET("/guests", guestHandler.GetAll)
		api.GET("/guests/:id", guestHandler.GetByID)
		api.PUT("/guests/:id/checkout", guestHandler.Checkout)
	}

	r.Run(":8080")
}
