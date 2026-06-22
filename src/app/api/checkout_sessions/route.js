import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const { cartItems, userEmail, buyerInfo } = await request.json();

    if (!cartItems?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 1. Pre-create pending orders on Express (one per cart item)
    const BASE = process.env.NEXT_PUBLIC_SERVER_URL;
    let orderIds = [];
    try {
      const ordersRes = await fetch(`${BASE}/api/createorders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerInfo,
          items: cartItems.map((item) => ({
            productId:  item._id,
            title:      item.title,
            price:      item.price,
            quantity:   item.quantity,
            sellerInfo: item.sellerInfo || {},
          })),
        }),
      });
      const data = await ordersRes.json();
      orderIds = data.orderIds || [];
    } catch {
      // Express not ready yet — payment still works, orders created later
    }

    // 2. Create Payment Intent with orderIds stored in metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      receipt_email: userEmail,
      automatic_payment_methods: { enabled: true },
      metadata: {
        userEmail,
        totalAmount:  String(totalAmount),
        orderIds:     JSON.stringify(orderIds),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("[checkout_sessions]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
