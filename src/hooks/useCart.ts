import { useEffect, useState, useMemo, useCallback } from "react";
import { getGuitars } from "../api/guitars";

export const useCart = () => {


  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart"); 

    try {
      const parsed = localStorageCart ? JSON.parse(localStorageCart) : []; 
      return Array.isArray(parsed) ? parsed : []; 
    } catch (error) {
      console.error("Error al leer el carrito de localStorage:", error);
      localStorage.removeItem("cart"); 
      return []; 
    }
  };

  const [data, setData] = useState<Guitar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGuitars = useCallback(async () => {
    try {
      setError("");
      setData(await getGuitars());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el catálogo");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuitars();
  }, [loadGuitars]);

  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart)); 
  }, [cart]); 

  const MIN_ITEMS = 1;
  const MAX_ITEMS = 5;

  function addToCart(item: Guitar) {
    const itemExists = cart.findIndex((guitar) => guitar.id == item.id); 
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]); 
    }
  }

  function decreseQuantity(id: number) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }
  function increaseQuantity(id: number) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function removeFromCart(id: number) {
    setCart((prevCart) => prevCart.filter((guita) => guita.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const [total, setTotal] = useState(0);

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart],
  );

  return {

    cart,
    data,
    loading,
    error,
    loadGuitars,
    isEmpty,
    cartTotal,
    addToCart,
    decreseQuantity,
    increaseQuantity,
    removeFromCart,
    clearCart,
    total,
    setTotal,
    useState,
  };
};
