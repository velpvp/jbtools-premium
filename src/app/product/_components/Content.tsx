"use client";

import "./style.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/Product";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaTag,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaCreditCard,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function ProductContent() {
  const params = useParams();
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<{
    name: string;
    price: number;
  } | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Defina o tipo Variation para as variações
          type Variation = {
            name: string;
            price: number;
          };

          const variations: Variation[] = data.variations ?? [];

          setProduct({
            id: docSnap.id,
            name: data.name,
            description: data.description,
            image: data.image,
            price: data.price,
            category: data.category,
            promo: data.promo ?? null,
            promoEnabled: data.promoEnabled ?? false,
            active: data.active ?? true,
            variations: variations,
          });

          // Se tem variações, seleciona a de menor preço
          if (variations.length > 0) {
            const cheapestVariation = variations.reduce<Variation>(
              (prev, curr) => (curr.price < prev.price ? curr : prev),
              variations[0] // valor inicial para o reduce
            );
            setSelectedVariation(cheapestVariation);
          } else {
            setSelectedVariation(null);
          }
        } else {
          setProduct(null);
          setSelectedVariation(null);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    }

    fetchProduct();
  }, [id]);

  if (!product) return null;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) setQuantity(1);
    else if (newQuantity > 999) setQuantity(999);
    else setQuantity(newQuantity);
  };

  const handleMinusClick = () => handleQuantityChange(quantity - 1);
  const handlePlusClick = () => handleQuantityChange(quantity + 1);

  const getUnitPrice = () => {
    if (selectedVariation) return selectedVariation.price;
    if (product.promoEnabled && product.promo) return product.promo;
    return product.price;
  };

  const totalPrice = (getUnitPrice() ?? 0) * quantity;
  const isBuyDisabled =
    product.variations && product.variations.length > 0 && !selectedVariation;

  const handleVariationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = product.variations?.find((v) => v.name === e.target.value);
    setSelectedVariation(selected || null);
  };

  const handleAddToCart = () => {
    if (isBuyDisabled) return;

    addToCart(product, selectedVariation ?? null, quantity, false);
    toast.success(`Adicionado ${quantity}x ${product.name} ao carrinho!`);
  };

  const handleBuyNow = () => {
    if (isBuyDisabled) return;

    addToCart(product, selectedVariation ?? null, quantity, true);
  };

  return (
    <main className="product-container">
      <Link href="/" className="back-button">
        <FaArrowLeft />
        Voltar para a loja
      </Link>

      <div id="productContent">
        <div className="product-header">
          <div className="product-image-container">
            <Image
              src={product.image}
              className="product-img"
              alt="Produto"
              width={1920}
              height={1144}
            />
          </div>

          <div className="product-info">
            <h1 className="product-title-name">{product.name}</h1>
            <p className="product-description whitespace-pre-line">
              {product.description}
            </p>
            <div className="product-category">
              <FaTag />
              <span>{product.category}</span>
            </div>

            <div className="price-section">
              <div className="price-label">Preço unitário:</div>
              <div className="price-value">
                {product.variations && product.variations.length > 0 ? (
                  <span>
                    R$ {selectedVariation?.price.toFixed(2).replace(".", ",")}
                  </span>
                ) : (
                  <>
                    <span>
                      R$ {(getUnitPrice() ?? 0).toFixed(2).replace(".", ",")}
                    </span>

                    {product.promoEnabled &&
                      product.promo &&
                      !selectedVariation && (
                        <span className="line-through text-gray-400 text-base font-medium ml-2">
                          R$ {(product.price ?? 0).toFixed(2).replace(".", ",")}
                        </span>
                      )}
                  </>
                )}
              </div>

              {product.variations && product.variations.length > 0 && (
                <div className="mt-3">
                  <label className="text-sm font-medium block mb-1">
                    Selecione uma variação:
                  </label>
                  <select
                    value={selectedVariation?.name || ""}
                    onChange={handleVariationChange}
                    className="p-2 bg-slate-800 border border-blue-500 w-full"
                  >
                    {product.variations?.map((v, i) => (
                      <option key={i} value={v.name}>
                        {v.name} — R$ {v.price.toFixed(2).replace(".", ",")}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="quantity-section mt-4">
                <label className="quantity-label">Quantidade:</label>
                <div className="quantity-controls">
                  <button className="quantity-btn" onClick={handleMinusClick}>
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    min={1}
                    max={999}
                    onChange={(e) =>
                      handleQuantityChange(Number(e.target.value))
                    }
                  />
                  <button className="quantity-btn" onClick={handlePlusClick}>
                    <FaPlus />
                  </button>
                </div>
                <div className="total-price mt-2">
                  <div className="total-label">Total:</div>
                  <div className="total-value">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </div>
                </div>
              </div>

              {product.active ? (
                <div className="action-buttons mt-4">
                  <button
                    className="btn-primary"
                    onClick={handleAddToCart}
                    disabled={isBuyDisabled}
                  >
                    <FaShoppingCart />
                    Adicionar ao Carrinho
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleBuyNow}
                    disabled={isBuyDisabled}
                  >
                    <FaCreditCard />
                    Comprar Agora
                  </button>
                  {isBuyDisabled && (
                    <p className="text-red-400 text-sm mt-1">
                      Selecione uma variação para continuar
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 text-red-500 font-semibold text-center border border-red-500 p-3 rounded">
                  Este anúncio está desativado e indisponível para compra no
                  momento.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
