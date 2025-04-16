import axios from "axios";
import { getCreateOrderURL, getVerifyPaymentURL } from "@/services/apiUrl";

declare global {
    interface Window { Razorpay: any; }
}

export async function displayRazorpay(amount:number|string, user:any, tier:string) {
  const result = await axios.post(
    getCreateOrderURL(),
    {
      amount: amount,
      currency: "USD",
      tier,
      user,
    },
    { withCredentials: true }
  );

  const order = result.data;

  const options = {
    key: "rzp_live_Gm0eElChZWlqFU",
    // key: "rzp_test_YGJLhPq2oBmn9d",
    amount: order.amount,
    currency: order.currency,
    name: "Find Your SaaS",
    description: "Complete the payment to list your SaaS",
    order_id: order.order_id,
    handler: async function (response:any) {
      fetch(getVerifyPaymentURL(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: order.order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          transaction_id: order.transaction_id,
          tier,
          user,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Payment verified", data);
          if (data.status === "ok" && user.is_seller) {
            localStorage.setItem("paymentSuccess", "true");
            localStorage.setItem("upgradedTier", tier);
            window.location.href = "/profile";
          } else if (data.status === "ok") {
            window.location.href = "/onboard";
          } else {
            window.location.href = "/pricing";
            alert("Payment verification failed. Please try again!");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error verifying payment");
        });
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: "9999999999",
    },
    theme: {
      color: "#61dafb",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}
