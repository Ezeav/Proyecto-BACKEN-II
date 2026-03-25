import { Router } from "express";

import { current } from "../middlewares/current.js";
import { requireRole } from "../middlewares/requireRole.js";
import { cartRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/product.repository.js";

const router = Router();

const assertCartOwner = (req, cartId) => {
  const userCartId = req.user?.cart;
  if (!userCartId) return false;
  return userCartId.toString() === cartId.toString();
};

router.get("/:cartId", current, requireRole(["user"]), async (req, res, next) => {
  try {
    const { cartId } = req.params;
    if (!assertCartOwner(req, cartId)) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: not your cart",
      });
    }

    const cart = await cartRepository.findById(cartId);
    return res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:cartId/products",
  current,
  requireRole(["user"]),
  async (req, res, next) => {
    try {
      const { cartId } = req.params;
      if (!assertCartOwner(req, cartId)) {
        return res.status(403).json({
          status: "error",
          message: "Forbidden: not your cart",
        });
      }

      const { productId, quantity } = req.body || {};

      if (!productId) {
        return res.status(400).json({
          status: "error",
          message: "productId is required",
        });
      }

      const product = await productRepository.findById(productId);
      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Product not found",
        });
      }

      const updatedCart = await cartRepository.addProduct({
        cartId,
        productId,
        quantity,
      });

      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

