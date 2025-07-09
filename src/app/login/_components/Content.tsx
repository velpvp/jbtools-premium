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
      <main className="min-h-[90vh] flex items-center justify-center p-4">
        <form
          onSubmit={fazerLogin}
          className="bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] p-6 rounded-lg shadow-md w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold mb-4 text-center text-[#2563eb]">
            Acessar Painel
          </h1>
          {erro && <p className="text-red-500 text-sm mb-2">{erro}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border-b border-b-[rgba(59,130,246,0.3)] outline-none mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 border-b border-b-[rgba(59,130,246,0.3)] outline-none mb-2"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-[#2563eb] hover:bg-[#1d4ed8] transition text-white py-2 rounded cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </main>
    </>
  );
}
