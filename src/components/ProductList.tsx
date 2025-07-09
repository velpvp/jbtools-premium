"use client";

import { Product } from "@/types/Product";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { FaBoxOpen } from "react-icons/fa";

interface ProductListProps {
  products: Product[];
  selectedCategory: string;
}

export default function ProductList({
  products,
  selectedCategory,
}: ProductListProps) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("busca")?.toLowerCase() || "";

  const filteredByCategory =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const finalFiltered = filteredByCategory.filter((p) =>
    p.name.toLowerCase().includes(searchTerm)
  );

  if (finalFiltered.length === 0) {
    return (
      <div className="no-products text-center text-gray-500 mt-10">
        <FaBoxOpen className="text-4xl mx-auto mb-2" />
        <h3 className="text-xl font-semibold">Nenhum produto encontrado</h3>
        <p className="text-sm">
          Tente ajustar os filtros ou buscar por outro termo.
        </p>
      </div>
    );
  }

  return (
    <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {finalFiltered.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
