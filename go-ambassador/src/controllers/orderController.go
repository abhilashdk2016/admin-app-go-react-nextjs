package controllers

import (
	"ambassador/src/database"
	"ambassador/src/models"
	"context"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
	"net/smtp"
)

type CreateOrderRequest struct {
	Code string
	FirstName string
	LastName string
	Email string
	Address string
	Country string
	City string
	Zip string
	Products []map[string]int
}

func Orders(c *fiber.Ctx) error {
	var orders []models.Order

	database.DB.Preload("OrderItems").Find(&orders)

	for i, order := range orders {
		orders[i].Name = order.FullName()
		orders[i].Total = order.GetTotal()
	}

	return c.JSON(orders)
}

func CreateOrder(c *fiber.Ctx) error {
	var request CreateOrderRequest

	if err := c.BodyParser(&request); err != nil {
		return err
	}

	link := models.Link{
		Code: request.Code,
	}

	database.DB.Preload("User").First(&link)

	if link.Id == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "invalid link",
		})
	}

	order := models.Order{
		Code: link.Code,
		UserId: link.User.Id,
		AmbassadorEmail: link.User.Email,
		FirstName: request.FirstName,
		LastName: request.LastName,
		Email: request.Email,
		Address: request.Address,
		Country: request.Country,
		City: request.City,
		Zip: request.Zip,
	}

	tx := database.DB.Begin()

	if dbErr := tx.Create(&order).Error; dbErr != nil {
		fmt.Println("Error while creating Order", dbErr.Error())
		tx.Rollback()
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": dbErr.Error(),
		})
	}

	var lineItems []*stripe.CheckoutSessionLineItemParams

	for _, requestProduct := range request.Products {
		product := models.Product{}
		product.Id = uint(requestProduct["product_id"])
		database.DB.First(&product)

		total := product.Price * float64(requestProduct["quantity"])

		item := models.OrderItem{
			OrderId: order.Id,
			ProductTitle: product.Title,
			Price: product.Price,
			Quantity: uint(requestProduct["quantity"]),
			AmbassadorRevenue: 0.1 * total,
			AdminRevenue: 0.9 * total,
		}
		if dbErr := tx.Create(&item).Error; dbErr != nil {
			fmt.Println("Error while creating Order Item", dbErr.Error())
			tx.Rollback()
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": dbErr.Error(),
			})
		}

		lineItems = append(lineItems, &stripe.CheckoutSessionLineItemParams{
			Name: stripe.String(product.Title),
			Description: stripe.String(product.Description),
			Images: []*string{stripe.String(product.Image)},
			Amount: stripe.Int64(100 * int64(product.Price)),
			Currency: stripe.String("USD"),
			Quantity: stripe.Int64(int64(requestProduct["quantity"])),
		})
	}

	fmt.Println(lineItems)

	stripe.Key = ""

	params := stripe.CheckoutSessionParams{
		SuccessURL: stripe.String("http://localhost:5000/success?source={CHECKOUT_SESSION_ID}"),
		CancelURL: stripe.String("http://localhost:5000/error"),
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		LineItems: lineItems,
	}

	source, stripeErr := session.New(&params)
	if stripeErr != nil {
		tx.Rollback()
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Stripe Error",
		})
	}
	order.TransactionId = source.ID
	if dbErr := tx.Save(&order).Error; dbErr != nil {
		fmt.Println("Error while saving transaction", dbErr.Error())
		tx.Rollback()
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": dbErr.Error(),
		})
	}
	tx.Commit()
	return c.JSON(source)
}

func CompleteOrder(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	order := models.Order{}

	database.DB.Preload("OrderItems").First(&order, models.Order{
		TransactionId: data["source"],
	})

	if order.Id == 0 {
		c.Status(fiber.StatusNotFound)
		c.JSON(fiber.Map{
			"message": "Order Not Found",
		})
	}

	order.Complete = true
	database.DB.Save(&order)

	go func(order models.Order) {
		ambassadorRevenue := 0.0
		adminRevenue := 0.0

		for _, item := range order.OrderItems {
			ambassadorRevenue += item.AmbassadorRevenue
			adminRevenue += item.AdminRevenue
		}

		user := models.User{}
		user.Id = order.UserId

		database.DB.First(&user)
		database.Cache.ZIncrBy(context.Background(), "rankings", ambassadorRevenue, user.Name())

		ambassadorMessage := []byte(fmt.Sprintf("You earned $%f from the link %s", ambassadorRevenue, order.Code))
		smtp.SendMail("host.docker.internal:1025", nil, "no-reply@email.com", []string{order.AmbassadorEmail}, ambassadorMessage)

		adminMessage := []byte(fmt.Sprintf("Order of $%d with a total of $%f has been completed", order.Id, adminRevenue))
		smtp.SendMail("host.docker.internal:1025", nil, "no-reply@email.com", []string{"admin@admin.com"}, adminMessage)
	}(order)

	return c.JSON(fiber.Map{
		"message": "Order Complete",
	})
}
