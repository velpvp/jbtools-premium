"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Carro } from "@/types/Carro";
import CarCard from "@/components/CarCard";
import { Search, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function EstoqueContent() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const searchParams = useSearchParams();
  const buscaInicial = searchParams.get("busca") || "";
  const [busca, setBusca] = useState(buscaInicial);
  const [combustivel, setCombustivel] = useState("");
  const [cambio, setCambio] = useState("");
  const [anoMin, setAnoMin] = useState("");
  const [anoMax, setAnoMax] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [kmMin, setKmMin] = useState("");
  const [kmMax, setKmMax] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const carrosPorPagina = 21;

  useEffect(() => {
    async function fetchCarros() {
      const querySnapshot = await getDocs(collection(db, "carros"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Carro[];
      setCarros(data);
    }
    fetchCarros();
  }, []);

  // Sempre que filtros ou busca mudarem, volta para a página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [
    busca,
    combustivel,
    cambio,
    anoMin,
    anoMax,
    precoMin,
    precoMax,
    kmMin,
    kmMax,
    ordenarPor,
  ]);

  // Filtro e ordenação
  const carrosFiltrados = carros
    .filter((carro) => {
      const nomeMatch = carro.nome.toLowerCase().includes(busca.toLowerCase());
      const combustivelMatch =
        !combustivel || carro.combustivel === combustivel;
      const cambioMatch = !cambio || carro.cambio === cambio;
      const anoMinMatch = !anoMin || carro.ano >= parseInt(anoMin);
      const anoMaxMatch = !anoMax || carro.ano <= parseInt(anoMax);
      const precoMinMatch = !precoMin || carro.preco >= parseFloat(precoMin);
      const precoMaxMatch = !precoMax || carro.preco <= parseFloat(precoMax);
      const kmMinMatch = !kmMin || carro.quilometragem >= parseInt(kmMin);
      const kmMaxMatch = !kmMax || carro.quilometragem <= parseInt(kmMax);

      return (
        nomeMatch &&
        combustivelMatch &&
        cambioMatch &&
        anoMinMatch &&
        anoMaxMatch &&
        precoMinMatch &&
        precoMaxMatch &&
        kmMinMatch &&
        kmMaxMatch
      );
    })
    .sort((a, b) => {
      switch (ordenarPor) {
        case "preco-asc":
          return a.preco - b.preco;
        case "preco-desc":
          return b.preco - a.preco;
        case "ano-desc":
          return b.ano - a.ano;
        case "ano-asc":
          return a.ano - b.ano;
        default:
          return 0;
      }
    });

  // Paginacao
  const indiceInicial = (paginaAtual - 1) * carrosPorPagina;
  const indiceFinal = indiceInicial + carrosPorPagina;
  const carrosPaginados = carrosFiltrados.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(carrosFiltrados.length / carrosPorPagina);

  // Função para trocar página com limites
  function irParaPagina(numero: number) {
    if (numero < 1) numero = 1;
    else if (numero > totalPaginas) numero = totalPaginas;
    setPaginaAtual(numero);
  }

  return (
    <>
      <main className="flex justify-center item-center gap-5 px-2 py-5 min-h-screen">
        {/* Sidebar filtros desktop */}
        <div className="hidden md:block basis-1/5 w-full sticky top-4 self-start bg-white px-4 py-6 text-center justify-center items-center flex-col shadow rounded">
          <h2 className="font-bold text-2xl mb-4">Filtros</h2>
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="w-full text-start">
              <label htmlFor="order" className="text-sm font-semibold">
                Ordenar por
              </label>
              <select
                id="order"
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value)}
                className="w-full p-2 bg-gray-200 outline-none"
              >
                <option value="">Selecione</option>
                <option value="preco-asc">Preço (menor para maior)</option>
                <option value="preco-desc">Preço (maior para menor)</option>
                <option value="ano-desc">Ano (mais novo)</option>
                <option value="ano-asc">Ano (mais antigo)</option>
              </select>
            </div>
            <div className="w-full text-start">
              <label htmlFor="combustivel" className="text-sm font-semibold">
                Combustível
              </label>
              <select
                id="combustivel"
                value={combustivel}
                onChange={(e) => setCombustivel(e.target.value)}
                className="w-full p-2 bg-gray-200 outline-none"
              >
                <option value="">Selecione</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Álcool">Álcool</option>
                <option value="Flex">Flex</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <div className="w-full text-start">
              <label htmlFor="cambio" className="text-sm font-semibold">
                Câmbio
              </label>
              <select
                id="cambio"
                value={cambio}
                onChange={(e) => setCambio(e.target.value)}
                className="w-full p-2 bg-gray-200 outline-none"
              >
                <option value="">Selecione</option>
                <option value="Manual">Manual</option>
                <option value="Automático">Automático</option>
              </select>
            </div>

            <div className="w-full text-start">
              <label className="text-sm font-semibold">Ano</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="Do ano"
                  value={anoMin}
                  onChange={(e) => setAnoMin(e.target.value)}
                  className="w-full p-2 bg-gray-200 outline-none"
                />
                <input
                  type="number"
                  placeholder="Até ano"
                  value={anoMax}
                  onChange={(e) => setAnoMax(e.target.value)}
                  className="w-full p-2 bg-gray-200 outline-none"
                />
              </div>
            </div>

            <div className="w-full text-start">
              <label className="text-sm font-semibold">Preço</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="Min."
                  value={precoMin}
                  onChange={(e) => setPrecoMin(e.target.value)}
                  className="w-full p-2 bg-gray-200 outline-none"
                />
                <input
                  type="number"
                  placeholder="Max."
                  value={precoMax}
                  onChange={(e) => setPrecoMax(e.target.value)}
                  className="w-full p-2 bg-gray-200 outline-none"
                />
              </div>
            </div>

            <div className="w-full text-start">
              <label className="text-sm font-semibold">Quilometragem</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="Min."
                  value={kmMin}
                  onChange={(e) => setKmMin(e.target.value)}
                  className="w-full p-2 bg-gray-200 outline-none"
                />
                <input
                  type="number"
                  placeholder="Max."
                  value={kmMax}
                  onChange={(e) => setKmMax(e.target.value)}
                  className="w-full p-2 bg-gray-200 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-[80%] max-md:w-full bg-white px-4 sm:px-8 py-5 rounded shadow">
          <h1 className="font-bold text-3xl mb-2 text-[var(--primary)]">
            Estoque de Veículos
          </h1>

          {/* Busca */}
          <div className="flex bg-gray-200 rounded mb-4">
            <input
              type="text"
              placeholder="Buscar por nome ou modelo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full h-12 outline-none px-3 rounded-tl rounded-bl"
            />
            <Search className="w-12 h-12 p-2 bg-[var(--primary)] text-white rounded-tr rounded-br" />
          </div>

          {/* Botão filtros mobile */}
          <div className="md:hidden flex justify-end mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-[var(--primary)] text-white rounded shadow transition duration-300 ease hover:bg-[var(--primary-hover)] hover:text-gray-200"
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>

          {/* Lista de carros da página atual */}
          {carrosPaginados.length === 0 ? (
            <p className="text-center">Nenhum veículo foi encontrado</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {carrosPaginados.map((carro) => (
                <CarCard key={carro.id} carro={carro} />
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => irParaPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 cursor-pointer"
              >
                Anterior
              </button>

              {/* Números das páginas */}
              {[...Array(totalPaginas)]
                .map((_, i) => i + 1)
                .map((numero) => {
                  // Mostrar: primeira, última, atual, vizinhas da atual
                  const isFirst = numero === 1;
                  const isLast = numero === totalPaginas;
                  const isCurrent = numero === paginaAtual;
                  const isNear = Math.abs(numero - paginaAtual) <= 1;

                  if (isFirst || isLast || isCurrent || isNear) {
                    return (
                      <button
                        key={numero}
                        onClick={() => irParaPagina(numero)}
                        className={`px-3 py-1 rounded border cursor-pointer ${
                          paginaAtual === numero
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "border-gray-300"
                        }`}
                      >
                        {numero}
                      </button>
                    );
                  }

                  // Mostrar "..." em lugares específicos
                  if (
                    (numero === paginaAtual - 2 && numero > 2) ||
                    (numero === paginaAtual + 2 && numero < totalPaginas - 1)
                  ) {
                    return (
                      <span key={numero} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

              <button
                onClick={() => irParaPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 cursor-pointer"
              >
                Próxima
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-end md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                className="w-3/4 max-w-xs h-full bg-white p-5 shadow-lg overflow-y-auto relative"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                  onClick={() => setSidebarOpen(false)}
                >
                  ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Filtros</h2>

                <div className="flex flex-col justify-center items-center gap-4">
                  <div className="w-full text-start">
                    <label htmlFor="order" className="text-sm font-semibold">
                      Ordenar por
                    </label>
                    <select
                      id="order"
                      value={ordenarPor}
                      onChange={(e) => setOrdenarPor(e.target.value)}
                      className="w-full p-2 bg-gray-200 outline-none"
                    >
                      <option value="">Selecione</option>
                      <option value="preco-asc">
                        Preço (menor para maior)
                      </option>
                      <option value="preco-desc">
                        Preço (maior para menor)
                      </option>
                      <option value="ano-desc">Ano (mais novo)</option>
                      <option value="ano-asc">Ano (mais antigo)</option>
                    </select>
                  </div>
                  <div className="w-full text-start">
                    <label
                      htmlFor="combustivel"
                      className="text-sm font-semibold"
                    >
                      Combustível
                    </label>
                    <select
                      id="combustivel"
                      value={combustivel}
                      onChange={(e) => setCombustivel(e.target.value)}
                      className="w-full p-2 bg-gray-200 outline-none"
                    >
                      <option value="">Selecione</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Álcool">Álcool</option>
                      <option value="Flex">Flex</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                  </div>

                  <div className="w-full text-start">
                    <label htmlFor="cambio" className="text-sm font-semibold">
                      Câmbio
                    </label>
                    <select
                      id="cambio"
                      value={cambio}
                      onChange={(e) => setCambio(e.target.value)}
                      className="w-full p-2 bg-gray-200 outline-none"
                    >
                      <option value="">Selecione</option>
                      <option value="Manual">Manual</option>
                      <option value="Automático">Automático</option>
                    </select>
                  </div>

                  <div className="w-full text-start">
                    <label className="text-sm font-semibold">Ano</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="Do ano"
                        value={anoMin}
                        onChange={(e) => setAnoMin(e.target.value)}
                        className="w-full p-2 bg-gray-200 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Até ano"
                        value={anoMax}
                        onChange={(e) => setAnoMax(e.target.value)}
                        className="w-full p-2 bg-gray-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="w-full text-start">
                    <label className="text-sm font-semibold">Preço</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="Min."
                        value={precoMin}
                        onChange={(e) => setPrecoMin(e.target.value)}
                        className="w-full p-2 bg-gray-200 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Max."
                        value={precoMax}
                        onChange={(e) => setPrecoMax(e.target.value)}
                        className="w-full p-2 bg-gray-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="w-full text-start">
                    <label className="text-sm font-semibold">
                      Quilometragem
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="Min."
                        value={kmMin}
                        onChange={(e) => setKmMin(e.target.value)}
                        className="w-full p-2 bg-gray-200 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Max."
                        value={kmMax}
                        onChange={(e) => setKmMax(e.target.value)}
                        className="w-full p-2 bg-gray-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
