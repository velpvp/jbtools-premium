"use client";

import { CartProvider } from "@/context/CartContext";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
