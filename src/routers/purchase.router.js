import { Router } from "express";

import { current } from "../middlewares/current.js";
import { requireRole } from "../middlewares/requireRole.js";
import { purchaseCart } from "../services/purchase.service.js";

const router = Router();

const assertCartOwner = (req, cartId) => {
  const userCartId = req.user?.cart;
  if (!userCartId) return false;
  return userCartId.toString() === cartId.toString();
};

router.post("/:cartId", current, requireRole(["user"]), async (req, res, next) => {
  try {
    const { cartId } = req.params;
    if (!assertCartOwner(req, cartId)) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: not your cart",
      });
    }

    const ticket = await purchaseCart({
      userId: req.user._id,
      cartId,
    });

    res.json({ status: "success", payload: ticket });
  } catch (error) {
    next(error);
  }
});

export default router;

