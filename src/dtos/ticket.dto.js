export const toTicketDTO = (ticket) => {
  if (!ticket) return null;

  return {
    id: ticket._id?.toString?.() ?? ticket.id,
    code: ticket.code,
    purchase_datetime: ticket.purchase_datetime,
    purchaser: ticket.purchaser?.toString?.() ?? ticket.purchaser,
    amount: ticket.amount,
    status: ticket.status,
    productsPurchased: (ticket.productsPurchased || []).map((item) => ({
      product: item.product?.toString?.() ?? item.product,
      quantity: item.quantity,
      price: item.price,
    })),
    notPurchasedProducts: (ticket.notPurchasedProducts || []).map((item) => ({
      product: item.product?.toString?.() ?? item.product,
      quantity: item.quantity,
      price: item.price,
    })),
  };
};

