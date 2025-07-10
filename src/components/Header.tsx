"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import logoFloating from "../../public/logo-floating.png";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import CartSidebar from "./CartSidebar";
import { AnimatePresence } from "framer-motion";

export default function Header() {
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("busca") || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  const handleAnimate = () => {
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 400); // duração da animação
  };

  // Escuta o evento global "cart-ping"
  useEffect(() => {
    const handleCartPing = () => handleAnimate();
    window.addEventListener("cart-ping", handleCartPing);
    return () => window.removeEventListener("cart-ping", handleCartPing);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("busca", search.trim());
    } else {
      params.delete("busca");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">
              <Image
                src={logoFloating}
                alt="JBTools Logo"
                className="floating-logo"
              />
            </div>
          </div>

          {/* Busca */}
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              placeholder="Digite o que você procura"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="search-btn flex justify-center items-center"
            >
              <FaSearch />
            </button>
          </form>

          {/* Botão do carrinho com animação */}
          <div className="header-actions">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`btn-cart transition-all ${
                animateCart ? "animate-ping-cart" : ""
              }`}
              aria-label="Abrir carrinho"
            >
              <FaShoppingCart />
              <span className="max-md:hidden">
                Carrinho (<span>{cart.length}</span>)
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && <CartSidebar onClose={() => setSidebarOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}
