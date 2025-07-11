"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/Product";
import ProductList from "@/components/ProductList";

import { FaGlobe, FaRobot, FaTv, FaGamepad, FaEllipsisH } from "react-icons/fa";
import Coupons from "./Coupons";

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

        const ativos = data.filter((p) => p.active);
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

  return (
    <section className="main-content gap-6 p-6">
      <div>
        <Coupons />

        <div className="sidebar h-full">
          <div className="sidebar-header">
            <h3 className="text-lg font-semibold mb-4 ">Categorias</h3>
          </div>
          <ul className="category-list">
            <li
              className={`category-item ${
                selectedCategory === "all" ? "active" : ""
              }`}
              data-category="All"
              onClick={() => handleCategoryClick("all")}
            >
              <FaGlobe className="text-2xl icon-category" />
              <span>Todos</span>
            </li>
            <li
              className={`category-item ${
                selectedCategory === "ias" ? "active" : ""
              }`}
              data-category="Ias"
              onClick={() => handleCategoryClick("ias")}
            >
              <FaRobot className="text-2xl icon-category" />
              <span>I.A.S</span>
            </li>
            <li
              className={`category-item ${
                selectedCategory === "streamings" ? "active" : ""
              }`}
              data-category="Streamings"
              onClick={() => handleCategoryClick("streamings")}
            >
              <FaTv className="text-2xl icon-category" />
              <span>Streamings</span>
            </li>
            <li
              className={`category-item ${
                selectedCategory === "jogos" ? "active" : ""
              }`}
              data-category="Jogos"
              onClick={() => handleCategoryClick("jogos")}
            >
              <FaGamepad className="text-2xl icon-category" />
              <span>Jogos</span>
            </li>
            <li
              className={`category-item ${
                selectedCategory === "outros" ? "active" : ""
              }`}
              data-category="Outros"
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
        ) : (
          <ProductList
            products={products}
            selectedCategory={selectedCategory}
          />
        )}
      </div>
    </section>
  );
}
