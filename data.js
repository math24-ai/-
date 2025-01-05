const db = require('./db');

// 示例商品数据，包括图片
const products = [
    { name: '商品1', price: 1.5, description: 'Fresh red apple', image: 'image_1.jpg' },
    { name: '商品2', price: 0.8, description: 'Ripe yellow banana', image: 'image_2.jpg' },
    { name: '商品3', price: 1.2, description: 'Juicy orange', image: 'image_3.jpg' }
];

// 插入商品数据
const insertProduct = db.prepare(`
  INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)
`);

products.forEach(product => {
    insertProduct.run(product.name, product.price, product.description, product.image);
});

console.log('插入成功!');
