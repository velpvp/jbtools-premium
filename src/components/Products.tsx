"use client";

import { FaGlobe, FaRobot } from "react-icons/fa";
// import { useEffect, useState } from "react";
// import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import CarCard from "./CarCard";
// import { Carro } from "@/types/Carro";
// import Link from "next/link";

export default function Products() {
  // const [carros, setCarros] = useState<Carro[]>([]);

  // useEffect(() => {
  //   async function fetchCarros() {
  //     try {
  //       const q = query(
  //         collection(db, "carros"),
  //         orderBy("criadoEm", "desc"),
  //         limit(6)
  //       );
  //       const querySnapshot = await getDocs(q);
  //       const listaCarros = querySnapshot.docs.map((doc) => {
  //         return { id: doc.id, ...(doc.data() as Omit<Carro, "id">) };
  //       });
  //       setCarros(listaCarros);
  //     } catch (error) {
  //       console.error("Erro ao buscar carros:", error);
  //     }
  //   }

  //   fetchCarros();
  // }, []);

  return (
    <section className="main-content">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Categorias</h3>
        </div>
        <ul className="category-list">
          <li className="category-item active" data-category="all">
            <FaGlobe />
            <span>Todos</span>
          </li>
          <li className="category-item" data-category="ias">
            <FaRobot />
            <span>I.A.S</span>
          </li>
          <li className="category-item" data-category="streamings">
            <i className="fas fa-tv"></i>
            <span>Streamings</span>
          </li>
          <li className="category-item" data-category="jogos">
            <i className="fas fa-gamepad"></i>
            <span>Jogos</span>
          </li>
          <li className="category-item" data-category="outros">
            <i className="fas fa-ellipsis-h"></i>
            <span>Outros</span>
          </li>
        </ul>
      </div>
      <div className="container">
        <div id="loading" className="loading">
          <div className="spinner"></div>
          <p>Carregando produtos...</p>
        </div>

        <div id="productsGrid" className="products-grid"></div>

        <div id="noProducts" className="no-products">
          <i className="fas fa-box-open"></i>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente ajustar os filtros ou buscar por outro termo.</p>
        </div>
      </div>
    </section>
    // <section classNameName="mt-10 flex justify-center items-center max-lg:px-6">
    //   <div classNameName="w-full max-w-5xl">
    //     <h2 classNameName="w-full text-left text-4xl font-bold mb-2 text-[var(--primary)]">
    //       Novidades
    //     </h2>
    //     <div classNameName="w-full grid grid-cols-3 max-md:grid-cols-1 gap-5">
    //       {carros.length === 0 ? (
    //         <p>Nenhum veículo foi encontrado</p>
    //       ) : (
    //         carros.map((carro) => <CarCard key={carro.id} carro={carro} />)
    //       )}
    //     </div>
    //     <Link
    //       href="/estoque"
    //       classNameName="mt-4 w-full rounded bg-[var(--primary)] text-white text-center py-2 font-medium transition duration-300 ease hover:bg-[var(--primary-hover)] hover:text-gray-200 block"
    //     >
    //       Ver estoque completo
    //     </Link>
    //   </div>
    // </section>
  );
}

// style="display: none;"
