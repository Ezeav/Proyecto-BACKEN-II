import { cartRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { ticketRepository } from "../repositories/ticket.repository.js";

const generateTicketCode = () => {
  const rand = Math.random().toString(16).slice(2);
  return `TICKET-${Date.now()}-${rand}`.toUpperCase();
};

// Compra robusta con stock + ticket complete/incomplete.
// - Descuenta stock solo de lo que se puede comprar
// - Si falta stock, genera Ticket con notPurchasedProducts y deja remanente en el carrito
export const purchaseCart = async ({ userId, cartId }) => {
  const cart = await cartRepository.findById(cartId);
  if (!cart) {
    const err = new Error("Cart not found");
    err.status = 404;
    throw err;
  }

  const cartItems = cart.products || [];
  if (!cartItems.length) {
    const err = new Error("Cart is empty");
    err.status = 400;
    throw err;
  }

  const productIds = cartItems.map((i) => i.product);
  const uniqueProductIds = Array.from(new Set(productIds));

  const products = await productRepository.findByIds(uniqueProductIds);
  if (products.length !== uniqueProductIds.length) {
    const err = new Error("Some products were not found");
    err.status = 404;
    throw err;
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  const productsPurchased = [];
  const notPurchasedProducts = [];
  let amount = 0;

  for (const item of cartItems) {
    const product = productMap.get(item.product);
    if (!product) continue; // safety

    const requestedQty = item.quantity;
    const availableStock = product.stock;
    const purchasedQty = Math.min(requestedQty, availableStock);
    const remainingQty = requestedQty - purchasedQty;

    if (purchasedQty > 0) {
      amount += purchasedQty * product.price;
      productsPurchased.push({
        productId: product.id,
        quantity: purchasedQty,
        price: product.price,
      });
    }

    if (remainingQty > 0) {
      notPurchasedProducts.push({
        productId: product.id,
        quantity: remainingQty,
        price: product.price,
      });
    }
  }

  const status = notPurchasedProducts.length ? "incomplete" : "complete";

  // Descontamos stock en bulk solo por lo comprado.
  const decrements = productsPurchased.map((p) => ({
    productId: p.productId,
    quantity: p.quantity,
  }));
  await productRepository.bulkDecrementStock(decrements);

  // Persistimos ticket.
  const ticket = await ticketRepository.create({
    code: generateTicketCode(),
    purchaser: userId,
    amount,
    productsPurchased: productsPurchased.map((p) => ({
      product: p.productId,
      quantity: p.quantity,
      price: p.price,
    })),
    notPurchasedProducts: notPurchasedProducts.map((p) => ({
      product: p.productId,
      quantity: p.quantity,
      price: p.price,
    })),
    status,
  });

  // Actualizamos carrito con remanente (solo lo no comprado).
  const residualProducts = notPurchasedProducts.map((p) => ({
    product: p.productId,
    quantity: p.quantity,
  }));

  await cartRepository.replaceProducts(cartId, residualProducts);

  return ticket;
};

