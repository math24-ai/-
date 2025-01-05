const db = require('./db');

const products = [
    { name: '商品1', price: 11.5, description: '这是商品1', image: 'image_1.jpg' },
    { name: '商品2', price: 24.2, description: '这是商品2', image: 'image_2.jpg' },
    { name: '商品3', price: 36.0, description: '这是商品3', image: 'image_3.jpg' },
    { name: '商品4', price: 55.5, description: '这是商品4', image: 'image_4.jpg' }
];

// 插入商品数据
const insertProduct = db.prepare(`
  INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)
`);

products.forEach(product => {
    insertProduct.run(product.name, product.price, product.description, product.image);
});

console.log('插入成功!');
