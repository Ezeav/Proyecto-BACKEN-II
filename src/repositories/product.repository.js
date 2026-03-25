import { ProductDAO } from "../dao/product.dao.js";
import { toProductDTO } from "../dtos/product.dto.js";

const productDAO = new ProductDAO();

export const productRepository = {
  create: async (data) => {
    const product = await productDAO.create(data);
    return toProductDTO(product);
  },

  findById: async (id) => {
    const product = await productDAO.findById(id);
    return toProductDTO(product);
  },

  findAll: async () => {
    const products = await productDAO.findAll();
    return products.map(toProductDTO);
  },

  updateById: async (id, data) => {
    const updated = await productDAO.updateById(id, data);
    return toProductDTO(updated);
  },

  deleteById: async (id) => {
    await productDAO.deleteById(id);
  },

  findByIds: async (ids) => {
    const products = await productDAO.findByIds(ids);
    return products.map(toProductDTO);
  },

  bulkDecrementStock: async (decrements) => {
    // decrements: Array<{ productId, quantity }>
    await productDAO.bulkDecrementStock(decrements);
  },
};

