package main

import (
	"fmt"
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2/bson"
)

func getUser(c echo.Context) error {
	fmt.Println("---- comming function ---")
	jwtuser := c.Get("user").(*jwt.Token)

	fmt.Println("---- comming function ---")
	claims := jwtuser.Claims.(jwt.MapClaims)
	fmt.Println("---- comming function ---")
	username := claims["name"].(string)

	fmt.Println("--- name is : " + username + " ----")

	user := new(User)
	query := db.C("user").Find(bson.M{"name": username})
	if err := query.One(&user); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}
