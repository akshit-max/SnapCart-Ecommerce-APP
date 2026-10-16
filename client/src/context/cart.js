import { useState, useContext, createContext, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    // older carts stored the same product twice instead of a qty, merge them
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

  const addToCart = (product) => {
    const inCart = cart.find((item) => item._id === product._id);
    const qtyInCart = inCart ? inCart.qty : 0;

    if (qtyInCart >= product.quantity) {
      toast.error(product.quantity < 1 ? "Out of stock" : "No more stock available");
      return;
    }

    if (inCart) {
      setCart(cart.map((item) => (item._id === product._id ? { ...item, qty: item.qty + 1 } : item)));
    } else {
      // only keep what the cart page needs
      const { _id, name, slug, price, quantity } = product;
      setCart([...cart, { _id, name, slug, price, stock: quantity, qty: 1 }]);
    }
    toast.success("Added to cart");
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
