"use client";

import { useCart, CartItem } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function CartContent() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      updateQuantity(
        item.product.id,
        item.variation?.name ?? null,
        item.quantity - 1
      );
    }
  };

  const handleIncrease = (item: CartItem) => {
    updateQuantity(
      item.product.id,
      item.variation?.name ?? null,
      item.quantity + 1
    );
  };

  const handleRemove = (item: CartItem) => {
    removeFromCart(item.product.id, item.variation?.name ?? null);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto flex items-start justify-center flex-col">
      <Link href="/" className="back-button">
        <FaArrowLeft />
        Voltar para a loja
      </Link>
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-3xl min-h-[40vh]">
          <h1 className="text-3xl font-bold mb-6 text-[#2563eb] text-center">
            Carrinho
          </h1>

          {cart.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              Seu carrinho está vazio.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b border-[#1c388e7c]">
                <p>PRODUTO</p>
                <div className="flex items-center justify-center gap-26">
                  <p>QUANTIDADE</p>
                  <p>SUBTOTAL</p>
                </div>
              </div>
              <ul>
                {cart.map((item) => {
                  const price =
                    item.variation?.price ??
                    (item.product.promoEnabled && item.product.promo
                      ? item.product.promo
                      : item.product.price);

                  return (
                    <li
                      key={`${item.product.id}-${
                        item.variation?.name ?? "default"
                      }`}
                      className="flex items-center justify-between p-4 rounded-lg transition border-b border-[#1c388e7c]"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={100}
                          height={100}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <h2 className="font-semibold text-lg">
                            {item.product.name}
                          </h2>
                          {item.variation && (
                            <p className="text-sm text-gray-500">
                              Variação selecionada:{" "}
                              <span className="font-medium">
                                {item.variation.name}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="quantity-btn"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="quantity-btn"
                        >
                          +
                        </button>

                        <div className="w-32 text-right font-semibold flex flex-col items-end">
                          {item.product.promoEnabled &&
                          item.product.promo &&
                          !item.variation ? (
                            <>
                              <span className="line-through text-sm text-gray-400">
                                R${" "}
                                {((item.product.price ?? 0) * item.quantity)
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </span>
                              <span>
                                R${" "}
                                {((item.product.promo ?? 0) * item.quantity)
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </span>
                            </>
                          ) : (
                            <span>
                              R${" "}
                              {((price ?? 0) * item.quantity)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemove(item)}
                          className="text-red-600 hover:text-red-800 font-bold text-xl"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex justify-between items-center font-bold text-xl p-4">
                <span>Total:</span>
                <span className="text-[#568cff] text-[1.5rem]">
                  R${" "}
                  {cart
                    .reduce((acc, item) => {
                      const unitPrice =
                        item.variation?.price ??
                        (item.product.promoEnabled && item.product.promo != null
                          ? item.product.promo
                          : item.product.price ?? 0);
                      return acc + unitPrice * item.quantity;
                    }, 0)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block mt-6 w-full text-center bg-[#2563eb] text-white font-semibold py-3 rounded hover:bg-[#1d4ed8] transition"
              >
                Finalizar Compra
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
