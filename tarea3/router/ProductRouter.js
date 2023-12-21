import express from 'express';
import { ProductManager } from '../src/ProductManager.js';

const productRouter = express.Router();
const productManager = ProductManager.getInstance('./productos.json');

productRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts(limit);
        res.json({ products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

productRouter.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

productRouter.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const result = productManager.addProduct(newProduct);
        if (result.error) {
            res.status(400).json({ error: result.error });
        } else {
            res.json({ status: 'Producto agregado correctamente' });
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

productRouter.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = req.body;
        const result = productManager.updateProduct(productId, updatedProduct);
        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.json({ status: 'Producto actualizado correctamente' });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

productRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const result = productManager.deleteProduct(productId);
        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.json({ status: 'Producto eliminado correctamente' });
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default productRouter;
