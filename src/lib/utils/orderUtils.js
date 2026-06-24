export function normalizeOrder(o) {
  return {
    ...o,
    productTitle:  o.productTitle  || o.title             || "—",
    price:         o.price         ?? o.totalAmount        ?? 0,
    status:        o.status        || o.orderStatus        || "Pending",
    productImage:  o.productImage  || o.images?.[0]        || null,
    buyerName:     o.buyerName     || o.buyerInfo?.name    || "—",
    buyerEmail:    o.buyerEmail    || o.buyerInfo?.email   || "—",
    buyerPhone:    o.buyerPhone    || o.buyerInfo?.phone   || "—",
    buyerAddress:  o.buyerAddress  || o.buyerInfo?.address || "—",
    buyerLocation: o.buyerLocation || o.buyerInfo?.location|| "—",
    sellerName:    o.sellerName    || o.sellerInfo?.name   || "—",
    transactionId: o.transactionId || "—",
  };
}
