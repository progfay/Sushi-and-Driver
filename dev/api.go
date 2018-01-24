package main

import (
	"math/rand"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2/bson"
)

func specifyUser(c echo.Context) (*User, error) {
	jwtuser := c.Get("user").(*jwt.Token)
	claims := jwtuser.Claims.(jwt.MapClaims)
	username := claims["name"].(string)

	user := new(User)
	query := db.C("user").Find(bson.M{"name": username})
	if err := query.One(&user); err != nil {
		return nil, err
	}

	return user, nil
}

func getUser(c echo.Context) error {
	user, err := specifyUser(c)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}

func gainCoin(c echo.Context) error {
	user, err := specifyUser(c)
	if err != nil {
		return err
	}

	coins := user.Coins + 1

	err = db.C("user").Update(bson.M{"name": user.Name},
		bson.M{"$set": bson.M{"coins": coins}})
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]int{"coins": coins})
}

var sushiList = []string{
	"トロ",
	"サーモン",
	"イカ",
	"ゴミ",
	"宇宙クラゲ",
	"🍣",
	"たまご",
	"カンパチマグロ",
	"微妙なマグロ",
	"カジキマグロ",
	"キャビア",
	"シロナガスクジラ",
	"イワシ",
	"キャベツ",
}

func gainSushi(c echo.Context) error {
	user, err := specifyUser(c)
	if err != nil {
		return err
	}

	if user.Coins < 5 {
		return c.JSON(http.StatusOK, user)
	}

	coins := user.Coins - 5
	rand.Seed(time.Now().Unix())
	sushi := sushiList[rand.Intn(len(sushiList))]
	num := user.Sushi[sushi] + 1

	err = db.C("user").Update(bson.M{"name": user.Name},
		bson.M{"$set": bson.M{"coins": coins}})
	if err != nil {
		return err
	}
	err = db.C("user").Update(bson.M{"name": user.Name},
		bson.M{"$set": bson.M{"sushi." + sushi: num}})
	if err != nil {
		return err
	}

	user, err = specifyUser(c)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}
