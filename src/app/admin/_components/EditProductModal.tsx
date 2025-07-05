"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/Product";
import { toast } from "react-toastify";
import Image from "next/image";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (updated: Product) => void;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Erro ao fazer upload da imagem");
  }

  const data = await res.json();
  return data.secure_url;
}

export default function EditProductModal({
  product,
  onClose,
  onUpdate,
}: EditProductModalProps) {
  const [form, setForm] = useState<Omit<Product, "id" | "image">>({
    name: product.name,
    description: product.description,
    price: product.price,
    promoEnabled: product.promoEnabled || false,
    promo: product.promo || 0,
    category: product.category,
    active: product.active ?? true,
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isNaN(Number(value))) {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product.image;

      if (newImage) {
        imageUrl = await uploadToCloudinary(newImage);
      }

      const updatedProduct: Product = {
        ...form,
        id: product.id,
        image: imageUrl,
      };

      await updateDoc(doc(db, "products", product.id), updatedProduct);
      toast.success("Produto atualizado com sucesso!");

      onUpdate(updatedProduct);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Erro ao atualizar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999 p-4">
      <div className="bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl text-[#2563eb]">
              Editar Produto
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl cursor-pointer"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Nome do Produto
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Preço (R$)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleNumberChange}
                  className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Categoria</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
                >
                  <option value="ias">IAs</option>
                  <option value="streamings">Streamings</option>
                  <option value="jogos">Jogos</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="promoEnabled"
                checked={form.promoEnabled}
                onChange={handleChange}
              />
              <label className="font-medium">Promoção</label>
            </div>

            {form.promoEnabled && (
              <div>
                <label className="block text-sm font-medium">
                  Preço Promocional (R$)
                </label>
                <input
                  type="number"
                  name="promo"
                  value={form.promo ?? ""}
                  onChange={handleNumberChange}
                  className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
                  step="0.01"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">
                Imagem do Produto
              </label>
              <div className="flex items-center flex-col gap-4 mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  className="w-full p-2 bg-slate-800 border border-blue-500 outline-none"
                />
                <div className="relative max-w-[400px] rounded overflow-hidden">
                  <Image
                    src={
                      newImage ? URL.createObjectURL(newImage) : product.image
                    }
                    alt="Preview"
                    width={1920}
                    height={1144}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg text-white hover:text-gray-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
