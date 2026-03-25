import { ProductModel } from "../models/product.model.js";

export class ProductDAO {
  async create(productData) {
    const created = await ProductModel.create(productData);
    return created;
  }

  async findById(id) {
    return ProductModel.findById(id);
  }

  async findAll() {
    return ProductModel.find();
  }

  async updateById(id, updateData) {
    return ProductModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return ProductModel.findByIdAndDelete(id);
  }

  async findByIds(ids) {
    return ProductModel.find({ _id: { $in: ids } });
  }

  async bulkDecrementStock(decrements) {
    // decrements: Array<{ productId, quantity }>
    if (!decrements.length) return;

    const ops = decrements.map((d) => ({
      updateOne: {
        filter: { _id: d.productId },
        update: { $inc: { stock: -d.quantity } },
      },
    }));

    await ProductModel.bulkWrite(ops);
  }
}

