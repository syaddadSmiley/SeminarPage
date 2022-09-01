package api

import (
	"fmt"

	repository "github.com/syaddadSmiley/SeminarPage/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type API struct {
	userRepo  repository.UserRepo
	adminRepo repository.AdminRepo
	gin       *gin.Engine
}

func NewAPI(userRepo repository.UserRepo, adminRepo repository.AdminRepo) *API {
	gin := gin.Default()
	api := &API{
		userRepo:  userRepo,
		adminRepo: adminRepo,
		gin:       gin,
	}

	//User//
	gin.Any("/Login", api.Login)                        //Nanda
	gin.Any("/Register", api.Register)                  //Syaddad
	gin.POST("/Logout", api.AuthMiddleWare(api.Logout)) //Nanda

	gin.GET("/MyProfile", api.AuthMiddleWare(api.GetProfile))             //Nanda
	gin.DELETE("/DeleteUser/:id", api.AuthMiddleWare(api.DeleteUserByID)) //Nanda
	gin.PUT("/UpdateUser/:id", api.AuthMiddleWare(api.UpdateUserByID))    //Nanda
	gin.POST("/UpdatePassword", api.AuthMiddleWare(api.UpdatePassword))   //Nanda

	gin.GET("/GetBarang", api.AuthMiddleWare(api.SearchProductUser))      //Syaddad
	gin.GET("/api/GetBarang/:id", api.AuthMiddleWare(api.GetProductByID)) //Nanda
	gin.GET("/GetBarang/pagination", api.AuthMiddleWare(api.Pagination))  //Syaddad

	gin.POST("/Wishlist/add", api.AuthMiddleWare(api.CreateWishlist))     //Nanda
	gin.DELETE("/Wishlist/hapus", api.AuthMiddleWare(api.DeleteWishlist)) //Nanda
	gin.GET("/Wishlist/get", api.AuthMiddleWare(api.GetWishlist))         //Nanda
	gin.GET("/Wishlist/all/:id", api.AuthMiddleWare(api.GetAllWishlist))  //Nanda

	gin.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With"},
		AllowCredentials: true,
	}))
	//admin//
	gin.Any("/RegisterAdmin", api.RegisterAdmin) //Syaddad

	gin.POST("/AddCategory", api.AuthMiddleWare(api.AdminMiddleware(api.CreateCategory)))      //Syaddad
	gin.PUT("/EditCategory", api.AuthMiddleWare(api.AdminMiddleware(api.UpdateCategory)))      //Syaddad
	gin.DELETE("/DeleteCategory", api.AuthMiddleWare(api.AdminMiddleware(api.DeleteCategory))) //Syaddad
	gin.GET("/GetCategory", api.AuthMiddleWare(api.AdminMiddleware(api.GetCategory)))          //Syaddad

	gin.POST("/AddProduct", api.AuthMiddleWare(api.AdminMiddleware(api.CreateProduct)))      //Syaddad
	gin.PUT("/EditProduct", api.AuthMiddleWare(api.AdminMiddleware(api.UpdateProduct)))      //Syaddad
	gin.DELETE("/DeleteProduct", api.AuthMiddleWare(api.AdminMiddleware(api.DeleteProduct))) //Syaddad

	return api
}

func (api *API) Handler() *gin.Engine {
	return api.gin
}

func (api *API) Start() {
	fmt.Println("http://localhost:8008/")
	api.Handler().Run(":8008")
}
