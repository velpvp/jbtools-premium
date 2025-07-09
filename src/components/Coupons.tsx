"use client";
import { useEffect, useState } from "react";
import { FaTag } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Coupons() {
  const [coupons, setCoupons] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const snapshot = await getDocs(collection(db, "coupons"));
        const loadedCoupons = snapshot.docs.map((doc) => doc.data().text);
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
            {cupom}
          </span>
        ))}
      </div>
    </div>
  );
}
