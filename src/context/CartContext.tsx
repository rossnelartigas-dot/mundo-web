
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { Product } from "@/types/product";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "cart";
const EMPTY_CART: CartItem[] = [];

let memoryCart: CartItem[] = EMPTY_CART;
let isInitialized = false;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function initMemoryCart() {
  if (isInitialized || typeof window === "undefined") return;
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (Array.isArray(parsedCart)) {
        memoryCart = parsedCart;
      }
    }
  } catch (error) {
    console.error("Error cargando carrito:", error);
  }
  isInitialized = true;
}

function getSnapshot(): CartItem[] {
  if (!isInitialized) {
    initMemoryCart();
  }
  return memoryCart;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
      try {
        memoryCart = e.newValue ? JSON.parse(e.newValue) : EMPTY_CART;
      } catch {
        memoryCart = EMPTY_CART;
      }
      emitChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function setCartState(newCart: CartItem[]) {
  memoryCart = newCart;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  }
  emitChange();
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const addToCart = useCallback((product: Product) => {
    const current = getSnapshot();
    const exists = current.find((item) => item.id === product.id);

    if (exists) {
      setCartState(
        current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartState([
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  }, []);

  const removeFromCart = useCallback((id: number) => {
    const current = getSnapshot();
    setCartState(current.filter((item) => item.id !== id));
  }, []);

  const increaseQuantity = useCallback((id: number) => {
    const current = getSnapshot();
    setCartState(
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: number) => {
    const current = getSnapshot();
    setCartState(
      current.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartState([]);
  }, []);

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      total,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      total,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}