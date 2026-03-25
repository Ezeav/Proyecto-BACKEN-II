export const toCartDTO = (cart) => {
  if (!cart) return null;

  return {
    id: cart._id?.toString?.() ?? cart.id,
    products: (cart.products || []).map((p) => ({
      product: p.product?.toString?.() ?? p.product,
      quantity: p.quantity,
    })),
  };
};

