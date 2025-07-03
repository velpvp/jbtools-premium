import { FaWhatsapp } from "react-icons/fa";

export default function ButtonWhats() {
  return (
    <div>
      <a
        href="https://wa.me/5551980163944"
        target="_blank"
        className="fixed right-3 bottom-3 bg-green-500 text-white rounded-full transition duration-300 ease hover:bg-green-600 hover:text-gray-300"
      >
        <FaWhatsapp aria-label="WhatsApp" className="w-16 h-16 p-3" />
      </a>
    </div>
  );
}
