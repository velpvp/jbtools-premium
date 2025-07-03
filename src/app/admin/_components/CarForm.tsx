"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";

const MAX_GALLERY_IMAGES = 9;

export default function CarForm() {
  const [form, setForm] = useState({
    nome: "",
    modelo: "",
    descricao: "",
    preco: "",
    quilometragem: "",
    combustivel: "",
    ano: "",
    cor: "",
    cambio: "",
    portas: "",
  });

  const [capa, setCapa] = useState<File | null>(null);
  const [galeria, setGaleria] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validarCampos() {
    const newErrors: typeof errors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "Campo obrigatório";
    });

    if (!capa) newErrors["capa"] = "A imagem de capa é obrigatória";
    if (galeria.length === 0)
      newErrors["galeria"] = "Adicione pelo menos uma imagem na galeria";
    if (galeria.length > MAX_GALLERY_IMAGES)
      newErrors["galeria"] = `Máximo de ${MAX_GALLERY_IMAGES} imagens`;

    if (Number(form.preco) <= 0)
      newErrors.preco = "Preço deve ser maior que zero";
    if (Number(form.quilometragem) < 0)
      newErrors.quilometragem = "Quilometragem inválida";
    const anoAtual = new Date().getFullYear();
    if (Number(form.ano) < 1900 || Number(form.ano) > anoAtual + 1)
      newErrors.ano = "Ano inválido";
    if (Number(form.portas) <= 0)
      newErrors.portas = "Número de portas inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function uploadToCloudinary(file: File): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();
    return data.secure_url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validarCampos()) return;

    setLoading(true);

    try {
      const capaUrl = await uploadToCloudinary(capa!);
      const galeriaUrls = await Promise.all(galeria.map(uploadToCloudinary));

      await addDoc(collection(db, "carros"), {
        ...form,
        preco: Number(form.preco),
        quilometragem: Number(form.quilometragem),
        ano: Number(form.ano),
        portas: Number(form.portas),
        imagemCapa: capaUrl,
        galeria: galeriaUrls,
        criadoEm: Timestamp.now(),
      });

      setForm({
        nome: "",
        modelo: "",
        descricao: "",
        preco: "",
        quilometragem: "",
        combustivel: "",
        ano: "",
        cor: "",
        cambio: "",
        portas: "",
      });
      setCapa(null);
      setGaleria([]);
      toast.success("Veículo cadastrado com sucesso!", {
        className: "font-semibold text-black",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar o veículo", {
        className: "font-semibold text-black",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Linha com dois inputs: Nome e Modelo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="text-sm font-medium">
            Nome do veículo:
          </label>
          <input
            type="text"
            name="nome"
            placeholder="Digite o nome do veículo"
            value={form.nome}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 outline-none"
          />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
        </div>

        <div>
          <label htmlFor="modelo" className="text-sm font-medium">
            Modelo:
          </label>
          <input
            type="text"
            name="modelo"
            placeholder="Digite o modelo do veículo"
            value={form.modelo}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 outline-none"
          />
          {errors.modelo && (
            <p className="text-red-500 text-sm">{errors.modelo}</p>
          )}
        </div>
      </div>

      {/* Descrição ocupa a linha toda */}
      <div>
        <label htmlFor="descricao" className="text-sm font-medium">
          Descrição:
        </label>
        <textarea
          name="descricao"
          placeholder="Digite a descrição do veículo"
          value={form.descricao}
          onChange={handleChange}
          className="w-full p-2 bg-gray-200 outline-none min-h-[150px]"
        />
        {errors.descricao && (
          <p className="text-red-500 text-sm">{errors.descricao}</p>
        )}
      </div>

      {/* Linha com três inputs: Preço, Quilometragem, Ano */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="preco" className="text-sm font-medium">
            Preço:
          </label>
          <input
            type="number"
            name="preco"
            placeholder="Digite o preço do veículo"
            value={form.preco}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 outline-none"
          />
          {errors.preco && (
            <p className="text-red-500 text-sm">{errors.preco}</p>
          )}
        </div>

        <div>
          <label htmlFor="quilometragem" className="text-sm font-medium">
            Quilometragem:
          </label>
          <input
            type="number"
            name="quilometragem"
            placeholder="Digite a quilometragem do veículo"
            value={form.quilometragem}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 outline-none"
          />
          {errors.quilometragem && (
            <p className="text-red-500 text-sm">{errors.quilometragem}</p>
          )}
        </div>

        <div>
          <label htmlFor="ano" className="text-sm font-medium">
            Ano:
          </label>
          <input
            type="number"
            name="ano"
            placeholder="Digite o ano do veículo"
            value={form.ano}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 outline-none"
          />
          {errors.ano && <p className="text-red-500 text-sm">{errors.ano}</p>}
        </div>
      </div>

      {/* Linha com três inputs: Cor, Portas, Combustível */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="cor" className="text-sm font-medium">
            Cor:
          </label>
          <input
            type="text"
            name="cor"
            placeholder="Digite a cor do veículo"
            value={form.cor}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 outline-none"
          />
          {errors.cor && <p className="text-red-500 text-sm">{errors.cor}</p>}
        </div>

        <div>
          <label htmlFor="portas" className="text-sm font-medium">
            Portas:
          </label>
          <input
            type="number"
            name="portas"
            placeholder="Digite a quantidade de portas do veículo"
            value={form.portas}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 outline-none"
          />
          {errors.portas && (
            <p className="text-red-500 text-sm">{errors.portas}</p>
          )}
        </div>

        <div>
          <label htmlFor="combustivel" className="text-sm font-medium">
            Tipo de combustível:
          </label>
          <select
            name="combustivel"
            value={form.combustivel}
            onChange={handleChange}
            className="w-full p-2 bg-gray-200 outline-none"
          >
            <option value="">Selecione o tipo de combustível</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Etanol">Etanol</option>
            <option value="Flex">Flex</option>
            <option value="Diesel">Diesel</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Híbrido">Híbrido</option>
          </select>
          {errors.combustivel && (
            <p className="text-red-500 text-sm">{errors.combustivel}</p>
          )}
        </div>
      </div>

      {/* Câmbio (sozinho) */}
      <div>
        <label htmlFor="cambio" className="text-sm font-medium">
          Tipo de câmbio:
        </label>
        <select
          name="cambio"
          value={form.cambio}
          onChange={handleChange}
          className="w-full p-2 bg-gray-200 outline-none"
        >
          <option value="">Selecione o tipo de câmbio</option>
          <option value="Manual">Manual</option>
          <option value="Automático">Automático</option>
          <option value="CVT">CVT</option>
          <option value="Automatizado">Automatizado</option>
        </select>
        {errors.cambio && (
          <p className="text-red-500 text-sm">{errors.cambio}</p>
        )}
      </div>

      {/* Uploads */}
      <div>
        <label htmlFor="capa" className="text-sm font-medium">
          Imagem de capa:
        </label>
        <input
          name="capa"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setCapa(file);
          }}
          className="w-full p-2 bg-gray-200 outline-none"
        />
        {errors.capa && <p className="text-red-500 text-sm">{errors.capa}</p>}
        {capa && (
          <div className="mt-2 w-[230px] relative rounded">
            <img
              src={URL.createObjectURL(capa)}
              alt="Preview da capa do veículo"
              className="object-cover w-full h-full aspect-video rounded shadow-xl"
            />
            <button
              onClick={() => setCapa(null)}
              type="button"
              className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-1.5 transition duration-300 ease hover:opacity-[0.8] cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Galeria com previews e remoção */}
      <div>
        <label htmlFor="galeria" className="text-sm font-medium">
          Imagens da galeria (até {MAX_GALLERY_IMAGES}):
        </label>
        <input
          name="galeria"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const total = galeria.length + files.length;
            if (total > MAX_GALLERY_IMAGES) {
              toast.error(
                `Máximo de ${MAX_GALLERY_IMAGES} imagens na galeria.`
              );
              return;
            }
            setGaleria((prev) => [...prev, ...files]);
          }}
          className="w-full p-2 bg-gray-200 outline-none"
        />
        {errors.galeria && (
          <p className="text-red-500 text-sm">{errors.galeria}</p>
        )}
        {galeria.length > 0 && (
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {galeria.map((img, idx) => (
              <div key={idx} className="relative w-full rounded">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Imagem ${idx + 1}`}
                  className="object-cover w-full h-full aspect-video rounded shadow-xl"
                />
                <button
                  type="button"
                  onClick={() =>
                    setGaleria((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-1.5 transition duration-300 ease hover:opacity-[0.8] cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
