import { useState, useContext, createContext, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    // merge items with same id if any duplicates exist
    return saved.reduce((cart, item) => {
      const found = cart.find((c) => c._id === item._id);
      if (found) found.qty += item.qty || 1;
      else cart.push({ ...item, qty: item.qty || 1 });
      return cart;
    }, []);
  } catch {
    return [];
  }
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Single authority for adding to cart with duplicate-safe notification
  const addToCart = (product, count = 1, showToast = true) => {
    const inCart = cart.find((item) => item._id === product._id);
    const qtyInCart = inCart ? inCart.qty : 0;

    if (qtyInCart + count > product.quantity) {
      toast.error(product.quantity < 1 ? "Out of stock" : "Maximum available stock reached in cart", {
        id: `stock-${product._id}`,
      });
      return false;
    }

    if (inCart) {
      setCart(cart.map((item) => (item._id === product._id ? { ...item, qty: item.qty + count } : item)));
    } else {
      const { _id, name, slug, price, quantity } = product;
      setCart([...cart, { _id, name, slug, price, stock: quantity, qty: count }]);
    }

    if (showToast) {
      const message = count > 1 ? `${count} × ${product.name} added to bag` : `${product.name} added to bag`;
      toast.success(message, {
        id: `cart-${product._id}`,
        icon: "🛍️",
      });
    }
    return true;
  };

  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, qty: Math.max(1, Math.min(qty, item.stock || qty)) } : item
      )
    );
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item._id !== id));

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, cartTotal, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
