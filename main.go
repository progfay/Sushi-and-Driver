package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	mgo "gopkg.in/mgo.v2"
)

const (
	SECRET_KEY = "*b;;]39U52BPY[S2scVvcVjv,SqH0sU^"
)

var (
	db *mgo.Database
)

func main() {
	e := echo.New()

	// setup for mongoDB
	session, _ := mgo.Dial("mongodb://localhost/sushi")
	defer session.Close()
	db = session.DB("sushi")

	// middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Static Files
	e.Static("/public", "public")

	// routing
	e.File("/", "public/index.html")

	e.POST("/login", login)
	e.POST("/signup", signup)

	api := e.Group("/api")
	api.Use(middleware.JWT([]byte(SECRET_KEY)))
	api.GET("/user", getUser)

	// start server
	e.Logger.Fatal(e.Start(":1323"))
}
