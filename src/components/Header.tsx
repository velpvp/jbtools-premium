import Image from "next/image";
import logoFloating from "../../public/logo-floating.png";
import Link from "next/link";
import { FaShoppingCart, FaSearch, FaCog } from "react-icons/fa";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <Image
                src={logoFloating}
                alt="JBTools Logo"
                className="floating-logo"
              />
            </div>
          </div>

          <div className="search-container">
            <input
              type="text"
              id="searchInput"
              placeholder="Digite o que você procura"
              className="search-input"
            />
            <button className="search-btn flex justify-center items-center">
              <FaSearch />
            </button>
          </div>

          <div className="header-actions">
            <button className="btn-cart" id="cartBtn">
              <FaShoppingCart />
              Carrinho (<span id="cartCount">0</span>)
            </button>
            <Link href={`/admin`} className="btn-manage bg-[#4f9cf9] ml-[10px]">
              <FaCog />
              Gerenciar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
