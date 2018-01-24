package main

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

const (
	SECRET_KEY = "*b;;]39U52BPY[S2scVvcVjv,SqH0sU^"
)

func main() {
	e := echo.New()

	// middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// routing
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello World!")
	})

	e.POST("/login", login)

	// start server
	e.Logger.Fatal(e.Start(":1323"))
}

// password auth
// generate Token and return JWT Token as JSON
// curl -X -d "username=hogehoge" -d "password="password" localhost:1323/login
// =>
//{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.lGdlfsxfRElCCr4YaQkWsiQPtY02eQ1-P22h6QcB-jg"}

func login(c echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	//TODO: get username and password from DB
	if username == "hogehoge" && password == "password" {
		token := jwt.New(jwt.SigningMethodHS256)

		t, err := token.SignedString([]byte(SECRET_KEY))
		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, map[string]string{
			"token": t,
		})
	}

	return echo.ErrUnauthorized
}

func accesible(c echo.Context) error {
	return c.String(http.StatusOK, "Accesible")
}

// func restricted(c echo.Context) error {
// 	user := c.Get("user").(*jwt.Token)
// 	claims := user.Claims.(*jwt.CustomClaims)
// 	name := claims.Name

// 	return c.String(http.StatusOK, "Welcome "+name+"!")
// }
