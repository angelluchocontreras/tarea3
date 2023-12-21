import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { ProductManager } from './ProductManager.js';
import cartRouter from './router/CartRouter.js';
import productRouter from './router/ProductRouter.js';
import expressHandlebars from "express-handlebars"

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = 5000;
const productManager = ProductManager.getInstance('./productos.json');


app.engine(
    'hbs',
    expressHandlebars({
        extname: 'hbs',
        defaultLayout: 'main',
    })
);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));


io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.emit('message', '¡Hola, usuario conectado!');

    socket.on('newProduct', (newProduct) => {
        productManager.addProduct(newProduct);

        io.emit('updateProducts', productManager.getProducts());
    });

    socket.on('deleteProduct', (productId) => {
        productManager.deleteProduct(productId);

        io.emit('updateProducts', productManager.getProducts());
    });
});
app.get('/', async (req, res) => {
    const products = obtenerProductos(); 
    res.render('home', { products });
  });
  app.get('/realtimeproducts', async (req, res) => {
    const products = obtenerProductos(); 
    res.render('realTimeProducts', { products });
  });

app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);

app.use(express.json());
function sendError(res, status, message) {
    res.status(status).json({ error: message });
}

app.get('/api/products', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit);
        if (limit && isNaN(limit)) {
            sendError(res, 400, 'El parámetro "limit" debe ser un número válido');
            return;
        }

        const products = await productManager.getProducts(limit);
        res.json({ products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        next(error);
    }
});

app.get('/api/products/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json({ product });
        } else {
            sendError(res, 404, 'Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener producto:', error);
        next(error);
    }
});

app.post('/api/products', async (req, res, next) => {
    try {
        const newProduct = req.body;
        productManager.addProduct(newProduct);
        res.json({ status: 'Producto agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar producto:', error);
        next(error);
    }
});

app.put('/api/products/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = req.body;
        productManager.updateProduct(productId, updatedProduct);
        res.json({ status: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        next(error);
    }
});

app.delete('/api/products/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid);
        productManager.deleteProduct(productId);
        res.json({ status: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        next(error);
    }
});

app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);  

app.use((err, req, res, next) => {
    console.error(err.stack);
    sendError(res, 500, 'Error interno del servidor');
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
