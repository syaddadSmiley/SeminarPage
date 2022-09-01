package api

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"

	repoz "github.com/syaddadSmiley/SeminarPage/repository"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (api *API) Pagination(c *gin.Context) {
	api.alloworigin(c)
	var (
		page    int
		perPage int
		offset  int
		total   int
		message string
		isError bool
	)

	params := c.Request.URL.Query()

	_, err := fmt.Sscan(params.Get("per_page"), &perPage)
	_, err = fmt.Sscan(params.Get("page"), &page)

	if err != nil && err.Error() != "EOF" {
		c.JSON(http.StatusBadRequest, Result{
			Status:  false,
			Code:    http.StatusBadRequest,
			Message: "Throw a param with the value convertible to a number, ERROR: " + err.Error(),
			Data:    []string{},
		})
		return
	}

	//Perhalaman nya

	if perPage == 0 {
		perPage = 50
	}

	if page == 0 {
		page = 1
	}

	offset = (page - 1) * perPage

	defer func() {
		if isError {
			c.JSON(http.StatusInternalServerError, Result{
				Status:  false,
				Code:    http.StatusInternalServerError,
				Message: "Failed to fetch, ERROR: " + message,
				Data:    nil,
			})
			return
		}
	}()

	teachers, err := api.userRepo.Allproduk(perPage, offset)
	if err != nil {
		isError = true
		message = err.Error()
		return
	}

	total, err = api.userRepo.GetRowProducts()
	if err != nil {
		isError = true
		message = err.Error()
		return
	}

	totalPage := 1
	if total > perPage {
		totalPage = int(math.Ceil(float64(total) / float64(perPage)))
	}

	c.JSON(http.StatusOK, Result{
		Status:  true,
		Code:    http.StatusOK,
		Message: "Success",
		Data:    teachers,
		Pagination: &Pagination{
			Total:     total,
			Page:      page,
			PerPage:   perPage,
			TotalPage: totalPage,
		},
	})
}

func (api *API) Login(c *gin.Context) {
	api.alloworigin(c)
	if c.Request.Method == "OPTIONS" {
		c.Writer.WriteHeader(200)
		return
	}

	if c.Request.Method != "POST" {
		c.JSON(400, gin.H{
			"status":  400,
			"message": "Method Not Allowed",
		})
		return
	}
	var cred Credentials
	err := json.NewDecoder(c.Request.Body).Decode(&cred)
	fmt.Println(cred)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "Invalid request body",
		})
		return
	}

	if cred.Username == "" && cred.Password == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "username dan password tidak boleh kosong",
		})
		return
	} else if cred.Username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "username tidak boleh kosong",
		})
		return
	} else if cred.Password == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "password tidak boleh kosong",
		})
		return
	}

	resp, err := api.userRepo.LoginUser(cred.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}
	dataUser := *resp
	if dataUser.Username != cred.Username {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "user credential invalid",
		})
		return
	} else if err := bcrypt.CompareHashAndPassword([]byte(dataUser.Password), []byte(cred.Password)); err != nil {
		fmt.Println(dataUser.Password)
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "password salah",
		})
		return
	}

	expirationTime := time.Now().Local().Add((5 * time.Minute) + (7 * time.Hour) + (5 * time.Minute))

	claims := &Claims{
		Id:       dataUser.Id,
		Username: cred.Username,
		Role:     dataUser.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "login success",
		"data":    dataUser,
		"token":   tokenString,
	})
}

func (api *API) Register(c *gin.Context) {
	api.alloworigin(c)

	if c.Request.Method == "OPTIONS" {
		c.Writer.WriteHeader(200)
		return
	}

	if c.Request.Method != "POST" {
		fmt.Println("TESSSSs")
		c.JSON(400, gin.H{
			"status":  400,
			"message": "Method Not Allowed",
		})
		return
	}
	var reg repoz.RegisterRequest

	err := json.NewDecoder(c.Request.Body).Decode(&reg)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "Invalid request body",
		})
		return
	}

	if reg.Username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "username tidak boleh kosong",
		})
		return
	} else if reg.Password == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "password tidak boleh kosong",
		})
		return
	} else if reg.Nama == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "nama tidak boleh kosong",
		})
		return
	} else if reg.Mail == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "mail tidak boleh kosong",
		})
		return
	}

	check, err := api.userRepo.CheckAccount(reg.Username, reg.Mail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}
	x := check.Id.String()
	if x != "00000000-0000-0000-0000-000000000000" {
		c.JSON(400, gin.H{
			"code":    400,
			"message": "akun sudah ada",
		})
		return
	}
	password, _ := bcrypt.GenerateFromPassword([]byte(reg.Password), 10)
	strPassword := string(password)
	reg.Password = strPassword
	reg.Role = "user"
	reg.Id = repoz.NewID()

	reg.Gambar, err = NoPhotoProfile()

	data, err := api.userRepo.RegisterUser(reg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"data":    data,
		"message": "Register Success",
	})
}

func (api *API) UpdateUserByID(c *gin.Context) {
	api.alloworigin(c)
	idStr := c.Param("id")
	id, err := repoz.StringToID(idStr)

	if c.Request.Method == "OPTIONS" {
		c.Writer.WriteHeader(200)
		return
	}

	if c.Request.Method != "PUT" {
		c.JSON(400, gin.H{
			"status":  400,
			"message": "Method Not Allowed",
		})
		return
	}

	token, err := c.Request.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			c.Writer.WriteHeader(http.StatusUnauthorized)
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    http.StatusUnauthorized,
				"message": "anda belum login",
			})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": err.Error(),
		})
		return
	}

	claims, err := checkToken(token.Value)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": err,
		})
		return
	}
	if claims.Id != id {
		fmt.Println(claims.Id, id)
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "anda tidak punya akses",
		})
		return
	}

	var reg repoz.UserRequest
	reg.Id = id
	reg.Role = claims.Role
	err = json.NewDecoder(c.Request.Body).Decode(&reg)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "Invalid request body",
		})
		return
	}
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "Invalid request body",
		})
		return
	}
	if reg.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "username tidak boleh kosong",
		})
		return
	} else if reg.Password != "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "maaf, untuk saat ini anda belum bisa mengganti password",
		})
		return
	} else if reg.Nama == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "nama tidak boleh kosong",
		})
		return
	}

	if reg.Mail != "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "maaf, untuk saat ini anda belum bisa mengganti email",
		})
		return
	}

	if strings.Contains(string(reg.Gambar), "data:image/png;base64") == true || strings.Contains(string(reg.Gambar), "data:image/jpeg;base64") == true {
		password, _ := bcrypt.GenerateFromPassword([]byte(reg.Password), 10)
		strPassword := string(password)
		reg.Password = strPassword
		_, err = api.userRepo.UpdateUserByID(reg)
		if err != nil {
			if err.Error() == "UNIQUE constraint failed: user.Username" {
				c.JSON(http.StatusBadRequest, gin.H{
					"code":    http.StatusBadRequest,
					"message": "username has taken",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    http.StatusInternalServerError,
				"message": err.Error(),
			})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "File not supported",
		})
		return
	}

	data, err := api.userRepo.GetProfile(claims.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"data":    data,
		"message": "Update Success",
	})

}

func (api *API) RegisterAdmin(c *gin.Context) {
	api.alloworigin(c)
	if c.Request.Method == "OPTIONS" {
		c.Writer.WriteHeader(200)
		return
	}

	if c.Request.Method != "POST" {
		c.JSON(400, gin.H{
			"status":  400,
			"message": "Method Not Allowed",
		})
		return
	}

	var reg repoz.RegisterRequest

	err := json.NewDecoder(c.Request.Body).Decode(&reg)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "Invalid request body",
		})
		return
	}

	if reg.Username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "username tidak boleh kosong",
		})
		return
	} else if reg.Password == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "password tidak boleh kosong",
		})
		return
	} else if reg.Nama == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "nama tidak boleh kosong",
		})
		return
	} else if reg.Mail == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "mail tidak boleh kosong",
		})
		return
	}
	//dataUser := *resp
	check, err := api.userRepo.CheckAccount(reg.Username, reg.Mail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}
	x := check.Id.String()
	zero := repoz.ZeroID()
	if x != zero {
		c.JSON(400, gin.H{
			"code":    400,
			"message": "akun sudah ada",
		})
		return
	}
	password, _ := bcrypt.GenerateFromPassword([]byte(reg.Password), 10)
	strPassword := string(password)
	reg.Password = strPassword
	reg.Role = "admin"
	reg.Id = repoz.NewID()
	reg.Gambar, err = NoPhotoProfile()
	_, err = api.userRepo.RegisterUser(reg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "Register Success",
	})
}

func (api *API) Logout(c *gin.Context) {
	api.alloworigin(c)

	http.SetCookie(c.Writer, &http.Cookie{
		Name:    "token",
		Value:   "",
		Expires: time.Unix(0, 0),
	})

	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "logout success",
	})
}

//////////////////////////////////////////////Mendapatkan Profil User//////////////////////////////////////////
func (api *API) GetProfile(c *gin.Context) {
	token, err := c.Request.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			c.Writer.WriteHeader(http.StatusUnauthorized)
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    http.StatusUnauthorized,
				"message": "anda belum login",
			})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": err.Error(),
		})
		return
	}

	claims, err := checkToken(token.Value)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": err,
		})
		return
	}
	fmt.Println(claims.Id)
	dataProfile, err := api.userRepo.GetProfile(claims.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "berhasil",
		"data":    dataProfile,
	})
}

func (api *API) DeleteUserByID(c *gin.Context) {
	api.alloworigin(c)
	idStr := c.Param("id")
	id, err := repoz.StringToID(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": err.Error(),
		})
		return
	}

	_, err = api.userRepo.DeleteUserByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "berhasil",
	})
}

/////////////////////////////////SearchUser//////////////////////////////////////////////////////////////
func (api *API) SearchProductUser(c *gin.Context) {
	api.alloworigin(c)

	var (
		page    int
		perPage int
		offset  int
		total   int
		message string
		isError bool
	)

	params := c.Request.URL.Query()

	_, err := fmt.Sscan(params.Get("per_page"), &perPage)
	_, err = fmt.Sscan(params.Get("page"), &page)

	if err != nil && err.Error() != "EOF" {
		c.JSON(http.StatusBadRequest, Result{
			Status:  false,
			Code:    http.StatusBadRequest,
			Message: "Throw a param with the value convertible to a number, ERROR: " + err.Error(),
			Data:    []string{},
		})
		return
	}

	//Perhalaman nya

	if perPage == 0 {
		perPage = 50
	}

	if page == 0 {
		page = 1
	}

	offset = (page - 1) * perPage

	defer func() {
		if isError {
			c.JSON(http.StatusInternalServerError, Result{
				Status:  false,
				Code:    http.StatusInternalServerError,
				Message: "Failed to fetch, ERROR: " + message,
				Data:    nil,
			})
			return
		}
	}()

	search := params.Get("search")
	if search != "" {
		data, err := api.userRepo.SearchTask(search, perPage, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    http.StatusInternalServerError,
				"message": err.Error(),
			})
			return
		}

		total, err = api.userRepo.GetRowProducts()
		if err != nil {
			isError = true
			message = err.Error()
			return
		}

		totalPage := 1
		if total > perPage {
			totalPage = int(math.Ceil(float64(total) / float64(perPage)))
		}

		c.JSON(http.StatusOK, Result{
			Status:  true,
			Code:    http.StatusOK,
			Message: "Success",
			Data:    data,
			Pagination: &Pagination{
				Total:     total,
				Page:      page,
				PerPage:   perPage,
				TotalPage: totalPage,
			},
		})
		return
	}
	data, err := api.userRepo.GetTask(perPage, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}

	total, err = api.userRepo.GetRowProducts()
	if err != nil {
		isError = true
		message = err.Error()
		return
	}
	totalPage := 1
	if total > perPage {
		totalPage = int(math.Ceil(float64(total) / float64(perPage)))
	}

	c.JSON(http.StatusOK, Result{
		Status:  true,
		Code:    http.StatusOK,
		Message: "Success",
		Data:    data,
		Pagination: &Pagination{
			Total:     total,
			Page:      page,
			PerPage:   perPage,
			TotalPage: totalPage,
		},
	})

}

func (api *API) GetProductByID(c *gin.Context) {
	api.alloworigin(c)
	idStr := c.Param("id")
	id, err := repoz.StringToID(idStr)
	fmt.Println(idStr)

	data, err := api.userRepo.GetProductByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "berhasil",
		"data":    data,
	})

}

/////////////////////////////////Wishlist//////////////////////////////////////////////////////////////
func (api *API) CreateWishlist(c *gin.Context) {
	api.alloworigin(c)
	var whishResp repoz.WishlistRequest
	if err := c.ShouldBindJSON(&whishResp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := c.Request.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    http.StatusUnauthorized,
				"message": "anda belum login",
			})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": err.Error(),
		})
		return
	}

	claims, err := checkToken(token.Value)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": err,
		})
		return
	}

	if claims.Id != whishResp.Id_user {
		c.Writer.WriteHeader(http.StatusUnauthorized)
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "bukan id user yang benar",
		})
		return
	}

	_, err = api.userRepo.GetProductByID(whishResp.Id_product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product tidak ditemukan"})
		return
	}

	data, err := api.userRepo.CheckWishlist(whishResp.Id_user, whishResp.Id_product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":   http.StatusBadRequest,
			"errors": err,
		})
		return
	}
	zero := repoz.ZeroID()
	if data.Id.String() != zero {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "product sudah ada di wishlist",
		})
		return
	}

	id_user := claims.Id
	Id := repoz.NewID()
	_, err = api.userRepo.InsertWishlist(Id, id_user, whishResp.Id_product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	data, err = api.userRepo.CheckWishlist(whishResp.Id_user, whishResp.Id_product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":   http.StatusBadRequest,
			"errors": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": http.StatusOK,
		"data": data,
	})
}

func (api *API) DeleteWishlist(c *gin.Context) {
	api.alloworigin(c)
	params := c.Request.URL.Query()
	idStr := params.Get("id")
	id, err := repoz.StringToID(idStr)
	res, err := api.userRepo.DeleteWishlistByID(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data":    res,
		"message": "Wishlist deleted successfully",
	})
}

/////////////////////////////////Update////////////////////////////////////
func (api *API) UpdatePassword(c *gin.Context) {
	api.alloworigin(c)
	var user GantiPassword

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if user.Password == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Username tidak boleh kosong"})
		return
	} else if user.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password tidak boleh kosong"})
		return
	}

	password, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	strPassword := string(password)

	_, err = api.userRepo.UpdatePassword(strPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "password berhasil diubah",
	})
}

func (api *API) DeteleAkun(c *gin.Context) {
	api.alloworigin(c)
	params := c.Request.URL.Query()
	idStr := params.Get("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": "Invalid ID",
		})
	}
	res, err := api.userRepo.DeleteAkun(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data":    res,
		"message": "User deleted successfully",
	})
}

func (api *API) GetWishlist(c *gin.Context) {
	api.alloworigin(c)
	params := c.Request.URL.Query()
	idUserStr := params.Get("id_user")
	IdProductStr := params.Get("id_product")
	id_user, err := repoz.StringToID(idUserStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":   http.StatusBadRequest,
			"errors": err.Error(),
		})
		return
	}
	id_product, err := repoz.StringToID(IdProductStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":   http.StatusBadRequest,
			"errors": err.Error(),
		})
		return
	}

	data, err := api.userRepo.GetWishlist(id_user, id_product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    http.StatusInternalServerError,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"data":    data,
		"message": "success",
	})
}

func (api *API) GetAllWishlist(c *gin.Context) {
	api.alloworigin(c)
	idStr := c.Param("id")
	id, err := repoz.StringToID(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":  http.StatusBadRequest,
			"error": err.Error(),
		})
	}

	token, err := c.Request.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			c.Writer.WriteHeader(http.StatusUnauthorized)
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    http.StatusUnauthorized,
				"message": "anda belum login",
			})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": err.Error(),
		})
		return
	}

	claims, err := checkToken(token.Value)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": err.Error(),
		})
		return
	}

	if claims.Id != id {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "Invalid ID!",
		})
		return
	}

	// var (
	// 	page    int
	// 	perPage int
	// 	offset  int
	// 	total   int
	// 	message string
	// 	isError bool
	// )

	// params := c.Request.URL.Query()

	// _, err = fmt.Sscan(params.Get("per_page"), &perPage)
	// _, err = fmt.Sscan(params.Get("page"), &page)

	// if err != nil && err.Error() != "EOF" {
	// 	c.JSON(http.StatusBadRequest, Result{
	// 		Status:  false,
	// 		Code:    http.StatusBadRequest,
	// 		Message: "Throw a param with the value convertible to a number, ERROR: " + err.Error(),
	// 		Data:    []string{},
	// 	})
	// 	return
	// }

	// if perPage == 0 {
	// 	perPage = 50
	// }

	// if page == 0 {
	// 	page = 1
	// }

	// offset = (page - 1) * perPage

	// defer func() {
	// 	if isError {
	// 		c.JSON(http.StatusInternalServerError, Result{
	// 			Status:  false,
	// 			Code:    http.StatusInternalServerError,
	// 			Message: "Failed to fetch, ERROR: " + message,
	// 			Data:    nil,
	// 		})
	// 		return
	// 	}
	// }()

	res, err := api.userRepo.GetAllWishlist(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":  http.StatusInternalServerError,
			"error": err.Error(),
		})
		return
	}
	// total, err = api.userRepo.GetRowWishlist(id)
	// if err != nil {
	// 	isError = true
	// 	message = err.Error()
	// 	return
	// }

	// totalPage := 1
	// if total > perPage {
	// 	totalPage = int(math.Ceil(float64(total) / float64(perPage)))
	// }

	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "success",
		"data":    res,
	})
}
