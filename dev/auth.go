package main

import (
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2/bson"
)

type loginData struct {
	Name     string `json:"name" form:"name" query:"name"`
	Password string `json:"password" form:"password" query:"password"`
}

// password auth
// generate Token and return JWT Token as JSON
// curl -X -d "username=hogehoge" -d "password="password" localhost:1323/login
// =>
//{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.lGdlfsxfRElCCr4YaQkWsiQPtY02eQ1-P22h6QcB-jg"}
func login(c echo.Context) error {
	ld := new(loginData)
	if err := c.Bind(ld); err != nil {
		return c.String(http.StatusBadRequest, "bad")
	}

	user := new(User)
	query := db.C("user").Find(bson.M{"name": ld.Name})
	if err := query.One(&user); err != nil {
		return c.String(http.StatusBadRequest, "notfound user")
	}

	//TODO: get username and password from DB
	if ld.Name == user.Name && ld.Password == user.Password {
		token := jwt.New(jwt.SigningMethodHS256)

		claims := token.Claims.(jwt.MapClaims)
		claims["name"] = ld.Name
		claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

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

func signup(c echo.Context) error {
	ld := new(loginData)
	if err := c.Bind(ld); err != nil {
		return c.String(http.StatusBadRequest, "bad")
	}

	user := new(User)
	query := db.C("user").Find(bson.M{"name": ld.Name})
	if err := query.One(&user); err == nil {
		return c.String(http.StatusConflict, "this name already exists")
	}

	newUser := &User{
		Name:     ld.Name,
		Password: ld.Password,
		Coins:    0,
		Sushi:    make(map[string]int),
	}

	userCol := db.C("user")
	if err := userCol.Insert(newUser); err != nil {
		return c.String(http.StatusInternalServerError, "unexpected error")
	}

	return c.String(http.StatusOK, "ok")
}
