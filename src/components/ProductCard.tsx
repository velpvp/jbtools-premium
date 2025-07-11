"use client";

import { useState } from "react";
import ProductModal from "./ProductModal";
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { Product } from "@/types/Product";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const hasVariations = (product.variations ?? []).length > 0;
  const [showModal, setShowModal] = useState(false);

  const lowestVariationPrice = hasVariations
    ? Math.min(...(product.variations ?? []).map((v) => v.price))
    : null;

  const showPrice = () => {
    if (hasVariations && lowestVariationPrice !== null) {
      return `R$ ${lowestVariationPrice.toFixed(2).replace(".", ",")}`;
    }

    if (product.promoEnabled && product.promo) {
      return (
        <div className="flex items-center gap-2">
          <span>R$ {Number(product.promo).toFixed(2).replace(".", ",")}</span>
          <span className="line-through text-gray-400 text-base font-medium">
            R$ {Number(product.price).toFixed(2).replace(".", ",")}
          </span>
        </div>
      );
    }

    return `R$ ${Number(product.price).toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="product-card p-4 rounded border shadow hover:shadow-lg transition">
      <Link href={`/product/${product.id}`} className="product-image mb-2">
        <Image
          src={product.image}
          alt={product.name}
          width={1920}
          height={1144}
          className="w-full object-cover rounded"
        />
      </Link>

      <Link href={`/product/${product.id}`}>
        <h3 className="product-title font-bold text-lg truncate">
          {product.name}
        </h3>
      </Link>

      <div className="w-full flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="text-blue-500 transition hover:text-blue-700 font-medium text-sm mb-2 cursor-pointer text-end flex items-center gap-1"
        >
          Ver mais
          <FaChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="product-price text-sm">
        {hasVariations ? "A partir de" : "Preço"}
      </div>
      <div className="product-price-value text-xl font-semibold mb-2">
        {showPrice()}
      </div>

      <div className="product-actions flex gap-2">
        <Link
          href={`/product/${product.id}`}
          className="btn-subscribe flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
        >
          <FaPlay />
          Adquirir
        </Link>

        {!hasVariations && (
          <button
            onClick={() => {
              addToCart(product);
              window.dispatchEvent(new Event("cart-ping"));
            }}
            className="btn-add-cart flex-1 bg-gray-200 text-black py-1 rounded hover:bg-gray-300 flex items-center justify-center gap-1"
          >
            <FaCartShopping />
            Adicionar ao Carrinho
          </button>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <ProductModal product={product} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
