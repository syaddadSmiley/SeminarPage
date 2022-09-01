package main

import (
	"database/sql"

	con "github.com/syaddadSmiley/SeminarPage/database"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := con.Connect()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	asd, err := CreateTable(db)
	if err != nil {
		panic(err)
	}
	println(asd)

	ad, err := CreateTableProducts(db)
	if err != nil {
		panic(err)
	}
	println(ad)

	ap, err := CreateTableJenisProduct(db)
	if err != nil {
		panic(err)
	}
	println(ap)

	az, err := wishlist_table(db)
	if err != nil {
		panic(err)
	}
	println(az)

}

func CreateTable(db *sql.DB) (string, error) {
	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS user (
		id string not null primary key UNIQUE,
		Nama varchar(255) not null,
		Username varchar(255) not null UNIQUE,
		mail varchar(255) not null UNIQUE,
		Password varchar(255) not null,
		role varchar(255) not null,
		gambar LONGBLOB 
	);

	`)
	if err != nil {
		return "Failed Make Table", err
	}
	return "Succes Make Table", nil

}

func CreateTableProducts(db *sql.DB) (string, error) {
	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS products (
		id string not null primary key,
		id_jenis integer not null,
		gambar longblob,
		judul integer not null,
		deskripsi varchar(255) not null,
		lokasi varchar(255) not null DEFAULT 'Online',
		harga integer not null,
		waktu TIMESTAMP not null,
		kapasitas integer not null,

		FOREIGN KEY (id_jenis) REFERENCES JenisProducts(id)
	);

	`)
	if err != nil {
		return "Failed Make Table", err
	}
	return "Succes Make Table", nil
}

func CreateTableJenisProduct(db *sql.DB) (string, error) {
	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS JenisProducts (
		id integer not null primary key AUTOINCREMENT,
		jenis varchar(255) not null
	);

	`)
	if err != nil {
		return "Failed Make Table", err
	}

	if err != nil {
		return "Failed Make Table", err
	}
	return "Succes Make Table", nil
}

func wishlist_table(db *sql.DB) (string, error) {
	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS wishlist_item (
		id string not null primary key,
		id_user string not null,
		id_product string not null,
		FOREIGN KEY (id_user) REFERENCES user(id),
		FOREIGN KEY (id_product) REFERENCES products(id)
	);

	`)
	if err != nil {
		return "Failed Make Table", err
	}
	return "Succes Make Table", nil
}
