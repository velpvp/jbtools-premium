"use client";

import "./style.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/Product";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaTag,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaCreditCard,
} from "react-icons/fa";

export default function ProductContent() {
  const params = useParams();
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [product, setProduct] = useState<Product | null>(null);

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
              className="product-image"
              alt="Produto"
              width={1920}
              height={1144}
            />
          </div>

          <div className="product-info">
            <h1 id="productTitle" className="product-title">
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
                R$ {Number(product.price).toFixed(2).replace(".", ",")}
              </div>

              <div className="quantity-section">
                <label className="quantity-label">Quantidade:</label>
                <div className="quantity-controls">
                  <button className="quantity-btn">
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    id="quantityInput"
                    className="quantity-input"
                    value="1"
                    min="1"
                    max="10"
                  />
                  <button className="quantity-btn">
                    <FaPlus />
                  </button>
                </div>
                <div className="total-price">
                  <div className="total-label">Total:</div>
                  <div id="totalPrice" className="total-value">
                    R$ 0,00
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-primary">
                  <FaShoppingCart />
                  Adicionar ao Carrinho
                </button>
                <button className="btn-secondary">
                  <FaCreditCard />
                  Comprar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    // <main classNameName="flex justify-start items-start max-md:flex-col gap-5 px-2 py-5">
    //   <div classNameName="w-full md:w-[70%] px-4 sm:px-8 py-5 rounded shadow bg-white">
    //     <Image
    //       src={product.image}
    //       alt={`Imagem do produto ${product.name}`}
    //       width={1280}
    //       height={720}
    //       unoptimized
    //       classNameName="w-full h-[400px] 2xl:h-[550px] object-contain rounded mb-4"
    //     />

    //     {/* Nome e descrição */}
    //     <h1 classNameName="text-3xl font-bold mb-4">{product.name}</h1>
    //     <section>
    //       <h2 classNameName="text-md font-semibold mb-2">Descrição</h2>
    //       <p classNameName="whitespace-pre-line">{product.description}</p>
    //     </section>
    //   </div>
    // </main>
  );
}
