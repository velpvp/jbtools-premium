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
import { Carro } from "@/types/Carro";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import EditCarModal from "./EditCarModal";

const LIMITE_POR_PAGINA = 10;

export default function AdminCars() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [temMais, setTemMais] = useState(true);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [carroSelecionado, setCarroSelecionado] = useState<Carro | null>(null);
  const [modoBusca, setModoBusca] = useState(false);

  useEffect(() => {
    buscarCarros();
  }, []);

  async function buscarCarros() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "carros"),
        orderBy("nome", "asc"),
        limit(LIMITE_POR_PAGINA)
      );
      const snapshot = await getDocs(q);
      const carrosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Carro[];

      setCarros(carrosData);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setTemMais(snapshot.docs.length === LIMITE_POR_PAGINA);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    } finally {
      setLoading(false);
    }
  }

  async function buscarMaisCarros() {
    if (!lastVisible || modoBusca) return;
    setCarregandoMais(true);
    try {
      const q = query(
        collection(db, "carros"),
        orderBy("nome", "asc"),
        startAfter(lastVisible),
        limit(LIMITE_POR_PAGINA)
      );
      const snapshot = await getDocs(q);
      const novosCarros = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Carro[];

      setCarros((prev) => [...prev, ...novosCarros]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setTemMais(novosCarros.length === LIMITE_POR_PAGINA);
    } catch (error) {
      console.error("Erro ao buscar mais carros:", error);
    } finally {
      setCarregandoMais(false);
    }
  }

  async function buscarTodosPorNome(nome: string) {
    setLoading(true);
    try {
      const q = query(collection(db, "carros"), orderBy("nome", "asc"));
      const snapshot = await getDocs(q);
      const todos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Carro[];

      const filtrados = todos.filter((carro) =>
        carro.nome.toLowerCase().includes(nome.toLowerCase())
      );
      setCarros(filtrados);
      setModoBusca(true);
    } catch (error) {
      console.error("Erro ao buscar por nome:", error);
    } finally {
      setLoading(false);
    }
  }

  async function excluirCarro(id: string) {
    try {
      await deleteDoc(doc(db, "carros", id));
      setCarros((prev) => prev.filter((carro) => carro.id !== id));
      toast.success("Veículo excluído com sucesso!", {
        className: "font-semibold text-black",
      });
    } catch (error) {
      console.error("Erro ao excluir carro:", error);
      toast.error("Erro ao excluir o veículo. Tente novamente.", {
        className: "font-semibold text-black",
      });
    } finally {
      setModalExclusaoAberto(false);
      setCarroSelecionado(null);
    }
  }

  const handleUpdateCar = (updatedCar: Carro) => {
    setCarros((prev) =>
      prev.map((car) => (car.id === updatedCar.id ? updatedCar : car))
    );
  };

  useEffect(() => {
    if (search.trim() === "") {
      setModoBusca(false);
      buscarCarros();
    } else {
      buscarTodosPorNome(search);
    }
  }, [search]);

  return (
    <div className="mt-10">
      <h2 className="font-bold text-3xl mb-4 text-[var(--primary)]">
        Lista de Veículos
      </h2>

      <input
        type="text"
        placeholder="Pesquisar veículo pelo nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 bg-gray-200 outline-none mb-4"
      />

      {loading && <p>Carregando veículos...</p>}

      {!loading && carros.length === 0 && (
        <p className="text-gray-500">Nenhum veículo encontrado.</p>
      )}
      <div className="max-h-[70vh] overflow-y-scroll overflow-x-auto">
        <ul className="">
          {carros.map((carro) => (
            <li
              key={carro.id}
              className="w-full flex items-center justify-between max-md:flex-col max-md:gap-4 p-4 border-b border-gray-200"
            >
              <div className="w-full flex items-center gap-4">
                <Image
                  src={carro.imagemCapa}
                  alt={carro.nome}
                  width={80}
                  height={80}
                  className="w-20 h-20 aspect-square object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-lg">{carro.nome}</h3>
                  <p>
                    Preço:{" "}
                    <span className="text-[var(--primary)] font-semibold">
                      R${" "}
                      {carro.preco.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCarroSelecionado(carro);
                    setModalEdicaoAberta(true);
                  }}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition"
                >
                  <FaEdit />
                  Editar
                </button>

                <button
                  onClick={() => {
                    setCarroSelecionado(carro);
                    setModalExclusaoAberto(true);
                  }}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer transition"
                >
                  <FaTrashAlt />
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>

        {!modoBusca && temMais && (
          <div className="text-center mt-4">
            <button
              onClick={buscarMaisCarros}
              disabled={carregandoMais}
              className="w-full rounded border border-[var(--primary)] text-center py-1.5 font-medium transition duration-300 ease hover:bg-[var(--primary)] hover:text-white block cursor-pointer"
            >
              {carregandoMais ? "Carregando..." : "Ver mais"}
            </button>
          </div>
        )}
      </div>

      {/* Modal de Exclusão */}
      {modalExclusaoAberto && carroSelecionado && (
        <div className="fixed inset-0 bg-[#000000a4] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-4 text-[var(--primary)]">
              Confirmar Exclusão
            </h3>
            <p className="mb-4">
              Tem certeza que deseja excluir o veículo{" "}
              <span className="font-semibold">{carroSelecionado.nome}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalExclusaoAberto(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => excluirCarro(carroSelecionado.id)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {modalEdicaoAberta && carroSelecionado && (
        <EditCarModal
          carro={carroSelecionado}
          onClose={() => setModalEdicaoAberta(false)}
          onUpdate={handleUpdateCar}
        />
      )}
    </div>
  );
}
