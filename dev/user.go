package main

import (
	"gopkg.in/mgo.v2/bson"
)

type (
	User struct {
		ID       bson.ObjectId  `json:"id" bson:"_id,omitempty"`
		Name     string         `json:"name" bson:"name"`
		Password string         `json:"password,omitempty" bson:"password"`
		Coins    int            `json:"coins" bson:"coins"`
		Sushi    map[string]int `json:"sushi" bson:"sushi"`
	}
)

type (
	Sushi struct {
		Name string `json:"name" bson:"sushi`
		Url  string `json:"url" bson:"url`
	}
)
