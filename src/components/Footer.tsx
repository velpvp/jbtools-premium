export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Jbtools Premium</h3>
            <p className="text-[14px]">Sua loja de contas digitais premium</p>
          </div>
          <div className="footer-section">
            <h4>Links Úteis</h4>
            <ul>
              <li>
                <a
                  href="https://docs.google.com/document/d/1RFmcAHwKQw77QpyaaHduWz86CuWrhb_bRqSwi85PA9c/edit?usp=sharing"
                  target="_blank"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#privacidade">Política de Privacidade</a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=554196844896&text&type=phone_number&app_absent=0"
                  target="_blank"
                >
                  Suporte
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contato</h4>
            <p className="text-[14px]">WhatsApp: 41 9684-4896</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Jbtools. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
