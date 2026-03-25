import { CartDAO } from "../dao/cart.dao.js";
import { toCartDTO } from "../dtos/cart.dto.js";

const cartDAO = new CartDAO();

export const cartRepository = {
  createEmpty: async () => {
    const cart = await cartDAO.createEmpty();
    return toCartDTO(cart);
  },

  findById: async (id) => {
    const cart = await cartDAO.findById(id);
    return toCartDTO(cart);
  },

  replaceProducts: async (cartId, newProducts) => {
    await cartDAO.replaceProducts(cartId, newProducts);
    const updated = await cartDAO.findById(cartId);
    return toCartDTO(updated);
  },

  addProduct: async ({ cartId, productId, quantity = 1 }) => {
    const cartDoc = await cartDAO.findById(cartId);
    if (!cartDoc) return null;

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      const err = new Error("Invalid quantity");
      err.status = 400;
      throw err;
    }

    const existing = (cartDoc.products || []).find(
      (p) => p.product?.toString?.() === productId.toString()
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cartDoc.products = cartDoc.products || [];
      cartDoc.products.push({ product: productId, quantity: qty });
    }

    await cartDAO.replaceProducts(cartId, cartDoc.products);
    const updated = await cartDAO.findById(cartId);
    return toCartDTO(updated);
  },

  clear: async (cartId) => {
    await cartDAO.clear(cartId);
    return { id: cartId, products: [] };
  },
};

