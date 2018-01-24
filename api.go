package main

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2/bson"
)

func getUser(c echo.Context) error {
	jwtuser := c.Get("user").(*jwt.Token)
	claims := jwtuser.Claims.(jwt.MapClaims)
	username := claims["name"].(string)

	user := new(User)
	query := db.C("user").Find(bson.M{"name": username})
	if err := query.One(&user); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}
