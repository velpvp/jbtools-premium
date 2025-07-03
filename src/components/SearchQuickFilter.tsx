"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchQuickFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  function handleSearch() {
    if (searchTerm.trim() !== "") {
      router.push(`/estoque?busca=${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="max-md:w-full mx-4 flex bg-gray-300 rounded">
        <input
          type="text"
          placeholder="Pesquise por um veículo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-120 max-md:w-full h-12 outline-none px-3 rounded-tl rounded-bl"
        />
        <button onClick={handleSearch}>
          <Search
            aria-label="Pesquisar por veículo"
            className="w-12 h-12 p-2 bg-[var(--primary)] text-white rounded-tr rounded-br transition duration-300 ease hover:bg-[var(--primary-hover)] hover:text-gray-200 cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
}
