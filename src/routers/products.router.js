import { Router } from "express";

import { productRepository } from "../repositories/product.repository.js";
import { current } from "../middlewares/current.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await productRepository.findAll();
    res.json({ status: "success", payload: products });
  } catch (error) {
    next(error);
  }
});

router.get("/:pid", async (req, res, next) => {
  try {
    const product = await productRepository.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.json({ status: "success", payload: product });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  current,
  requireRole(["admin"]),
  async (req, res, next) => {
    try {
      const { title, description, price, stock } = req.body || {};

      const created = await productRepository.create({
        title,
        description,
        price: Number(price),
        stock: Number(stock),
      });

      res.status(201).json({ status: "success", payload: created });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:pid",
  current,
  requireRole(["admin"]),
  async (req, res, next) => {
    try {
      const updateData = {};
      const { title, description, price, stock } = req.body || {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = Number(price);
      if (stock !== undefined) updateData.stock = Number(stock);

      const updated = await productRepository.updateById(
        req.params.pid,
        updateData
      );

      if (!updated) {
        return res.status(404).json({
          status: "error",
          message: "Product not found",
        });
      }

      res.json({ status: "success", payload: updated });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:pid",
  current,
  requireRole(["admin"]),
  async (req, res, next) => {
    try {
      await productRepository.deleteById(req.params.pid);
      res.json({ status: "success", message: "Product deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

