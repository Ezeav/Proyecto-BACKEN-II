import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    purchase_datetime: {
      type: Date,
      default: Date.now,
    },
    purchaser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    productsPurchased: {
      type: [ticketItemSchema],
      default: [],
    },
    notPurchasedProducts: {
      type: [ticketItemSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["complete", "incomplete"],
      default: "complete",
    },
  },
  {
    timestamps: true,
  }
);

export const TicketModel = mongoose.model(ticketCollection, ticketSchema);

