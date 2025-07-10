"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";
import {
  FaTrashAlt,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  active: boolean;
}

export default function AdminCoupons() {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(1);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [discountError] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const q = query(collection(db, "coupons"), orderBy("code", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Coupon, "id">),
      }));
      setCoupons(data);
    } catch (error) {
      console.error("Erro ao buscar cupons:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createCoupon() {
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedCode) {
      return toast.error("Digite um código para o cupom.", {
        className: "font-semibold text-black",
      });
    }

    if (discount < 1 || discount > 100) {
      return toast.error("A porcentagem deve ser entre 1 e 100.", {
        className: "font-semibold text-black",
      });
    }

    try {
      const q = query(
        collection(db, "coupons"),
        where("code", "==", trimmedCode)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return toast.error("Esse código de cupom já existe.", {
          className: "font-semibold text-black",
        });
      }

      await addDoc(collection(db, "coupons"), {
        code: trimmedCode,
        discount,
        active: true,
      });

      toast.success("Cupom criado com sucesso!", {
        className: "font-semibold text-black",
      });
      setCode("");
      setDiscount(10);
      fetchCoupons();
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      toast.error("Erro ao criar cupom.", {
        className: "font-semibold text-black",
      });
    }
  }

  async function deleteCoupon(id: string) {
    try {
      await deleteDoc(doc(db, "coupons", id));
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cupom excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
      toast.error("Erro ao excluir cupom.");
    }
  }

  async function toggleCoupon(coupon: Coupon) {
    try {
      await updateDoc(doc(db, "coupons", coupon.id), {
        active: !coupon.active,
      });
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, active: !c.active } : c))
      );
      toast.success(
        `Cupom ${!coupon.active ? "ativado" : "desativado"} com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao alternar status:", error);
      toast.error("Erro ao alterar status do cupom.");
    }
  }

  return (
    <div className="w-full max-w-5xl bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] p-6">
      <h2 className="text-3xl font-bold text-[#2563eb] mb-4">
        Gerenciar Cupons
      </h2>

      {/* Formulário de Criação */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">Novo Cupom:</label>
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              const input = e.target.value;
              const cleaned = input.replace(/\s+/g, "").toUpperCase(); // remove espaços e deixa em maiúsculas
              setCode(cleaned);
            }}
            placeholder="Código do cupom (ex: BEMVINDO10)"
            className="flex-1 p-2 bg-slate-800 border border-blue-500 outline-none rounded text-white"
          />

          <div className="flex flex-col">
            <input
              type="number"
              min={1}
              max={100}
              value={discount}
              onChange={(e) => {
                const value = Number(e.target.value);
                setDiscount(value);
              }}
              className={`w-24 p-2 bg-slate-800 border outline-none rounded text-white ${
                discountError ? "border-red-500" : "border-blue-500"
              }`}
            />
            {discountError && (
              <span className="text-sm text-red-500 mt-1">{discountError}</span>
            )}
          </div>

          <span className="text-white">%</span>
          <button
            onClick={createCoupon}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Criar
          </button>
        </div>
      </div>

      {/* Lista de Cupons */}
      <h3 className="text-xl font-semibold text-blue-400 mb-2">
        Cupons Existentes
      </h3>
      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : coupons.length === 0 ? (
        <p className="text-gray-400">Nenhum cupom encontrado.</p>
      ) : (
        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
          {coupons.map((coupon) => (
            <li
              key={coupon.id}
              className="flex justify-between max-md:flex-col max-md:gap-2 items-center bg-slate-900 p-3 rounded border border-slate-700"
            >
              <span className="text-white flex items-center gap-2">
                <FaTag className="text-yellow-300" />
                <span className="font-bold">{coupon.code}</span> -{" "}
                <span className="text-blue-400">{coupon.discount}%</span>
                {!coupon.active && (
                  <span className="ml-2 text-sm text-red-400">(inativo)</span>
                )}
              </span>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => deleteCoupon(coupon.id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer transition"
                >
                  <FaTrashAlt />
                  Excluir
                </button>
                <button
                  onClick={() => toggleCoupon(coupon)}
                  className={`flex items-center gap-1 text-white px-4 py-2 rounded cursor-pointer transition ${
                    coupon.active
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {coupon.active ? (
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
          ))}
        </ul>
      )}
    </div>
  );
}
