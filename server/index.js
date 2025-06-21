const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const products = [
    { id: 11, name: 'candy', price: 4.99 },
    { id: 10, name: 'book', price: 9.97 },
    { id: 3, name: 'webcam', price: 99.95 },
];

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

app.post('/api/checkout', (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(201).json({ message: 'Checkout successful', product })
});


// views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render('index');
})


app.listen(PORT, () => {
    console.log('mock server running on http://localhost:' + PORT);
})