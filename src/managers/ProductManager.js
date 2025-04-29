import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  generateId() {
    return this.products.length > 0
      ? Math.max(...this.products.map((product) => product.id)) + 1
      : 1;
  }

  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      console.error("Todos los campos son obligatorios.");
      return;
    }
    if (this.products.some((p) => p.code === product.code)) {
      console.error(`El código '${product.code}' ya existe.`);
      return;
    }
    const newProduct = {
      id: this.generateId(),
      status: true,
      thumbnails: [],
      ...product,
    };
    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  async updateProduct(id, updatedFields) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedFields,
        id: this.products[index].id,
      };
      await this.saveProducts();
      return this.products[index];
    }
    return null;
  }

  async deleteProduct(id) {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.id !== id);
    if (this.products.length < initialLength) {
      await this.saveProducts();
      return true;
    }
    return false;
  }
}

export default ProductManager;
