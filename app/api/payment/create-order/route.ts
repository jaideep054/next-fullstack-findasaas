// app/api/stripe/create-order/route.ts
import Stripe from 'stripe';
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { getUserFromToken } from "@/lib/utils/authmiddleware";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { amount, currency, tier } = await req.json();
    const user: any = await getUserFromToken(req);

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency || "usd",
      metadata: {
        userId: user._id.toString(),
        tier,
      },
    });

    const transactionId = uuidv4();

    await Payment.create({
      user_id: user._id,
      amount,
      currency,
      status: "pending",
      stripe_payment_intent_id: paymentIntent.id,
      transaction_id: transactionId,
      tier,
      email: user.email,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      transactionId,
    });
  } catch (err) {
    console.error("Stripe Create Order Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
