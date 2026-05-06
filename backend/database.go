package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func Init() {
	var err error
	DB, err = sql.Open("sqlite3", "./guest.db")
	if err != nil {
		log.Fatal("Failed to open DB:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Failed to connect DB", err)
	}

	createTable()
	log.Println("DB connected")
}

func createTable() {
	query := `
	CREATE TABLE IF NOT EXISTS guests (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		purpose TEXT NOT NULL,
		id_card_number TEXT NOT NULL,
		id_card_image TEXT,
		host_name TEXT NOT NULL,
		check_in_at DATETIME NOT NULL,
		check_out_at DATETIME,
		status TEXT NOT NULL DEFAULT 'active'
	);`

	_, err := DB.Exec(query)
	if err != nil {
		log.Fatal("Failed to create table:", err)
	}
}
