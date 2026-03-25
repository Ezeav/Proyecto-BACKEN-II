export const toProductDTO = (product) => {
  if (!product) return null;

  return {
    id: product._id?.toString?.() ?? product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    stock: product.stock,
  };
};

