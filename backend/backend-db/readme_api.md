# **API Documentation**

Документация для backend-сервиса (Node.js + Express + SQLite).
Базовый URL:

```
http://localhost:3000/api
```

---

# **Содержание**

* [Аутентификация](#аутентификация)

  * [Регистрация](#регистрация-post-apiregister)
  * [Авторизация](#авторизация-post-apilogin)
* [Товары](#товары)

  * [Получить все товары](#получить-все-товары-get-apiproducts)
  * [Получить товар по ID](#получить-товар-по-id-get-apiproductsid)
  * [Создать товар](#создать-товар-post-apiproducts)
* [Отзывы](#отзывы)

  * [Получить отзывы товара](#получить-отзывы-по-product_id-get-apiproductsidreviews)
  * [Получить отзывы пользователя](#получить-отзывы-по-user_id-get-apiusersidreviews)
  * [Создать отзыв](#создать-отзыв-post-apireviews)
* [Магазины](#магазины)

  * [Получить все магазины](#получить-все-магазины-get-apishops)
  * [Создать магазин](#создать-магазин-post-apishops)
* [Корневой маршрут](#корневой-маршрут-get-)

---

# **Аутентификация**

## **Регистрация** (POST `/api/register`)

### **Описание**

Создание нового пользователя.

### **Тело запроса**

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "123456"
}
```

### **Успешный ответ**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "message": "Пользователь успешно зарегистрирован"
  }
}
```

### **Ошибки**

* Email уже существует
* Отсутствует email или пароль

---

## **Авторизация** (POST `/api/login`)

### **Тело запроса**

```json
{
  "email": "alice@example.com",
  "password": "123456"
}
```

### **Успешный ответ**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "created_at": "2025-11-22 10:00:00",
    "message": "Авторизация успешна"
  }
}
```

### **Ошибка**

```json
{
  "success": false,
  "error": "Неверный email или пароль"
}
```

---

# **Товары**

## **Получить все товары** (GET `/api/products`)

### **Ответ**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Phone",
      "price": 199.99,
      "description": "Great phone",
      "image_url": "/images/phone.png",
      "category": "electronics",
      "created_at": "2025-11-22 10:00:00"
    }
  ],
  "count": 1
}
```

---

## **Получить товар по ID** (GET `/api/products/:id`)

### **Пример запроса**

```
GET /api/products/5
```

### **Ответ**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Laptop",
    "price": 900,
    "description": "Powerful laptop",
    "image_url": "/images/laptop.png",
    "category": "electronics",
    "created_at": "2025-11-22 10:10:00"
  }
}
```

---

## **Создать товар** (POST `/api/products`)

### **Тело запроса**

```json
{
  "name": "New Product",
  "price": 150,
  "description": "Описание товара",
  "image_url": "/images/item.png",
  "category": "general"
}
```

### **Ответ**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "New Product",
    "price": 150,
    "description": "Описание товара",
    "image_url": "/images/item.png",
    "category": "general",
    "message": "Товар успешно создан"
  }
}
```

---

# **Отзывы**

## **Получить отзывы по product_id**

GET `/api/products/:id/reviews`

### Пример

```
GET /api/products/3/reviews
```

### Ответ

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 4,
      "product_id": 3,
      "review": "Отлично!",
      "stars": 5,
      "created_at": "2025-11-22 09:00:00",
      "user_name": "Alice"
    }
  ],
  "count": 1
}
```

---

## **Получить отзывы по user_id**

GET `/api/users/:id/reviews`

### Пример

```
GET /api/users/4/reviews
```

### Ответ

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 4,
      "product_id": 3,
      "review": "Отлично!",
      "stars": 5,
      "created_at": "2025-11-22 09:00:00",
      "product_name": "iPhone"
    }
  ],
  "count": 1
}
```

---

## **Создать отзыв**

POST `/api/reviews`

### **Тело запроса**

```json
{
  "user_id": 4,
  "product_id": 3,
  "review": "Хороший товар",
  "stars": 5
}
```

### **Ответ**

```json
{
  "success": true,
  "data": {
    "id": 15,
    "user_id": 4,
    "product_id": 3,
    "review": "Хороший товар",
    "stars": 5,
    "message": "Отзыв успешно добавлен"
  }
}
```

---

# **Магазины**

## **Получить все магазины**

GET `/api/shops`

### Ответ

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "address": "ул. Ленина 10",
      "phone": "+79995553322",
      "latitude": 55.75,
      "longitude": 37.61,
      "created_at": "2025-11-22 11:00:00"
    }
  ],
  "count": 1
}
```

---

## **Создать магазин**

POST `/api/shops`

### **Тело запроса**

```json
{
  "address": "ул. Новая, 15",
  "phone": "+79990001234",
  "latitude": 55.12,
  "longitude": 37.44
}
```

### **Ответ**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "address": "ул. Новая, 15",
    "phone": "+79990001234",
    "latitude": 55.12,
    "longitude": 37.44,
    "message": "Магазин успешно создан"
  }
}
```

---

# **Корневой маршрут**

GET `/`

### Ответ

```json
{
  "success": true,
  "message": "API работает",
  "endpoints": {
    "auth": {
      "register": "POST /api/register",
      "login": "POST /api/login"
    },
    "products": {
      "getAll": "GET /api/products",
      "getById": "GET /api/products/:id",
      "create": "POST /api/products"
    },
    "reviews": {
      "getByProduct": "GET /api/products/:id/reviews",
      "getByUser": "GET /api/users/:id/reviews",
      "create": "POST /api/reviews"
    },
    "shops": {
      "getAll": "GET /api/shops",
      "create": "POST /api/shops"
    }
  }
}
```

---

