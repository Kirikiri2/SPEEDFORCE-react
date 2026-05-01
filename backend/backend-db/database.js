// Импортируем модуль sqlite3
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    // Конструктор объекта класса
    constructor() {
        // Путь к базе данных
        this.dbPath = path.join(__dirname, 'database.db');
        this.db = null;
        this.init();
    }

    // Метод инициализации базы данных
    init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Ошибка при подключении к базе данных:', err.message);
                    reject(err);
                } else {
                    console.log('База данных подключена успешно');
                    this.createTables()
                        .then(() => resolve())
                        .catch(reject);
                }
            });
        });
    }

    // Метод для создания таблиц для БД
    createTables() {
        return new Promise((resolve, reject) => {
            const createTablesQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    email TEXT UNIQUE,
                    password TEXT NOT NULL,
                    role TEXT DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    price REAL,
                    description TEXT,
                    image_url TEXT,
                    category_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(category_id) REFERENCES categories(id)
                );

                    CREATE TABLE IF NOT EXISTS categories (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT UNIQUE NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        image_url TEXT
                    );

                CREATE TABLE IF NOT EXISTS reviews (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    product_id INTEGER NOT NULL,
                    review TEXT NOT NULL,
                    stars INTEGER CHECK (stars >= 1 AND stars <= 5) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES users(id),
                    FOREIGN KEY(product_id) REFERENCES products(id)
                );

                CREATE TABLE IF NOT EXISTS shops (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    address TEXT,
                    phone TEXT,
                    latitude REAL, -- широта
                    longitude REAL, -- долгота
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE IF NOT EXISTS sales (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_id INTEGER NOT NULL,
                    shop_id INTEGER,
                    quantity INTEGER NOT NULL,
                    total_price REAL NOT NULL,
                    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(product_id) REFERENCES products(id),
                    FOREIGN KEY(shop_id) REFERENCES shops(id)
                );
            `;

            this.db.exec(createTablesQuery, (err) => {
                if (err) {
                    console.error('Ошибка при создании таблиц:', err.message);
                    reject(err);
                } else {
                    console.log('Таблицы созданы успешно');
                    resolve();
                }
            });
        });
    }

    // Метод для регистрации пользователя
    register({ name, email, password }) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')`;
            this.db.run(query, [name, email, password], function (err) {
                if (err) return reject(err);
                resolve({ id: this.lastID });
            });
        });
    }

    // Метод для авторизации пользователя
    login({ email, password }) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, name, email, role, created_at 
                FROM users 
                WHERE email = ? AND password = ?
            `;
            this.db.get(query, [email, password], (err, row) => {
                if (err) return reject(err);
                if (!row) return reject(new Error("Invalid credentials"));
                resolve(row);
            });
        });
    }
    // Метод для получения всех товаров
    getAllProducts() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    p.id,
                    p.name,
                    p.price,
                    p.description,
                    p.image_url,
                    c.name AS category,
                    p.created_at
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                ORDER BY p.created_at DESC
            `;
            this.db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Метод для получения одного товара по ID
    getProductById(productId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    p.*,
                    c.name AS category
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
            `;
            this.db.get(query, [productId], (err, row) => {
                if (err) reject(err);
                else if (!row) reject(new Error('Товар не найден'));
                else resolve(row);
            });
        });
    }


    // Метод для получения отзывов по product_id
    getReviewsByProductId(productId) {
        return new Promise((resolve, reject) => {
            if (!productId) {
                return reject(new Error('ID товара обязателен'));
            }

            const query = `
            SELECT
                r.id,
                r.user_id,
                r.product_id,
                r.review,
                r.stars,
                r.created_at,
                u.name as user_name
            FROM reviews r
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `;

            this.db.all(query, [productId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Метод для получения отзывов по user_id
    getReviewsByUserId(userId) {
        return new Promise((resolve, reject) => {
            if (!userId) {
                return reject(new Error('ID пользователя обязателен'));
            }

            const query = `
            SELECT
                r.id,
                r.user_id,
                r.product_id,
                r.review,
                r.stars,
                r.created_at,
                p.name as product_name
            FROM reviews r
            LEFT JOIN products p ON r.product_id = p.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `;

            this.db.all(query, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Метод для оставления отзыва по product_id
    createReview(reviewData) {
        return new Promise((resolve, reject) => {
            const { user_id, product_id, review, stars } = reviewData;

            // Валидация обязательных полей
            if (!user_id || !product_id || !review || !stars) {
                return reject(new Error('Все поля обязательны для заполнения'));
            }

            // Валидация оценки
            if (stars < 1 || stars > 5) {
                return reject(new Error('Оценка должна быть от 1 до 5 звезд'));
            }

            const query = `
            INSERT INTO reviews (user_id, product_id, review, stars)
            VALUES (?, ?, ?, ?)
        `;

            this.db.run(query, [user_id, product_id, review, stars], function(err) {
                if (err) {
                    if (err.message.includes('FOREIGN KEY constraint failed')) {
                        reject(new Error('Пользователь или товар не существует'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({
                        id: this.lastID,
                        user_id,
                        product_id,
                        review,
                        stars,
                        message: 'Отзыв успешно добавлен'
                    });
                }
            });
        });
    }

    // Метод для получения всех магазинов
    getAllShops() {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT
                id,
                address,
                phone,
                latitude,
                longitude,
                created_at
            FROM shops
            ORDER BY created_at DESC
        `;

            this.db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Метод для создания товара
    createProduct({ name, price, description, image_url, category_id }) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO products (name, price, description, image_url, category_id)
                VALUES (?, ?, ?, ?, ?)
            `;
            this.db.run(
                query,
                [name, price, description, image_url, category_id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                }
            );
        });
    }


    updateProduct(id, { title, price, shop_id }) {
        return new Promise((resolve, reject) => {
            const q = `UPDATE products SET title=?, price=?, shop_id=? WHERE id=?`;
            this.db.run(q, [title, price, shop_id, id], function (err) {
                if (err) return reject(err);
                resolve({ updated: this.changes });
            });
        });
    }

    deleteProduct(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }
    getAllCategories() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, name, created_at, image_url
                FROM categories
                ORDER BY name
            `;
            this.db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getCategoryById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM categories WHERE id = ?`;
            this.db.get(query, [id], (err, row) => {
                if (err) reject(err);
                else if (!row) reject(new Error('Категория не найдена'));
                else resolve(row);
            });
        });
    }
    createCategory({ name }) {
        return new Promise((resolve, reject) => {
            if (!name) return reject(new Error('Название категории обязательно'));

            const query = `INSERT INTO categories (name) VALUES (?)`;
            this.db.run(query, [name], function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, name });
            });
        });
    }

    updateCategory(id, { name }) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE categories SET name = ? WHERE id = ?`;
            this.db.run(query, [name, id], function (err) {
                if (err) reject(err);
                else resolve({ updated: this.changes });
            });
        });
    }

    deleteCategory(id) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM categories WHERE id = ?`;
            this.db.run(query, [id], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }



    createShop({ name, address }) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO shops (name, address) VALUES (?, ?)`;
            this.db.run(query, [name, address], function (err) {
                if (err) return reject(err);
                resolve({ id: this.lastID });
            });
        });
    }

    updateShop(id, { name, address }) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE shops SET name=?, address=? WHERE id=?`,
                [name, address, id],
                function (err) {
                    if (err) return reject(err);
                    resolve({ updated: this.changes });
                }
            );
        });
    }

    deleteShop(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM shops WHERE id=?`, [id], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    // Добавление продажи
    createSale(saleData) {
        return new Promise((resolve, reject) => {
            const { product_id, shop_id, quantity, total_price, sale_date } = saleData;
            if (!product_id || !quantity || !total_price) {
                return reject(new Error('Обязательны product_id, quantity и total_price'));
            }

            const query = `
                INSERT INTO sales (product_id, shop_id, quantity, total_price, sale_date)
                VALUES (?, ?, ?, ?, ?)
            `;

            this.db.run(query, [product_id, shop_id || null, quantity, total_price, sale_date || new Date()], function(err) {
                if (err) reject(err);
                else resolve({
                    id: this.lastID,
                    product_id,
                    shop_id,
                    quantity,
                    total_price,
                    sale_date: sale_date || new Date(),
                    message: 'Продажа добавлена'
                });
            });
        });
    }

    updateSale(id, { amount, date }) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE sales SET amount=?, date=? WHERE id=?`,
                [amount, date, id],
                function (err) {
                    if (err) return reject(err);
                    resolve({ updated: this.changes });
                }
            );
        });
    }

    deleteSale(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM sales WHERE id=?`, [id], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    // Получение всех продаж
    getAllSales() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.id, s.product_id, s.shop_id, s.quantity, s.total_price, s.sale_date,
                    p.name as product_name, sh.address as shop_address
                FROM sales s
                LEFT JOIN products p ON s.product_id = p.id
                LEFT JOIN shops sh ON s.shop_id = sh.id
                ORDER BY s.sale_date DESC
            `;
            this.db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }




     // Получить всех пользователей
    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT id, email, role, created_at FROM users`, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Получить пользователя по id
    getUserById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT id, email, role, created_at FROM users WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // Создать пользователя
    createUser(email, passwordHash, role = 'user') {
        return new Promise((resolve, reject) => {
            const stmt = `INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, ?)`;
            this.db.run(stmt, [email, passwordHash, role, new Date().toISOString()], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, email, role });
            });
        });
    }

    // Обновить пользователя
    updateUser(id, email, role) {
        return new Promise((resolve, reject) => {
            const stmt = `UPDATE users SET email = ?, role = ? WHERE id = ?`;
            this.db.run(stmt, [email, role, id], function(err) {
                if (err) reject(err);
                else resolve({ id, email, role });
            });
        });
    }

    // Удалить пользователя
    deleteUser(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
                if (err) reject(err);
                else resolve({ id });
            });
        });
    }

    // Метод для закрытия соединения
    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Соединение с базой данных закрыто');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

// Экспорт класса
module.exports = Database;