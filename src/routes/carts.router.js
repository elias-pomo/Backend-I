import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./data/carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  if (isNaN(cid)) {
    return res
      .status(400)
      .json({ error: "El ID del carrito debe ser un número." });
  }
  const cart = await cartManager.getCartById(cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: "Carrito no encontrado." });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  if (isNaN(cid) || isNaN(pid)) {
    return res
      .status(400)
      .json({ error: "Los IDs de carrito y producto deben ser números." });
  }

  const cart = await cartManager.addProductToCart(cid, pid);
  if (cart) {
    res.json({
      message: `Producto con ID ${pid} agregado al carrito con ID ${cid}.`,
      cart,
    });
  } else {
    res.status(404).json({ error: "Carrito no encontrado." });
  }
});

export default router;
