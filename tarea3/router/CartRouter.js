import express from 'express';
import CartManager from './CartManager';

const cartRouter = express.Router();
const cartManager = new CartManager('./carritos.json');

cartRouter.post('/', (req, res) => {
    const newCart = req.body;
    const createdCart = cartManager.addCart(newCart);
    res.json({ cart: createdCart });
});

cartRouter.get('/:cartId', (req, res) => {
    const cartId = req.params.cartId;
    const cart = cartManager.getCartById(cartId);
    if (cart) {
        res.json({ cart });
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

cartRouter.post('/:cartId/product/:productId', (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const cart = cartManager.addToCart(cartId, { id: productId });
    
    if (cart) {
        res.json({ cart });
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

export default cartRouter;
