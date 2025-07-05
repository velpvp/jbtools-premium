"use client";

import "./style.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
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
          });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    }

    fetchProduct();
  }, [id]);

  if (!product) return null;

  // Função para atualizar quantidade, limite alto (ex: 999)
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) setQuantity(1);
    else if (newQuantity > 999) setQuantity(999);
    else setQuantity(newQuantity);
  };

  const handleMinusClick = () => handleQuantityChange(quantity - 1);
  const handlePlusClick = () => handleQuantityChange(quantity + 1);

  // Adiciona ao carrinho sem redirecionar
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, false);
    }
    toast.success(`Adicionado(s) ${quantity}x ${product.name} ao carrinho!`);
  };

  // Adiciona e redireciona para o carrinho
  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, false);
    }
    router.push("/cart");
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
            <h1 id="productTitle" className="product-title-name">
              {product.name}
            </h1>
            <p
              id="productDescription"
              className="product-description whitespace-pre-line"
            >
              {product.description}
            </p>
            <div id="productCategory" className="product-category">
              <FaTag />
              <span>{product.category}</span>
            </div>

            <div className="price-section">
              <div className="price-label">Preço unitário:</div>
              <div id="unitPrice" className="price-value">
                {product.promoEnabled && product.promo ? (
                  <div className="flex items-center gap-2">
                    <span className="">
                      R$ {Number(product.promo).toFixed(2).replace(".", ",")}
                    </span>
                    <span className="line-through text-gray-400 text-base font-medium">
                      R$ {Number(product.price).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ) : (
                  <span className="l">
                    R$ {Number(product.price).toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>

              <div className="quantity-section">
                <label className="quantity-label">Quantidade:</label>
                <div className="quantity-controls">
                  <button className="quantity-btn" onClick={handleMinusClick}>
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    id="quantityInput"
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
                <div className="total-price">
                  <div className="total-label">Total:</div>
                  <div id="totalPrice" className="total-value">
                    R${" "}
                    {Number(
                      (product.promoEnabled && product.promo
                        ? product.promo
                        : product.price) * quantity
                    )
                      .toFixed(2)
                      .replace(".", ",")}
                  </div>
                </div>
              </div>

              {product.active ? (
                <div className="action-buttons">
                  <button className="btn-primary" onClick={handleAddToCart}>
                    <FaShoppingCart />
                    Adicionar ao Carrinho
                  </button>
                  <button className="btn-secondary" onClick={handleBuyNow}>
                    <FaCreditCard />
                    Comprar Agora
                  </button>
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
