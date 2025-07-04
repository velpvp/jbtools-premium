"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, total, updateQuantity, removeFromCart } = useCart();

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    }
  };

  const handleIncrease = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">Seu Carrinho</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Seu carrinho está vazio.
        </p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-gray-500">
                      R$ {Number(item.price).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Controle quantidade */}
                  <button
                    onClick={() => handleDecrease(item.id, item.quantity)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded px-3 py-1 select-none"
                    aria-label={`Diminuir quantidade de ${item.name}`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(item.id, item.quantity)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded px-3 py-1 select-none"
                    aria-label={`Aumentar quantidade de ${item.name}`}
                  >
                    +
                  </button>

                  {/* Total por produto */}
                  <div className="w-24 text-right font-semibold">
                    R${" "}
                    {Number(item.price * item.quantity)
                      .toFixed(2)
                      .replace(".", ",")}
                  </div>

                  {/* Botão remover */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-xl select-none"
                    aria-label={`Remover ${item.name} do carrinho`}
                    title="Remover item"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-between items-center font-bold text-xl">
            <span>Total:</span>
            <span>R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>

          <Link
            href="/checkout"
            className="block mt-8 w-full text-center bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 transition"
          >
            Finalizar Compra
          </Link>
        </>
      )}
    </div>
  );
}
