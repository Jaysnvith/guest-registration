package models

import "time"

type Guest struct {
	ID           int        `json:"id"`
	Name         string     `json:"name"`
	Purpose      string     `json:"purpose"`
	IDCardNumber string     `json:"id_card_number"`
	IDCardImage  string     `json:"id_card_image"`
	HostName     string     `json:"host_name"`
	CheckInAt    time.Time  `json:"check_in_at"`
	CheckOutAt   *time.Time `json:"check_out_at"`
	Status       string     `json:"status"`
}

type CreateGuestRequest struct {
	Name         string `json:"name" form:"name" binding:"required"`
	Purpose      string `json:"purpose" form:"purpose" binding:"required"`
	IDCardNumber string `json:"id_card_number" form:"id_card_number" binding:"required"`
	HostName     string `json:"host_name" form:"host_name" binding:"required"`
}
