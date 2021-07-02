package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	Model
	FirstName string `json:"first_name"`
	LastName string `json:"last_name"`
	Email string `json:"email" gorm:'unique'`
	Password string `json:"-"`
	IsAmbassador bool `json:"-"`
	// omitempty: is not set or empty don't return it
	// * -> If we want to return 0 values for number type
	Revenue *float64 `json:"revenue, omitempty" gorm:"-"`
}

type Admin User
type Ambassador User

func (user *User) SetPassword(password string) {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password),12)
	user.Password = string(hashedPassword)
}

func (user *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
}

func (user *User) Name() string {
	return user.FirstName + " " + user.LastName
}

func (a *Ambassador) CalculateRevenue(db *gorm.DB) {
	var orders []Order
	db.Preload("OrderItems").Find(&orders, &Order {
		UserId: a.Id,
		Complete: true,
	})
	var revenue float64
	for _, order := range orders {
		for _, orderItem := range order.OrderItems {
			revenue += orderItem.AmbassadorRevenue
		}
	}

	a.Revenue = &revenue
}

func (a *Admin) CalculateRevenue(db *gorm.DB) {
	var orders []Order
	db.Preload("OrderItems").Find(&orders, &Order {
		UserId: a.Id,
		Complete: true,
	})
	var revenue float64
	for _, order := range orders {
		for _, orderItem := range order.OrderItems {
			revenue += orderItem.AdminRevenue
		}
	}

	a.Revenue = &revenue
}
