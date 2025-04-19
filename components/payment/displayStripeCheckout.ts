import axios from "axios";
import { getCreateOrderURL } from "@/frontendservices/apiUrl";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51Kyhs4E6mjTm7nDdZTsDpcuqvRcup6MtbU01skvdeivR34zXTDtswigAuvCXMSWstOF0HfZBOeM2eOb14PrtfBIN00Unj7cu9Z"); 

export async function displayStripeCheckout(amount: number, user: any, tier: string) {
  try {
    const result = await axios.post(
      getCreateOrderURL(),
      {
        amount,
        currency: "usd",
        tier,
        user,
      },
      { withCredentials: true }
    );

    const { clientSecret, transactionId } = result.data;

    const stripe = await stripePromise;

    if (!stripe) {
      alert("Stripe failed to initialize");
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: window.cardElement, 
        billing_details: {
          name: user.name,
          email: user.email,
        },
      },
    });

    if (error) {
      console.error("Payment failed:", error.message);
      alert("Payment failed, please try again.");
    } else if (paymentIntent?.status === "succeeded") {
      localStorage.setItem("paymentSuccess", "true");
      localStorage.setItem("upgradedTier", tier);

      if (user.is_seller) {
        window.location.href = "/profile";
      } else {
        window.location.href = "/onboard";
      }
    }
  } catch (error) {
    console.error("Stripe checkout error:", error);
    alert("Something went wrong with Stripe Checkout.");
  }
}
