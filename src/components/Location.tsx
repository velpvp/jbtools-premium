import { FaLocationDot } from "react-icons/fa6";

export default function Location() {
  return (
    <section className="mt-22 flex justify-center items-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-2 px-6">
        <div className="flex justify-center items-start flex-col">
          <h2 className="text-4xl font-bold mb-2 text-[var(--primary)]">
            Nossa Localização
          </h2>
          <div className="flex justify-center items-center gap-1 mb-4">
            <FaLocationDot />
            <p className="font-medium">Rua XXXXXXX, 1234 - Rondônia/NH</p>
          </div>
        </div>
        <div className="w-full lg:w-120 h-80">
          <iframe
            title="Mapa da Concessionária"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.4057900433716!2d-51.13262068488604!3d-29.68966588198639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9519380a41caa43d%3A0xc396aa78ff8921e0!2sNovo%20Hamburgo%2C%20RS!5e0!3m2!1spt-BR!2sbr!4v1718300000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
