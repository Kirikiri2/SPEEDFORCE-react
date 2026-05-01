// server.js
// ===========================
//        ИМПОРТЫ
// ===========================
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('./database');

// ===========================
//     ИНИЦИАЛИЗАЦИЯ
// ===========================
const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database();

// ===========================
//       MIDDLEWARE
// ===========================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, '../images'))); // если у тебя есть папка images

// Простой мидлвер для роли (пока через заголовок x-role)
function checkAdmin(req, res, next) {
    const role = (req.headers["x-role"] || '').toString();
    if (role !== "admin") {
        return res.status(403).json({ success: false, error: "Access denied: admin only" });
    }
    next();
}

// Вшиваем объект db в req если нужно в middleware/роутах
app.use((req, res, next) => {
    req.db = db;
    next();
});

// ===========================
//      КОРНЕВЫЕ МАРШРУТЫ
// ===========================

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, status: 'ok', time: new Date().toISOString() });
});

// Root — краткая информация и список важных эндпойнтов
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API работает',
        server_time: new Date().toISOString(),
        docs: {
            health: 'GET /health',
            api_root: 'GET /api',
            auth: {
                register: 'POST /api/register',
                login: 'POST /api/login'
            },
            products: {
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:id',
                create: 'POST /api/admin/products (admin)',
                update: 'PUT /api/admin/products/:id (admin)',
                delete: 'DELETE /api/admin/products/:id (admin)'
            },
            categories: {
                getAll: 'GET /api/categories',
                getById: 'GET /api/categories/:id',
                create: 'POST /api/admin/categories (admin)',
                update: 'PUT /api/admin/categories/:id (admin)',
                delete: 'DELETE /api/admin/categories/:id (admin)'
            },
            shops: {
                getAll: 'GET /api/shops',
                create: 'POST /api/admin/shops (admin)',
                update: 'PUT /api/admin/shops/:id (admin)',
                delete: 'DELETE /api/admin/shops/:id (admin)'
            },
            sales: {
                getAll: 'GET /api/sales',
                create: 'POST /api/admin/sales',
                update: 'PUT /api/admin/sales/:id (admin)',
                delete: 'DELETE /api/admin/sales/:id (admin)',
                stats: 'GET /api/sales/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD'
            },
            reviews: {
                byProduct: 'GET /api/products/:id/reviews',
                byUser: 'GET /api/users/:id/reviews',
                create: 'POST /api/reviews'
            },
            users: {
                getAll: 'GET /api/admin/users (admin)',
                getById: 'GET /api/admin/users/:id (admin)',
                create: 'POST /api/admin/users (admin)',
                update: 'PUT /api/admin/users/:id (admin)',
                delete: 'DELETE /api/admin/users/:id (admin)'
            }
        },
    });
});

// Более подробный API-root (можно вернуть то же самое или расширить)
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'API root. Use / (root) for endpoints list.',
    });
});

// ===========================
//  АУТЕНТИФИКАЦИЯ (PUBLIC)
// ===========================
app.post('/api/register', async (req, res) => {
    try {
        const result = await db.register(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const result = await db.login(req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// ===========================
//      ПУБЛИЧНЫЕ API
// ===========================
app.get('/api/products', async (req, res) => {
    try {
        const items = await db.getAllProducts();
        res.json({ success: true, count: items.length, data: items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await db.getProductById(parseInt(req.params.id));
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(404).json({ success: false, error: err.message });
    }
});

app.get('/api/products/:id/reviews', async (req, res) => {
    try {
        const reviews = await db.getReviewsByProductId(parseInt(req.params.id));
        res.json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await db.getAllCategories();
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/categories/:id', async (req, res) => {
    try {
        const category = await db.getCategoryById(req.params.id);
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(404).json({ success: false, error: err.message });
    }
});


app.get('/api/shops', async (req, res) => {
    try {
        const items = await db.getAllShops();
        res.json({ success: true, count: items.length, data: items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/sales', async (req, res) => {
    try {
        const items = await db.getAllSales();
        res.json({ success: true, count: items.length, data: items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// ===========================
//         АДМИН API
// ===========================
// Эндпоинты для управления пользователями (только для админа)
app.get('/api/admin/users', checkAdmin, async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/users/:id', checkAdmin, async (req, res) => {
    try {
        const user = await db.getUserById(req.params.id);
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/users', checkAdmin, async (req, res) => {
    try {
        const { email, passwordHash, role } = req.body;
        const newUser = await db.createUser(email, passwordHash, role);
        res.json({ success: true, data: newUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/users/:id', checkAdmin, async (req, res) => {
    try {
        const { email, role } = req.body;
        const updatedUser = await db.updateUser(req.params.id, email, role);
        res.json({ success: true, data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/users/:id', checkAdmin, async (req, res) => {
    try {
        const deletedUser = await db.deleteUser(req.params.id);
        res.json({ success: true, data: deletedUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// PRODUCTS
app.post('/api/admin/products', checkAdmin, async (req, res) => {
    try {
        const result = await db.createProduct(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/products/:id', checkAdmin, async (req, res) => {
    try {
        const result = await db.updateProduct(parseInt(req.params.id), req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/products/:id', checkAdmin, async (req, res) => {
    try {
        await db.deleteProduct(parseInt(req.params.id));
        res.json({ success: true, message: "Product deleted" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// CATEGORIES
app.post('/api/admin/categories', checkAdmin, async (req, res) => {
    try {
        const category = await db.createCategory(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/categories/:id', checkAdmin, async (req, res) => {
    try {
        const result = await db.updateCategory(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/categories/:id', checkAdmin, async (req, res) => {
    try {
        await db.deleteCategory(req.params.id);
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// SHOPS
app.post('/api/admin/shops', checkAdmin, async (req, res) => {
    try {
        const result = await db.createShop(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/shops/:id', checkAdmin, async (req, res) => {
    try {
        const result = await db.updateShop(parseInt(req.params.id), req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/shops/:id', checkAdmin, async (req, res) => {
    try {
        await db.deleteShop(parseInt(req.params.id));
        res.json({ success: true, message: "Shop deleted" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// SALES
// Создание новой продажи
app.post('/api/admin/sales', checkAdmin, async (req, res) => {
    try {
        const { product_id, shop_id, quantity, total_price } = req.body;

        // Можно добавить базовую проверку
        if (!product_id || !shop_id || !quantity || !total_price) {
            return res.status(400).json({ success: false, error: "Все поля обязательны" });
        }

        const result = await db.createSale({
            product_id: parseInt(product_id),
            shop_id: parseInt(shop_id),
            quantity: parseInt(quantity),
            total_price: parseFloat(total_price)
        });

        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
app.put('/api/admin/sales/:id', checkAdmin, async (req, res) => {
    try {
        const result = await db.updateSale(parseInt(req.params.id), req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/sales/:id', checkAdmin, async (req, res) => {
    try {
        await db.deleteSale(parseInt(req.params.id));
        res.json({ success: true, message: "Sale deleted" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});






// ===========================
//     ГЛОБАЛЬНАЯ ОБРАБОТКА ОШИБОК
// ===========================
app.use((error, req, res, next) => {
    console.error('Ошибка сервера:', error);
    res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера'
    });
});

// ===========================
//       ЗАПУСК СЕРВЕРА
// ===========================
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Грейсфул-шатдаун: закрываем БД по SIGINT/SIGTERM
async function gracefulShutdown() {
    console.log('\nShutting down server...');
    if (db && typeof db.close === 'function') {
        try {
            await db.close();
            console.log('DB connection closed.');
        } catch (err) {
            console.error('Error closing DB:', err);
        }
    }
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
