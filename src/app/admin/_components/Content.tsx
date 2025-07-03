"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import CarForm from "./CarForm";
import AdminCars from "./AdminCars";

import Image from "next/image";
import logo from "../../../../public/logo.webp";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function AdminContent() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "velpvp5@gmail.com") {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <>
      <header className="w-full bg-white flex justify-center items-center">
        <Image src={logo} alt="Logo Autoshop" className="max-w-[110px]" />
      </header>
      <main className="flex justify-center items-center px-2 py-5">
        <div className="w-full max-w-5xl bg-white p-2">
          <div className="px-8 max-md:px-6 py-5">
            <h2 className="font-bold text-3xl mb-4 text-[var(--primary)]">
              Cadastrar Veículo
            </h2>
            <div>
              <CarForm />
              <AdminCars />
              <Link
                href="../"
                className="fixed left-3 bottom-3 bg-black text-white px-4 py-2 text-sm font-medium flex justify-center items-center gap-1 rounded-full transition duration-300 ease hover:opacity-[0.9]"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
