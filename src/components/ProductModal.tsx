"use client";

import { Product } from "@/types/Product";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/60 rounded-xl flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="product-card max-w-lg max-h-[420px] overflow-y-auto w-full rounded-xl shadow-xl p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl transition text-gray-400 hover:text-white cursor-pointer"
        >
          <IoClose />
        </button>

        <h2 className="text-xl font-bold text-white mb-2">{product.name}</h2>
        <p className="text-gray-200 whitespace-pre-line">
          {product.description}
        </p>
      </motion.div>
    </motion.div>
  );
}
