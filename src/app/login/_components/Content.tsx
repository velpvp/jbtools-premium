"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const fazerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setErro("Erro interno: Firebase não inicializado.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/admin");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            setErro("Usuário não encontrado.");
            break;
          case "auth/wrong-password":
            setErro("Senha incorreta.");
            break;
          case "auth/invalid-email":
            setErro("Email inválido.");
            break;
          case "auth/invalid-credential":
            setErro("Email ou senha inválidos.");
            break;
          default:
            setErro("Erro ao fazer login. Tente novamente.");
        }
      } else {
        setErro("Erro inesperado. Tente novamente.");
      }
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[90vh] flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={fazerLogin}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold mb-4 text-center text-[var(--primary)]">
            Acessar Painel
          </h1>
          {erro && <p className="text-red-500 text-sm mb-2">{erro}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-gray-200 outline-none mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 bg-gray-200 outline-none mb-4"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
