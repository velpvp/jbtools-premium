"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { FaTag, FaTrashAlt } from "react-icons/fa";

interface Coupon {
  id: string;
  text: string;
}

export default function AdminCoupons() {
  const [couponText, setCouponText] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const q = query(collection(db, "coupons"), orderBy("text", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
      })) as Coupon[];
      setCoupons(data);
    } catch (error) {
      console.error("Erro ao buscar cupons:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createCoupon() {
    if (!couponText.trim()) return;
    try {
      await addDoc(collection(db, "coupons"), { text: couponText.trim() });
      toast.success("Cupom criado com sucesso!", {
        className: "font-semibold text-black",
      });
      setCouponText("");
      fetchCoupons();
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      toast.error("Erro ao criar o cupom.", {
        className: "font-semibold text-black",
      });
    }
  }

  async function deleteCoupon(id: string) {
    try {
      await deleteDoc(doc(db, "coupons", id));
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cupom excluído com sucesso!", {
        className: "font-semibold text-black",
      });
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
      toast.error("Erro ao excluir o cupom.", {
        className: "font-semibold text-black",
      });
    }
  }

  return (
    <div className="w-full max-w-5xl bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] p-6">
      <h2 className="text-3xl font-bold text-[#2563eb] mb-4">
        Gerenciar Cupons
      </h2>

      <div className="mb-6">
        <label className="block text-white font-medium mb-2">Novo Cupom:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponText}
            onChange={(e) => setCouponText(e.target.value)}
            placeholder="Ex: 10% off na primeira compra"
            className="flex-1 p-2 bg-slate-800 border border-blue-500 outline-none rounded"
          />
          <button
            onClick={createCoupon}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Criar
          </button>
        </div>
      </div>

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
              className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700"
            >
              <span className="text-white flex items-center gap-2">
                <FaTag className="shrink-0 text-yellow-300" />
                {coupon.text}
              </span>
              <button
                onClick={() => deleteCoupon(coupon.id)}
                className="text-red-500 hover:text-red-700 transition cursor-pointer"
              >
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
