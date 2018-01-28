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

var sushiList = []Sushi{
	Sushi{
		Name: "イクラ",
		Url:  "http://3.bp.blogspot.com/-XHGwGMThERM/USyJ3K9TrII/AAAAAAAAOcQ/AfSbYI8B9Gs/s1600/sushi_ikura.png",
	},
	Sushi{
		Name: "ウニ",
		Url:  "http://4.bp.blogspot.com/-ameYrLgBLwg/WOswHyAaD5I/AAAAAAABDvw/1EUl8gzXY_gma7InL1FGvQJYsvgcd_IowCLcB/s800/sushi_uni2.png",
	},
	Sushi{
		Name: "マグロ",
		Url:  "http://2.bp.blogspot.com/-zPBATBgTJkE/USyJ0rM8ZqI/AAAAAAAAObg/OnQ36wvs7zs/s1600/sushi_akami.png",
	},
	Sushi{
		Name: "シャリ",
		Url:  "http://1.bp.blogspot.com/-tJpxuhCtkGs/WM9YSI5rsGI/AAAAAAABCxM/3UsnA7Pueo0Ns341o2i4dFMezrBHvUkygCLcB/s800/sushi_syari.png",
	},
	Sushi{
		Name: "イカ",
		Url:  "http://1.bp.blogspot.com/-v29TEsOJ9PA/USyJ3Ha5AaI/AAAAAAAAOcU/euK7yFB2XOQ/s1600/sushi_ika.png",
	},
	Sushi{
		Name: "海老",
		Url:  "http://2.bp.blogspot.com/-E28isCFGSAE/USyJ2RdctUI/AAAAAAAAOcA/gvyeuHF0k18/s1600/sushi_ebi.png",
	},
	Sushi{
		Name: "アナゴ",
		Url:  "http://1.bp.blogspot.com/-TBF9Sb6S1S8/USyJ1N0nZMI/AAAAAAAAObw/8SjtJPpx3bg/s1600/sushi_anago.png",
	},
	Sushi{
		Name: "シャコ",
		Url:  "http://2.bp.blogspot.com/-GEonRxl2Ceg/WZP37DLnPrI/AAAAAAABGC0/viAUQWu1GGkQeCfQx_nputmj8I549XWSgCLcBGAs/s800/sushi_syako.png",
	},
	Sushi{
		Name: "玉子",
		Url:  "http://2.bp.blogspot.com/-5lo4Y9aetEU/USyJ5zAfMBI/AAAAAAAAOdM/WS6lp0KbWwE/s1600/sushi_tamago.png",
	},
	Sushi{
		Name: "イワシ",
		Url:  "http://2.bp.blogspot.com/-aWFCYpnJi0Y/USyJ3qv8ikI/AAAAAAAAOcY/fTAk-LV3z7c/s1600/sushi_iwashi.png",
	},
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
	num := user.Sushi[sushi.Name].Count + 1

	err = db.C("user").Update(bson.M{"name": user.Name},
		bson.M{"$set": bson.M{"coins": coins}})
	if err != nil {
		return err
	}

	err = db.C("user").Update(bson.M{"name": user.Name},
		bson.M{"$set": bson.M{"sushi." + sushi.Name + ".count": num}})
	if err != nil {
		return err
	}

	err = db.C("user").Update(bson.M{"name": user.Name},
		bson.M{"$set": bson.M{"sushi." + sushi.Name + ".name": sushi.Name}})
	if err != nil {
		return err
	}

	err = db.C("user").Update(bson.M{"name": user.Name},
		bson.M{"$set": bson.M{"sushi." + sushi.Name + ".url": sushi.Url}})
	if err != nil {
		return err
	}

	user, err = specifyUser(c)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}
