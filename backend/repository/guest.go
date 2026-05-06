package repository

import (
	"database/sql"
	"guest-registration/backend/models"

	"time"
)

type GuestRepository struct {
	DB *sql.DB
}

func NewGuestRepository(db *sql.DB) *GuestRepository {
	return &GuestRepository{DB: db}
}

func (r *GuestRepository) Create(req models.CreateGuestRequest, idCardImage string) (models.Guest, error) {
	query := `
	INSERT INTO guests (name, purpose, id_card_number, id_card_image, host_name, check_in_at, status)
	VALUES (?, ?, ?, ?, ?, ?, 'active')`

	now := time.Now()
	result, err := r.DB.Exec(query, req.Name, req.Purpose, req.IDCardNumber, idCardImage, req.HostName, now)
	if err != nil {
		return models.Guest{}, err
	}

	id, _ := result.LastInsertId()
	return r.FindByID(int(id))
}

func (r *GuestRepository) FindByID(id int) (models.Guest, error) {
	query := `SELECT id, name, purpose, id_card_number, id_card_image, host_name, check_in_at, check_out_at, status FROM guests WHERE id = ?`

	var guest models.Guest
	var checkOutAt sql.NullTime

	err := r.DB.QueryRow(query, id).Scan(
		&guest.ID, &guest.Name, &guest.Purpose, &guest.IDCardNumber, &guest.IDCardImage, &guest.HostName, &guest.CheckInAt, &guest.CheckOutAt, &guest.Status,
	)
	if err != nil {
		return models.Guest{}, err
	}

	if checkOutAt.Valid {
		guest.CheckOutAt = &checkOutAt.Time
	}

	return guest, nil
}

func (r *GuestRepository) FindAll(status string) ([]models.Guest, error) {
	query := `SELECT id, name, purpose, id_card_number, id_card_image, host_name, check_in_at, check_out_at, status FROM guests`
	args := []any{}

	if status != "" {
		query += ` WHERE status = ?`
		args = append(args, status)
	}

	query += ` ORDER BY check_in_at DESC`

	rows, err := r.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var guests []models.Guest
	for rows.Next() {
		var guest models.Guest
		var checkOutAt sql.NullTime

		err := rows.Scan(
			&guest.ID, &guest.Name, &guest.Purpose, &guest.IDCardNumber,
			&guest.IDCardImage, &guest.HostName, &guest.CheckInAt, &checkOutAt, &guest.Status,
		)
		if err != nil {
			return nil, err
		}

		if checkOutAt.Valid {
			guest.CheckOutAt = &checkOutAt.Time
		}

		guests = append(guests, guest)
	}

	return guests, nil
}

func (r *GuestRepository) Checkout(id int) (models.Guest, error) {
	query := `UPDATE guests SET check_out_at = ?, status = 'checked_out' WHERE id = ? AND status = 'active'`

	now := time.Now()
	result, err := r.DB.Exec(query, now, id)
	if err != nil {
		return models.Guest{}, err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return models.Guest{}, sql.ErrNoRows
	}

	return r.FindByID(id)
}
