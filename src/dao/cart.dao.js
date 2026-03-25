import { CartModel } from "../models/cart.model.js";

export class CartDAO {
  async findById(id) {
    return CartModel.findById(id);
  }

  async createEmpty() {
    return CartModel.create({ products: [] });
  }

  async replaceProducts(cartId, newProducts) {
    // newProducts: Array<{ product: ObjectId, quantity: number }>
    await CartModel.updateOne(
      { _id: cartId },
      { $set: { products: newProducts } }
    );
  }

  async clear(cartId) {
    await CartModel.updateOne({ _id: cartId }, { $set: { products: [] } });
  }
}

