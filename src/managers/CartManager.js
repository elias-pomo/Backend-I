import fs from "fs/promises";

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  generateId() {
    return this.carts.length > 0
      ? Math.max(...this.carts.map((cart) => cart.id)) + 1
      : 1;
  }

  async createCart() {
    const newCart = {
      id: this.generateId(),
      products: [],
    };
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(id) {
    return this.carts.find((cart) => cart.id === id);
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    if (!cart) {
      console.error(`Carrito con ID ${cartId} no encontrado.`);
      return null;
    }

    const existingProduct = cart.products.find(
      (item) => item.product === productId
    );

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.saveCarts();
    return cart;
  }
}

export default CartManager;
