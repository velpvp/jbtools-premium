"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/Product";
import { toast } from "react-toastify";
import Image from "next/image";

interface Variation {
  name: string;
  price: number | "";
}

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

  const res = await fetch(url, { method: "POST", body: formData });

  if (!res.ok) throw new Error("Erro ao fazer upload da imagem");

  const data = await res.json();
  return data.secure_url;
}

export default function EditProductModal({
  product,
  onClose,
  onUpdate,
}: EditProductModalProps) {
  const [form, setForm] = useState<
    Omit<Product, "id" | "image" | "variations">
  >({
    name: product.name,
    description: product.description,
    price: product.price ?? null,
    promo: product.promo ?? null,
    promoEnabled: product.promoEnabled ?? false,
    category: product.category,
    active: product.active ?? true,
  });

  const [variations, setVariations] = useState<Variation[]>(
    product.variations?.length
      ? product.variations.map((v) => ({
          name: v.name,
          price: v.price,
        }))
      : []
  );

  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const hasValidVariations = variations.some(
    (v) => v.name.trim() !== "" && v.price !== "" && !isNaN(Number(v.price))
  );

  useEffect(() => {
    if (hasValidVariations) {
      setForm((prev) => ({
        ...prev,
        price: null,
        promo: null,
        promoEnabled: false,
      }));
    }
  }, [hasValidVariations]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleVariationChange = (
    index: number,
    field: "name" | "price",
    value: string
  ) => {
    setVariations((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              [field]:
                field === "price" ? (value === "" ? "" : Number(value)) : value,
            }
          : v
      )
    );
  };

  const addVariation = () => {
    setVariations((prev) => [...prev, { name: "", price: "" }]);
  };

  const removeVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!form.name.trim()) return toast.error("Nome é obrigatório"), false;
    if (!form.description.trim())
      return toast.error("Descrição é obrigatória"), false;
    if (!form.category) return toast.error("Categoria é obrigatória"), false;

    if (!hasValidVariations) {
      if (form.price == null || form.price <= 0)
        return toast.error("Preço inválido"), false;

      if (form.promoEnabled && (form.promo == null || form.promo <= 0))
        return toast.error("Promoção inválida"), false;
    } else {
      for (const v of variations) {
        if (v.name.trim() === "" || v.price === "" || Number(v.price) <= 0)
          return (
            toast.error("Todas variações devem ter nome e preço válidos"), false
          );
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      let imageUrl = product.image;
      if (newImage) imageUrl = await uploadToCloudinary(newImage);

      const updatedProduct: Product = {
        id: product.id,
        name: form.name,
        description: form.description,
        category: form.category,
        active: form.active,
        image: imageUrl,
        price: hasValidVariations ? null : Number(form.price),
        promo: hasValidVariations
          ? null
          : form.promo == null
          ? null
          : form.promo,

        promoEnabled: hasValidVariations ? false : form.promoEnabled,
        variations: hasValidVariations
          ? variations
              .filter((v) => v.name.trim() !== "" && v.price !== "")
              .map((v) => ({
                name: v.name.trim(),
                price: Number(v.price),
              }))
          : [],
      };

      await updateDoc(doc(db, "products", product.id), updatedProduct);
      toast.success("Produto atualizado com sucesso!");
      onUpdate(updatedProduct);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-500">Editar Produto</h2>
            <button
              onClick={onClose}
              type="button"
              className="text-white text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Nome */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome do produto"
            className="w-full p-2 bg-slate-800 border border-blue-500"
          />

          {/* Descrição */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descrição"
            className="w-full p-2 bg-slate-800 border border-blue-500"
            rows={3}
          />

          {/* Categoria */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-blue-500"
          >
            <option value="">Selecione a categoria</option>
            <option value="ias">IAs</option>
            <option value="streamings">Streamings</option>
            <option value="jogos">Jogos</option>
            <option value="outros">Outros</option>
          </select>

          {/* Preço (se não tiver variações) */}
          {!hasValidVariations && (
            <>
              <input
                name="price"
                type="number"
                value={form.price ?? ""}
                onChange={handleNumberChange}
                className="w-full p-2 bg-slate-800 border border-blue-500"
                placeholder="Preço"
                step="0.01"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="promoEnabled"
                  checked={form.promoEnabled}
                  onChange={handleChange}
                />
                Promoção ativa
              </label>
              {form.promoEnabled && (
                <input
                  name="promo"
                  type="number"
                  value={form.promo ?? ""}
                  onChange={handleNumberChange}
                  className="w-full p-2 bg-slate-800 border border-blue-500"
                  placeholder="Preço promocional"
                  step="0.01"
                />
              )}
            </>
          )}

          {/* Variações */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Variações</h3>
              <button
                type="button"
                onClick={addVariation}
                className="text-blue-400 text-sm"
              >
                + Adicionar
              </button>
            </div>
            {variations.map((v, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Nome"
                  value={v.name}
                  onChange={(e) =>
                    handleVariationChange(i, "name", e.target.value)
                  }
                  className="flex-1 p-2 bg-slate-800 border border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Preço"
                  value={v.price}
                  onChange={(e) =>
                    handleVariationChange(i, "price", e.target.value)
                  }
                  className="w-32 p-2 bg-slate-800 border border-blue-500"
                  step="0.01"
                />
                <button
                  onClick={() => removeVariation(i)}
                  type="button"
                  className="text-red-500 font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Imagem */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
              className="w-full p-2 bg-slate-800 border border-blue-500"
            />
            <div className="mt-2">
              <Image
                src={newImage ? URL.createObjectURL(newImage) : product.image}
                alt="Preview"
                width={400}
                height={300}
                className="object-cover rounded"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white hover:text-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
