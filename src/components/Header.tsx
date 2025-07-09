"use client";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import logoFloating from "../../public/logo-floating.png";
import Link from "next/link";
import { FaShoppingCart, FaSearch, FaCog } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("busca") || "");

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
          <div className="logo">
            <div className="logo-icon">
              <Image
                src={logoFloating}
                alt="JBTools Logo"
                className="floating-logo"
              />
            </div>
          </div>

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

          <div className="header-actions">
            <Link href={`/cart`} className="btn-cart" id="cartBtn">
              <FaShoppingCart />
              Carrinho (<span>{cart.length}</span>)
            </Link>
            <Link href={`/admin`} className="btn-manage bg-[#4f9cf9] ml-[10px]">
              <FaCog />
              Gerenciar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
