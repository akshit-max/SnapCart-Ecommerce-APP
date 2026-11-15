export const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// message sent by the api, or a fallback
export const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong";

export const photoUrl = (id) => {
  const base = process.env.REACT_APP_API || "";
  return `${base}/api/v1/product/product-photo/${id}`;
};

// adds razorpay's checkout script to the page (only once, only when needed)
export const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
