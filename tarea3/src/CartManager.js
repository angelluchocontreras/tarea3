import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];

        if (fs.existsSync(this.path)) {
            try {
                const data = fs.readFileSync(this.path, 'utf-8');
                if (data.trim() !== '') {
                    this.carts = JSON.parse(data);
                }
            } catch (error) {
                console.error('Error al cargar los carritos desde el archivo:', error);
            }
        }
    }

    saveCarts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, '\t'));
            console.log('Carritos guardados con éxito');
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
        }
    }

    addCart() {
        try {
            const cart = {
                id: this.generateCartId(),
                products: []
            };
            this.carts.push(cart);
            this.saveCarts();
            return cart;
        } catch (error) {
            console.log(error);
        }
    }
    
    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    addToCart(cartId, product) {
        const cart = this.getCartById(cartId);
        if (cart) {
            const existingProduct = cart.products.find(p => p.id === product.id);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ id: product.id, quantity: 1 });
            }

            this.saveCarts();
            return cart;
        }

        return null; 
    }

  

    generateCartId() {
        
        return Date.now().toString();
    }
}

export default CartManager;
