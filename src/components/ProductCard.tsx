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
          width={1920}
          height={1144}
          className="w-full object-cover rounded"
        />
      </div>
      <h3 className="product-title font-bold text-lg truncate">
        {product.name}
      </h3>
      <p className="text-[1rem] text-gray-100 mb-2">
        {product.description.length > 120
          ? product.description.slice(0, 120) + "..."
          : product.description}
      </p>

      <div className="product-price text-sm">A partir de</div>
      <div className="product-price-value text-xl font-semibold mb-2">
        {product.promoEnabled && product.promo ? (
          <div className="flex items-center gap-2">
            <span className="">
              R$ {Number(product.promo).toFixed(2).replace(".", ",")}
            </span>
            <span className="line-through text-gray-400 text-base font-medium">
              R$ {Number(product.price).toFixed(2).replace(".", ",")}
            </span>
          </div>
        ) : (
          <span className="">
            R$ {Number(product.price).toFixed(2).replace(".", ",")}
          </span>
        )}
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
