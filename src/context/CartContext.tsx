"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/Product";

type Variation = {
  name: string;
  price: number;
};

export type CartItem = {
  product: Product;
  variation: Variation | null;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    product: Product,
    variation?: Variation | null,
    quantity?: number,
    redirect?: boolean
  ) => void;
  total: number;
  updateQuantity: (
    productId: string,
    variationName: string | null,
    quantity: number
  ) => void;
  removeFromCart: (productId: string, variationName: string | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  const addToCart = (
    product: Product,
    variation: Variation | null = null,
    quantity = 1,
    redirect = false
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (item.variation?.name ?? null) === (variation?.name ?? null)
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity, // <- incremento correto
        };
        return updated;
      }

      return [...prev, { product, variation, quantity }];
    });

    if (redirect) router.push("/cart");
  };

  const updateQuantity = (
    productId: string,
    variationName: string | null,
    quantity: number
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        (item.variation?.name ?? null) === variationName
          ? { ...item, quantity: quantity < 1 ? 1 : quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, variationName: string | null) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (item.variation?.name ?? null) === variationName
          )
      )
    );
  };

  const total = cart.reduce((sum, item) => {
    const price =
      item.variation?.price ??
      (item.product.promoEnabled && item.product.promo
        ? item.product.promo
        : item.product.price);
    return sum + (price ?? 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, total, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve estar dentro do CartProvider");
  return context;
};
