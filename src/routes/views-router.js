import express from "express";
import ProductManager from "../managers/product-manager-db.js";
import CartManager from "../managers/cart-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 2 } = req.query;
      const products = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const nuevoArray = products.docs.map(product => {
         const { _id, ...rest } = product.toObject();
         return rest;
      });

      res.render("products", {
         products: nuevoArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages
      });

   } catch (error) {
      console.error("Error al obtener los productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error del servidor"
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const cart = await cartManager.getCartById(cartId);

      if (!cart) {
         console.log("No existe el carrito");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productsCart = cart.products.map(item => ({
         product: item.product.toObject(),
         quantity: item.quantity
      }));

      res.render("carts", { products: productsCart });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error del servidor" });
   }
});

export default router;