"use client";

import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { Product } from "@/types/Product";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card p-4 rounded border shadow hover:shadow-lg transition">
      <div className="product-image mb-2">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="w-full object-cover rounded aspect-video"
        />
      </div>
      <h3 className="product-title font-bold text-lg">{product.name}</h3>
      <p className="product-description text-sm text-gray-500 mb-2">
        {product.description.length > 120
          ? product.description.slice(0, 120) + "..."
          : product.description}
      </p>

      <div className="product-price text-sm">A partir de</div>
      <div className="product-price-value text-xl font-semibold text-green-600 mb-2">
        R$ {Number(product.price).toFixed(2).replace(".", ",")}
      </div>

      <div className="product-actions flex gap-2">
        <Link
          href={`/product/${product.id}`}
          className="btn-subscribe flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
        >
          <FaPlay />
          Adquirir
        </Link>
        <button
          onClick={() => addToCart(product)}
          className="btn-add-cart flex-1 bg-gray-200 text-black py-1 rounded hover:bg-gray-300 flex items-center justify-center gap-1"
        >
          <FaCartShopping />
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
