import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  if (isNaN(pid)) {
    return res
      .status(400)
      .json({ error: "El ID del producto debe ser un número." });
  }
  const product = await productManager.getProductById(pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado." });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al agregar el producto", details: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  if (isNaN(pid)) {
    return res
      .status(400)
      .json({ error: "El ID del producto debe ser un número." });
  }
  const updatedProduct = await productManager.updateProduct(pid, req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: "Producto no encontrado." });
  }
});

router.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  if (isNaN(pid)) {
    return res
      .status(400)
      .json({ error: "El ID del producto debe ser un número." });
  }
  const deleted = await productManager.deleteProduct(pid);
  if (deleted) {
    res.status(204).send(); // 204 No Content para indicar éxito sin cuerpo
  } else {
    res.status(404).json({ error: "Producto no encontrado." });
  }
});

export default router;
