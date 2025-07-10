"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateDoc } from "firebase/firestore";
import {
  FaTrashAlt,
  FaEdit,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import { Product } from "@/types/Product";
import EditProductModal from "./EditProductModal";
import { motion } from "framer-motion";

const LIMITE_POR_PAGINA = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [temMais, setTemMais] = useState(true);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Product | null>(
    null
  );
  const [modoBusca, setModoBusca] = useState(false);

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "products"),
        orderBy("name", "asc"),
        limit(LIMITE_POR_PAGINA)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(data);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setTemMais(snapshot.docs.length === LIMITE_POR_PAGINA);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function buscarMaisProdutos() {
    if (!lastVisible || modoBusca) return;
    setCarregandoMais(true);
    try {
      const q = query(
        collection(db, "products"),
        orderBy("name", "asc"),
        startAfter(lastVisible),
        limit(LIMITE_POR_PAGINA)
      );
      const snapshot = await getDocs(q);
      const novos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts((prev) => [...prev, ...novos]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setTemMais(novos.length === LIMITE_POR_PAGINA);
    } catch (error) {
      console.error("Erro ao buscar mais produtos:", error);
    } finally {
      setCarregandoMais(false);
    }
  }

  async function buscarTodosPorNome(nome: string) {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("name", "asc"));
      const snapshot = await getDocs(q);
      const todos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      const filtrados = todos.filter((produto) =>
        produto.name.toLowerCase().includes(nome.toLowerCase())
      );
      setProducts(filtrados);
      setModoBusca(true);
    } catch (error) {
      console.error("Erro ao buscar por nome:", error);
    } finally {
      setLoading(false);
    }
  }

  async function excluirProduto(id: string) {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Produto excluído com sucesso!", {
        className: "font-semibold text-black",
      });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error("Erro ao excluir o produto. Tente novamente.", {
        className: "font-semibold text-black",
      });
    } finally {
      setModalExclusaoAberto(false);
      setProdutoSelecionado(null);
    }
  }

  async function alternarAtivo(produto: Product) {
    try {
      const novoStatus = !produto.active;
      await updateDoc(doc(db, "products", produto.id), {
        active: novoStatus,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === produto.id ? { ...p, active: novoStatus } : p
        )
      );

      toast.success(
        `Produto ${novoStatus ? "ativado" : "desativado"} com sucesso!`,
        { className: "font-semibold text-black" }
      );
    } catch (error) {
      console.error("Erro ao atualizar status do produto:", error);
      toast.error("Erro ao atualizar status. Tente novamente.", {
        className: "font-semibold text-black",
      });
    }
  }

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  useEffect(() => {
    if (search.trim() === "") {
      setModoBusca(false);
      buscarProdutos();
    } else {
      buscarTodosPorNome(search);
    }
  }, [search]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-5xl min-h-[50vh] bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] p-2"
      >
        <div className="px-8 max-md:px-6 py-5">
          <h2 className="font-bold text-3xl mb-4 text-[#2563eb]">
            Gerenciar Produtos
          </h2>
          <input
            type="text"
            placeholder="Pesquisar produto pelo nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 bg-slate-800 border border-blue-500 outline-none mb-4"
          />

          {!loading && products.length === 0 && (
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          )}
          <div className="max-h-[70vh] overflow-y-scroll overflow-x-auto">
            <ul className="">
              {products.map((product) => {
                const hasVariations = (product.variations ?? []).length > 0;
                const lowestVariationPrice = hasVariations
                  ? Math.min(...product.variations!.map((v) => v.price))
                  : null;

                return (
                  <li
                    key={product.id}
                    className="w-full flex items-center justify-between max-md:flex-col max-md:gap-4 p-4 border-b border-[#1c388e7c]"
                  >
                    <div className="w-full flex items-center gap-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 aspect-square object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {product.name}
                        </h3>
                        <p>
                          Preço:{" "}
                          <span className="text-[#568cff] font-semibold">
                            R${" "}
                            {hasVariations && lowestVariationPrice !== null
                              ? lowestVariationPrice.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })
                              : product.promoEnabled && product.promo
                              ? Number(product.promo).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })
                              : Number(product.price).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setProdutoSelecionado(product);
                          setModalEdicaoAberta(true);
                        }}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition"
                      >
                        <FaEdit />
                        Editar
                      </button>

                      <button
                        onClick={() => {
                          setProdutoSelecionado(product);
                          setModalExclusaoAberto(true);
                        }}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer transition"
                      >
                        <FaTrashAlt />
                        Excluir
                      </button>

                      <button
                        onClick={() => alternarAtivo(product)}
                        className={`flex items-center gap-1 ${
                          product.active
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white px-4 py-2 rounded cursor-pointer transition`}
                      >
                        {product.active ? (
                          <>
                            <FaTimesCircle />
                            Desativar
                          </>
                        ) : (
                          <>
                            <FaCheckCircle />
                            Ativar
                          </>
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {!modoBusca && temMais && (
              <div className="text-center mt-4">
                <button
                  onClick={buscarMaisProdutos}
                  disabled={carregandoMais}
                  className="w-full rounded border border-blue-500 text-center py-1.5 font-medium transition duration-300 ease hover:bg-blue-500 hover:text-white block cursor-pointer"
                >
                  {carregandoMais ? "Carregando..." : "Ver mais"}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {/* Modal de Exclusão */}
      {modalExclusaoAberto && produtoSelecionado && (
        <div className="fixed inset-0 bg-[#000000a4] flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] p-6 shadow-lg w-[90%] max-w-md"
          >
            <h3 className="font-bold mb-4 text-2xl text-[#2563eb]">
              Confirmar Exclusão
            </h3>
            <p className="mb-4">
              Tem certeza que deseja excluir o produto{" "}
              <span className="font-semibold">{produtoSelecionado.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalExclusaoAberto(false)}
                className="rounded-lg text-white hover:text-gray-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => excluirProduto(produtoSelecionado.id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Modal de Edição */}
      {modalEdicaoAberta && produtoSelecionado && (
        <EditProductModal
          product={produtoSelecionado}
          onClose={() => setModalEdicaoAberta(false)}
          onUpdate={handleUpdateProduct}
        />
      )}
    </>
  );
}
