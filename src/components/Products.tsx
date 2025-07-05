"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/Product";

import {
  FaBoxOpen,
  FaGlobe,
  FaRobot,
  FaTv,
  FaGamepad,
  FaEllipsisH,
  FaTag,
} from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        const ativos = data.filter((p) => p.active); // 👈 filtro
        setProducts(ativos);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <section className="main-content gap-6 p-6">
      <div>
        <div className="mb-2 descontos">
          <div className="py-1 px-4 font-bold flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
            <FaTag className="shrink-0" />
            <span className="truncate">10% OFF NA SUA PRIMEIRA COMPRA</span>
          </div>
        </div>

        <div className="sidebar h-full">
          <div className="sidebar-header">
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
          </div>
          <ul className="category-list">
            <li
              className={`category-item ${
                selectedCategory === "all" ? "active" : ""
              }`}
              data-category="all"
              onClick={() => handleCategoryClick("all")}
            >
              <FaGlobe className="text-2xl icon-category" />
              <span>Todos</span>
            </li>
            <li
              className={`category-item ${
                selectedCategory === "ias" ? "active" : ""
              }`}
              data-category="ias"
              onClick={() => handleCategoryClick("ias")}
            >
              <FaRobot className="text-2xl icon-category" />
              <span>I.A.S</span>
            </li>
            <li
              className={`category-item ${
                selectedCategory === "streamings" ? "active" : ""
              }`}
              data-category="streamings"
              onClick={() => handleCategoryClick("streamings")}
            >
              <FaTv className="text-2xl icon-category" />
              <span>Streamings</span>
            </li>
            <li
              className={`category-item ${
                selectedCategory === "jogos" ? "active" : ""
              }`}
              data-category="jogos"
              onClick={() => handleCategoryClick("jogos")}
            >
              <FaGamepad className="text-2xl icon-category" />
              <span>Jogos</span>
            </li>
            <li
              className={`category-item ${
                selectedCategory === "outros" ? "active" : ""
              }`}
              data-category="outros"
              onClick={() => handleCategoryClick("outros")}
            >
              <FaEllipsisH className="text-2xl icon-category" />
              <span>Outros</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container flex-1">
        {loading ? (
          <div className="text-center text-gray-500">
            <div className="spinner border-t-4 border-blue-500 w-10 h-10 mx-auto rounded-full animate-spin mb-2" />
            <p>Carregando produtos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products text-center text-gray-500 mt-10">
            <FaBoxOpen className="text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-semibold">Nenhum produto encontrado</h3>
            <p className="text-sm">
              Tente ajustar os filtros ou buscar por outro termo.
            </p>
          </div>
        ) : (
          <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
