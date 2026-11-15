export const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// message sent by the api, or a fallback
export const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80";

export const photoUrl = (item, photo) => {
  // 1. Direct Cloudinary URL if available on photo object or item
  if (photo?.url) return photo.url;
  if (item?.photo?.url) return item.photo.url;
  if (typeof item === "string" && (item.startsWith("http://") || item.startsWith("https://"))) {
    return item;
  }
  // 2. Fall back to backend 302 endpoint for buffer images
  const id = typeof item === "object" && item !== null ? item._id : item;
  if (!id) return FALLBACK_IMAGE;

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
