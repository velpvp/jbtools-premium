"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Carro } from "@/types/Carro";
import { toast } from "react-toastify";
import Image from "next/image";

interface EditCarModalProps {
  carro: Carro;
  onClose: () => void;
  onUpdate: (updatedCar: Carro) => void;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );
  formData.append("quality", "auto");
  formData.append("fetch_format", "auto");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Falha no upload da imagem");
  }

  const data = await res.json();
  return data.secure_url;
}

export default function EditCarModal({
  carro,
  onClose,
  onUpdate,
}: EditCarModalProps) {
  const [form, setForm] = useState<
    Omit<Carro, "id" | "imagemCapa" | "galeria" | "criadoEm">
  >({
    nome: carro.nome,
    modelo: carro.modelo,
    descricao: carro.descricao,
    preco: carro.preco,
    quilometragem: carro.quilometragem,
    combustivel: carro.combustivel,
    ano: carro.ano,
    cor: carro.cor,
    cambio: carro.cambio,
    portas: carro.portas,
  });

  const [novaCapa, setNovaCapa] = useState<File | null>(null);
  const [novaGaleria, setNovaGaleria] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentGallery, setCurrentGallery] = useState<string[]>(carro.galeria);

  const MAX_GALLERY_IMAGES = 9;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isNaN(Number(value))) {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!form.modelo.trim()) newErrors.modelo = "Modelo é obrigatório";
    if (form.preco <= 0) newErrors.preco = "Preço deve ser maior que zero";
    if (form.quilometragem < 0)
      newErrors.quilometragem = "Quilometragem inválida";
    if (form.ano < 1900 || form.ano > new Date().getFullYear() + 1) {
      newErrors.ano = "Ano inválido";
    }
    if (!form.cor.trim()) newErrors.cor = "Cor é obrigatória";
    if (form.portas <= 0) newErrors.portas = "Número de portas inválido";
    if (!form.combustivel) newErrors.combustivel = "Combustível é obrigatório";
    if (!form.cambio) newErrors.cambio = "Câmbio é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRemoveGalleryImage = (index: number) => {
    setCurrentGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      let capaUrl = carro.imagemCapa;
      if (novaCapa) {
        capaUrl = await uploadToCloudinary(novaCapa);
      }

      const novasImagensUrls = await Promise.all(
        novaGaleria.map((file) => uploadToCloudinary(file))
      );

      const galeriaAtualizada = [...currentGallery, ...novasImagensUrls];

      const updatedCar = {
        ...form,
        imagemCapa: capaUrl,
        galeria: galeriaAtualizada,
      };

      await updateDoc(doc(db, "carros", carro.id), updatedCar);

      onUpdate({
        ...updatedCar,
        id: carro.id,
        criadoEm: carro.criadoEm,
      });

      toast.success("Veículo atualizado com sucesso!", {
        className: "font-semibold text-black",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      toast.error("Erro ao atualizar veículo. Tente novamente.", {
        className: "font-semibold text-black",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-3xl text-[var(--primary)]">
              Editar Veículo
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome e Modelo */}
              <div>
                <label className="text-sm font-medium">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className={`w-full p-2 bg-gray-200 outline-none ${
                    errors.nome ? "border-red-500" : ""
                  }`}
                />
                {errors.nome && (
                  <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  className={`w-full p-2 bg-gray-200 outline-none ${
                    errors.modelo ? "border-red-500" : ""
                  }`}
                />
                {errors.modelo && (
                  <p className="text-red-500 text-sm mt-1">{errors.modelo}</p>
                )}
              </div>

              {/* Preço e Quilometragem */}
              <div>
                <label className="text-sm font-medium">Preço (R$)</label>
                <input
                  type="number"
                  name="preco"
                  value={form.preco}
                  onChange={handleNumberChange}
                  className={`w-full p-2 bg-gray-200 outline-none ${
                    errors.preco ? "border-red-500" : ""
                  }`}
                  step="0.01"
                />
                {errors.preco && (
                  <p className="text-red-500 text-sm mt-1">{errors.preco}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Quilometragem</label>
                <input
                  type="number"
                  name="quilometragem"
                  value={form.quilometragem}
                  onChange={handleNumberChange}
                  className={`w-full p-2 bg-gray-200 outline-none ${
                    errors.quilometragem ? "border-red-500" : ""
                  }`}
                />
                {errors.quilometragem && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.quilometragem}
                  </p>
                )}
              </div>

              {/* Ano e Cor */}
              <div>
                <label className="text-sm font-medium">Ano</label>
                <input
                  type="number"
                  name="ano"
                  value={form.ano}
                  onChange={handleNumberChange}
                  className={`w-full p-2 bg-gray-200 outline-none ${
                    errors.ano ? "border-red-500" : ""
                  }`}
                />
                {errors.ano && (
                  <p className="text-red-500 text-sm mt-1">{errors.ano}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Cor</label>
                <input
                  type="text"
                  name="cor"
                  value={form.cor}
                  onChange={handleChange}
                  className={`w-full p-2 bg-gray-200 outline-none ${
                    errors.cor ? "border-red-500" : ""
                  }`}
                />
                {errors.cor && (
                  <p className="text-red-500 text-sm mt-1">{errors.cor}</p>
                )}
              </div>

              {/* Combustível e Câmbio */}
              <div>
                <label className="text-sm font-medium">Combustível</label>
                <select
                  name="combustivel"
                  value={form.combustivel}
                  onChange={handleChange}
                  className={`w-full p-2 bg-gray-200 outline-none ${
                    errors.combustivel ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Etanol">Etanol</option>
                  <option value="Flex">Flex</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Elétrico">Elétrico</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
                {errors.combustivel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.combustivel}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Câmbio</label>
                <select
                  name="cambio"
                  value={form.cambio}
                  onChange={handleChange}
                  className={`w-full p-2 bg-gray-200 outline-none ${
                    errors.cambio ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                  <option value="CVT">CVT</option>
                  <option value="Automatizado">Automatizado</option>
                </select>
                {errors.cambio && (
                  <p className="text-red-500 text-sm mt-1">{errors.cambio}</p>
                )}
              </div>

              {/* Portas */}
              <div>
                <label className="text-sm font-medium">Portas</label>
                <input
                  type="number"
                  name="portas"
                  value={form.portas}
                  onChange={handleNumberChange}
                  className={`w-full p-2 bg-gray-200 outline-none ${
                    errors.portas ? "border-red-500" : ""
                  }`}
                  min="1"
                />
                {errors.portas && (
                  <p className="text-red-500 text-sm mt-1">{errors.portas}</p>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 bg-gray-200 outline-none"
              />
            </div>

            {/* Imagem de Capa */}
            <div>
              <label className="text-sm font-medium">Imagem de Capa</label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-1/3">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={
                        novaCapa
                          ? URL.createObjectURL(novaCapa)
                          : carro.imagemCapa
                      }
                      alt="Capa do veículo"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNovaCapa(e.target.files?.[0] || null)}
                    className="w-full p-2 bg-gray-200 outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Selecione uma nova imagem para substituir a atual
                  </p>
                </div>
              </div>
            </div>

            {/* Galeria de Imagens */}
            <div>
              <label className="text-sm font-medium">
                Galeria de Imagens ({currentGallery.length + novaGaleria.length}
                /{MAX_GALLERY_IMAGES})
              </label>

              {/* Imagens atuais */}
              {currentGallery.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Imagens Atuais
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {currentGallery.map((img, index) => (
                      <div key={`current-${index}`} className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={img}
                            alt={`Imagem ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2 transition duration-300 ease hover:opacity-[0.8] cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Novas imagens */}
              {novaGaleria.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Novas Imagens
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {novaGaleria.map((file, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Nova imagem ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setNovaGaleria((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2 transition duration-300 ease hover:opacity-[0.8] cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload de novas imagens */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const availableSlots =
                      MAX_GALLERY_IMAGES -
                      (currentGallery.length + novaGaleria.length);

                    if (files.length > availableSlots) {
                      toast.error(
                        `Você só pode adicionar mais ${availableSlots} imagens.`
                      );
                      return;
                    }

                    setNovaGaleria((prev) => [...prev, ...files]);
                  }}
                  disabled={
                    currentGallery.length + novaGaleria.length >=
                    MAX_GALLERY_IMAGES
                  }
                  className="w-full p-2 bg-gray-200 outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Adicione até {MAX_GALLERY_IMAGES} imagens no total
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-500 rounded-lg text-white hover:bg-green-600 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
