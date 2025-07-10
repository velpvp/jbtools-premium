"use client";
import { useEffect, useState } from "react";
import { FaTag } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Coupon {
  code: string;
  discount: number;
}

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const q = query(collection(db, "coupons"), where("active", "==", true));
        const snapshot = await getDocs(q);
        const loadedCoupons = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            code: data.code,
            discount: data.discount,
          };
        });
        setCoupons(loadedCoupons);
      } catch (err) {
        console.error("Erro ao buscar cupons:", err);
      }
    }

    fetchCoupons();
  }, []);

  if (coupons.length === 0) return null;

  return (
    <div className="mb-2 overflow-hidden whitespace-nowrap w-full bg-blue-950 descontos">
      <div className="animate-slide inline-block">
        {coupons.map((cupom, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 text-white font-semibold px-4 py-2 uppercase"
          >
            <FaTag className="shrink-0 text-yellow-300" />
            USE O CUPOM{" "}
            <span className="text-yellow-300">&apos;{cupom.code}&apos;</span> E
            TENHA <span className="text-yellow-300">{cupom.discount}%</span> OFF
            EM SUA COMPRA
          </span>
        ))}
      </div>
    </div>
  );
}
