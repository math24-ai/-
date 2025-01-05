const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();

// 配置ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 配置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 使用 URL 编码解析
app.use(express.urlencoded({ extended: true }));

// 首页：显示商品列表
app.get('/', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.render('index', { products });
});

// 添加商品到购物车
app.post('/add-to-cart', (req, res) => {
    const { product_id, quantity } = req.body;
    const checkIfInCart = db.prepare('SELECT * FROM cart WHERE product_id = ?').get(product_id);
    if (checkIfInCart) {
        db.prepare('UPDATE cart SET quantity = quantity + ? WHERE product_id = ?').run(quantity, product_id);
    } else {
        db.prepare('INSERT INTO cart (product_id, quantity) VALUES (?, ?)').run(product_id, quantity);
    }
    res.redirect('/');
});

// 查看购物车
app.get('/cart', (req, res) => {
    const cartItems = db.prepare(`
    SELECT p.name, p.price, p.image, c.quantity, (p.price * c.quantity) AS total, p.id AS product_id
    FROM cart c
    JOIN products p ON c.product_id = p.id
  `).all();

    const cartTotal = cartItems.reduce((total, item) => total + item.total, 0);

    res.render('cart', { cartItems, cartTotal });
});

// 删除购物车中的商品
app.post('/remove-from-cart', (req, res) => {
    const { product_id } = req.body;
    if (!product_id) {
        return res.redirect('/cart');
    }
    db.prepare('DELETE FROM cart WHERE product_id = ?').run(product_id);

    // 删除后重新加载购物车
    const cartItems = db.prepare(`
    SELECT p.name, p.price, p.image, c.quantity, (p.price * c.quantity) AS total, p.id AS product_id
    FROM cart c
    JOIN products p ON c.product_id = p.id
  `).all();

    res.redirect('/cart');
});

// 结算页面
app.get('/checkout', (req, res) => {
    res.render('checkout');
});

// 处理结算
app.post('/checkout', (req, res) => {
    const { name, address } = req.body;
    db.prepare('DELETE FROM cart').run();
    res.render('thankyou', { name, address });
});

app.listen(3000, () => {
    console.log('服务器正在运行于 - http://localhost:3000');
});
