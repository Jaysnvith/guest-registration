package handlers

import (
	"guest-registration/backend/models"
	"guest-registration/backend/repository"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

type GuestHandler struct {
	Repo *repository.GuestRepository
}

func NewGuestHandler(repo *repository.GuestRepository) *GuestHandler {
	return &GuestHandler{Repo: repo}
}

func (h *GuestHandler) Create(c *gin.Context) {
	var req models.CreateGuestRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	idCardImage := ""
	file, err := c.FormFile("id_card_image")
	if err == nil {
		filename := filepath.Base(file.Filename)
		savePath := "./uploads" + filename
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		idCardImage = savePath
	}

	guest, err := h.Repo.Create(req, idCardImage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, guest)
}

func (h *GuestHandler) GetAll(c *gin.Context) {
	status := c.Query("status")

	guests, err := h.Repo.FindAll(status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if guests == nil {
		guests = []models.Guest{}
	}

	c.JSON(http.StatusOK, guests)
}

func (h *GuestHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	guest, err := h.Repo.FindByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Guest not found"})
		return
	}

	c.JSON(http.StatusOK, guest)
}

func (h *GuestHandler) Checkout(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	guest, err := h.Repo.Checkout(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Guest not found or already checked out"})
		return
	}

	c.JSON(http.StatusOK, guest)
}
