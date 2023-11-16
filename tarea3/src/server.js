import express from 'express';
import ProductManager from './ProductManager';

const app = express();
const PORT = 5000;
const productManager = new ProductManager('./productos.json');

app.use(express.json());

function sendError(res, status, message) {
    res.status(status).json({ error: message });
}

app.get('/products', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit);
        if (isNaN(limit)) {
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

app.get('/products/:pid', async (req, res, next) => {
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    sendError(res, 500, 'Error interno del servidor');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
