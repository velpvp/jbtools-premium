"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    promo: "",
    active: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [promoEnabled, setPromoEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const newErrors: typeof errors = {};

    if (!form.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!form.description.trim())
      newErrors.description = "Descrição é obrigatória";
    if (!form.category) newErrors.category = "Categoria é obrigatória";
    if (!form.price || Number(form.price) <= 0)
      newErrors.price = "Preço inválido";
    if (promoEnabled && (!form.promo || Number(form.promo) <= 0))
      newErrors.promo = "Preço promocional inválido";
    if (!image) newErrors.image = "Imagem é obrigatória";

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
    if (!validate()) return;

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(image!);

      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        promo: promoEnabled && form.promo ? Number(form.promo) : null,
        promoEnabled,
        image: imageUrl,
        active: form.active,
        createdAt: Timestamp.now(),
      });

      toast.success("Produto cadastrado com sucesso!");
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        promo: "",
        active: true,
      });
      setImage(null);
      setPromoEnabled(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar o produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nome do Produto</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Digite o nome do produto"
          className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Descrição</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Digite a descrição do produto"
          className="w-full p-2 bg-slate-800 border border-blue-500 outline-none min-h-[120px]"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Preço</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Digite o preço do produto"
          className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={promoEnabled}
            onChange={() => setPromoEnabled((prev) => !prev)}
          />
          Ativar promoção
        </label>
      </div>

      {promoEnabled && (
        <div>
          <label className="block text-sm font-medium">Preço Promocional</label>
          <input
            type="number"
            name="promo"
            value={form.promo}
            onChange={handleChange}
            placeholder="Digite o preço promocional do produto"
            className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
          />
          {errors.promo && (
            <p className="text-red-500 text-sm">{errors.promo}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Categoria</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
        >
          <option value="">Selecione a categoria</option>
          <option value="Ias">IAs</option>
          <option value="Streamings">Streamings</option>
          <option value="Jogos">Jogos</option>
          <option value="Outros">Outros</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Imagem do produto</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        {image && (
          <div className="mt-2 relative w-[230px] rounded">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview da imagem do produto"
              className="object-cover w-full h-full aspect-video rounded shadow-xl"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-1.5 transition duration-300 ease hover:opacity-80 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Cadastrando..." : "Cadastrar Produto"}
        </button>
      </div>
    </form>
  );
}
