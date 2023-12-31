import fs from 'fs';




export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.productIdCounter = 1;

        if (fs.existsSync(this.path)) {
            try {
                const data = fs.readFileSync(this.path, 'utf-8');
                if (data.trim() !== '') { 
                    this.products = JSON.parse(data);
                }
            } catch (error) {
                console.error('Error al cargar los productos desde el archivo:', error);
            }
        }
        
    }

    async saveProducts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
            console.log('Productos guardados con éxito');
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error('Error: Todos los campos son obligatorios.');
            return { error: 'Todos los campos son obligatorios.' };
        }
    
        if (this.products.some(existingProduct => existingProduct.code === product.code)) {
            console.error('Error: El código ya existe para otro producto.');
            return { error: 'El código ya existe para otro producto.' };
        }
    
        product.id = this.productIdCounter;
        this.productIdCounter++;
        this.products.push(product);
        this.saveProducts();
        return { product };
    }
    
    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            this.saveProducts();
            return { product: this.products[index] };
        } else {
            return { error: 'Producto no encontrado.' };
        }
    }
    
    deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveProducts();
            return { product: deletedProduct };
        } else {
            return { error: 'Producto no encontrado.' };
        }
    }

    getProducts(limit) {
        if (limit) {
            return { products: this.products.slice(0, limit) };
        } else {
            return { products: this.products };
        }
    }
    
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
   
    

    static getInstance(path) {
        if (!ProductManager.instance) {
            ProductManager.instance = new ProductManager(path);
        }
        return ProductManager.instance;
    }
}








