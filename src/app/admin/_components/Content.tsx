"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import ProductForm from "./ProductForm";
import AdminProducts from "./AdminProducts";
import AdminCoupons from "./AdminCupons";
import Footer from "@/components/Footer";
import Image from "next/image";
import logoFloating from "../../../../public/logo-floating.png";
import Link from "next/link";

export default function AdminContent() {
  const router = useRouter();
  const [view, setView] = useState<"form" | "manage" | "coupons">("form");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "jbtoolswebsite@gmail.com") {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <>
      <header className="w-full bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border-b border-b-[rgba(59,130,246,0.3)] flex justify-between items-center px-4 py-3">
        <Link href={`/`} className="logo">
          <div className="logo-icon">
            <Image
              src={logoFloating}
              alt="JBTools Logo"
              className="floating-logo"
            />
          </div>
        </Link>
        <nav className="flex gap-4">
          <button
            onClick={() => setView("form")}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              view === "form"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-blue-400 hover:bg-blue-600/20"
            } transition`}
          >
            Cadastrar Produto
          </button>
          <button
            onClick={() => setView("manage")}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              view === "manage"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-blue-400 hover:bg-blue-600/20"
            } transition`}
          >
            Gerenciar Produtos
          </button>
          <button
            onClick={() => setView("coupons")}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              view === "coupons"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-blue-400 hover:bg-blue-600/20"
            } transition`}
          >
            Cupons
          </button>
        </nav>
      </header>

      <main className="w-full flex justify-center items-center px-2 py-5 z-2 relative">
        {view === "form" && (
          <div className="w-full max-w-5xl bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] p-2">
            <div className="px-8 max-md:px-6 py-5">
              <h2 className="font-bold text-3xl mb-4 text-[#2563eb]">
                Cadastrar Produto
              </h2>
              <ProductForm />
            </div>
          </div>
        )}

        {view === "manage" && <AdminProducts />}
        {view === "coupons" && <AdminCoupons />}
      </main>

      <Footer />
    </>
  );
}
