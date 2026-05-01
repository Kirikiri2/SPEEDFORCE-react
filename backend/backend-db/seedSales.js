const Database = require('./database');
const db = new Database();

async function seedSalesPie() {
    // Ждём инициализацию БД
    await new Promise(resolve => setTimeout(resolve, 500));

    const products = await db.getAllProducts();
    const shops = await db.getAllShops();

    if (!products.length) {
        console.log('❌ Нет продуктов — продажи не созданы');
        await db.close();
        return;
    }

    const categoryStats = {};

    for (let i = 0; i < 80; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const shop = shops.length
            ? shops[Math.floor(Math.random() * shops.length)]
            : null;

        const quantity = Math.floor(Math.random() * 5) + 1;
        const total_price = quantity * product.price;

        // случайная дата за последние 30 дней
        const daysAgo = Math.floor(Math.random() * 30);
        const sale_date = new Date();
        sale_date.setDate(sale_date.getDate() - daysAgo);

        // категория (ИМЕННО ТАК у тебя в getAllProducts)
        const categoryName = product.category || 'Без категории';
        categoryStats[categoryName] =
            (categoryStats[categoryName] || 0) + quantity;

        await db.createSale({
            product_id: product.id,
            shop_id: shop ? shop.id : null,
            quantity,
            total_price,
            sale_date
        });
    }

    console.log('✅ Seeder продаж выполнен');
    console.log('📊 Продажи по категориям (для Pie Chart):');
    console.table(categoryStats);

    await db.close();
}

seedSalesPie();
