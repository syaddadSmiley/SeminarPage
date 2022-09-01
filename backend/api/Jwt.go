package api

import (
	repoz "github.com/syaddadSmiley/SeminarPage/repository"

	"github.com/golang-jwt/jwt/v4"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password`
}
type Registration struct {
	Nama     string `json:"nama"`
	Username string `json:"username"`
	Mail     string `json:"mail"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

var jwtKey = []byte("key")

type Claims struct {
	Id       repoz.ID `json:"id"`
	Username string
	Role     string
	jwt.StandardClaims
}

type CreateProductInput struct {
	IdProduct repoz.ID `json:"-"`
	IdJenis   int      `json:"id_jenis"`
	Gambar    string   `json:"gambar"`
	Judul     string   `json:"judul"`
	Deskripsi string   `json:"deskripsi"`
	Lokasi    string   `json:"lokasi"`
	Harga     int      `json:"harga"`
	Waktu     string   `json:"waktu"`
	Kapasitas int      `json:"kapasitas"`
}

type UpdateProductInput struct {
	IdProduct repoz.ID `json:"-"`
	IdJenis   int      `json:"id_jenis"`
	Gambar    string   `json:"gambar"`
	Judul     string   `json:"judul"`
	Deskripsi string   `json:"deskripsi"`
	Lokasi    string   `json:"lokasi"`
	Harga     int      `json:"harga"`
	Waktu     string   `json:"waktu"`
	Kapasitas int      `json:"kapasitas"`
}

type NambahKategori struct {
	Id    int    `json:"-"`
	Jenis string `json:"jenis"`
}

type UpdateKategori struct {
	Id    int    `json:"id"`
	Jenis string `json:"jenis"`
}

type Result struct {
	Status     bool        `json:"status"`
	Code       int         `json:"code"`
	Message    string      `json:"message"`
	Data       interface{} `json:"data"`
	Pagination *Pagination `json:"pagination,omitempty"`
}

type Wishlist struct {
	Id_user    int `db:"id_user"`
	Id_product int `db:"id_product"`
}

type GantiPassword struct {
	Id       int    `json:"id"`
	Password string `json:"password"`
}

type Pagination struct {
	Total     int `json:"total"`
	Page      int `json:"page"`
	PerPage   int `json:"per_page"`
	TotalPage int `json:"total_page"`
}
