package controllers

import (
	"ambassador/src/database"
	"ambassador/src/models"
	"context"
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"sort"
	"strconv"
	"strings"
	"time"
)

func Products(c *fiber.Ctx) error {
	var products []models.Product

	database.DB.Find(&products)

	return c.JSON(products)
}

func CreateProduct(c *fiber.Ctx) error {
	var product models.Product

	if err := c.BodyParser(&product); err != nil {
		return err
	}

	database.DB.Create(&product)
	go database.ClearChannel("products_backend", "products_frontend")
	return c.JSON(product)
}

func GetProduct(c *fiber.Ctx) error {
	var product models.Product

	id, _:= strconv.Atoi(c.Params("id"))

	product.Id = uint(id)
	database.DB.Find(&product)
	return c.JSON(product)
}

func UpdateProduct(c *fiber.Ctx) error {
	var product models.Product

	if err := c.BodyParser(&product); err != nil {
		return err
	}

	id, _:= strconv.Atoi(c.Params("id"))

	product.Id = uint(id)

	database.DB.Model(&product).Updates(&product)

	// database.Cache.Del(context.Background(), "products_backend", "products_frontend")
	// go routines - executed in background
	//go deleteCache("products_backend")
	//go deleteCache("products_frontend")
	go database.ClearChannel("products_backend", "products_frontend")
	return c.JSON(product)
}

//func deleteCache(key string) {
//	time.Sleep(5 * time.Second)
//	database.Cache.Del(context.Background(), key)
//}

func DeleteProduct(c *fiber.Ctx) error {
	var product models.Product

	id, _:= strconv.Atoi(c.Params("id"))

	product.Id = uint(id)
	database.DB.Delete(&product)
	go database.ClearChannel("products_backend", "products_frontend")
	return c.JSON(fiber.Map{
		"message": "Product Deleted",
	})
}

func ProductsFrontEnd(c *fiber.Ctx) error {
	var products []models.Product
	var ctx = context.Background()

	result, err := database.Cache.Get(ctx, "products_frontend").Result()

	if err != nil {
		database.DB.Find(&products)

		// To set values convert them to bytes, or else we receive error
		bytes, jsonErr := json.Marshal(products)

		if jsonErr != nil {
			panic(jsonErr)
		}

		if redisSetErr := database.Cache.Set(ctx, "products_frontend", bytes, 30*time.Minute).Err(); redisSetErr != nil {
			panic(redisSetErr)
		}
	} else {
		json.Unmarshal([]byte(result), &products)
	}
	return c.JSON(products)
}

func ProductsBackEnd(c *fiber.Ctx) error {
	var products []models.Product
	var ctx = context.Background()

	result, err := database.Cache.Get(ctx, "products_backend").Result()

	if err != nil {
		database.DB.Find(&products)

		// To set values convert them to bytes, or else we receive error
		bytes, jsonErr := json.Marshal(products)

		if jsonErr != nil {
			panic(jsonErr)
		}

		if redisSetErr := database.Cache.Set(ctx, "products_backend", bytes, 30*time.Minute).Err(); redisSetErr != nil {
			panic(redisSetErr)
		}
	} else {
		json.Unmarshal([]byte(result), &products)
	}

	var searchProducts []models.Product

	if s := c.Query("s"); s != "" {
		lower := strings.ToLower(s)
		for _, product := range products {
			if strings.Contains(strings.ToLower(product.Title), lower) || strings.Contains(strings.ToLower(product.Description), lower) {
				searchProducts = append(searchProducts, product)
			}
		}
	} else {
		searchProducts = products
	}

	if sortParam := c.Query("sort"); sortParam != "" {
		sortLower := strings.ToLower(sortParam)
		if sortLower == "asc" {
			sort.Slice(searchProducts, func(i, j int) bool {
				return searchProducts[i].Price < searchProducts[j].Price
			})
		} else if sortLower == "desc" {
			sort.Slice(searchProducts, func(i, j int) bool {
				return searchProducts[i].Price > searchProducts[j].Price
			})
		}
	}

	var total = len(searchProducts)
	pageParam, _ := strconv.Atoi(c.Query("page", "1"))
	perPage := 9
	var paginatedData []models.Product

	if total <= pageParam * perPage && total >= (pageParam - 1) * perPage {
		paginatedData = searchProducts[(pageParam - 1) * perPage : total]
	} else if total >= pageParam * perPage {
		paginatedData = searchProducts[(pageParam - 1) * perPage : pageParam * perPage]
	} else {
		paginatedData = []models.Product{}
	}

	return c.JSON(fiber.Map{
		"data": paginatedData[(pageParam - 1) * perPage : pageParam * perPage],
		"total": total,
		"page" : pageParam,
		"last_page": total / perPage + 1,
	})
}