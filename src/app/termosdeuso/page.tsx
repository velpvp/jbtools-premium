import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso - AutoShop",
  openGraph: {
    title: "Termos de Uso - AutoShop",
    type: "website",
    siteName: "AutoShop",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Termos de Uso - AutoShop",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TermosPage() {
  return (
    <>
      <Header />
      <main className="flex justify-center items-center px-2 py-5 font-medium">
        <div className="min-h-screen w-full max-w-5xl bg-white p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--primary)]">
            Termos de Uso
          </h1>
          <div className="space-y-4 text-sm leading-relaxed text-gray-700">
            <p className="text-xs text-gray-500">
              Última atualização: 18 de junho de 2025, às 12:00
            </p>
            <p>
              Bem-vindo ao site da <strong>AutoShop</strong>. Estes Termos de
              Uso regulam sua navegação e uso do site{" "}
              <strong>https://autoshop.com.br</strong>. Ao acessar este site,
              você declara estar de acordo com os termos abaixo.
            </p>

            <h2 className="text-base font-semibold">1. Uso permitido</h2>
            <p>
              Você se compromete a utilizar este site de forma legal e ética,
              respeitando as leis vigentes. É proibido utilizar o site para fins
              ilegais, para tentar comprometer a segurança do sistema ou acessar
              áreas restritas sem autorização.
            </p>

            <h2 className="text-base font-semibold">
              2. Conteúdo e propriedade intelectual
            </h2>
            <p>
              Todo o conteúdo deste site — incluindo textos, imagens, ícones,
              logotipos, vídeos e códigos — é de propriedade da AutoShop ou
              licenciado para uso exclusivo. A reprodução, distribuição ou
              modificação de qualquer material sem autorização prévia por
              escrito é proibida.
            </p>

            <h2 className="text-base font-semibold">
              3. Responsabilidades do usuário
            </h2>
            <p>
              Você é responsável pelas informações fornecidas ao preencher
              formulários de contato ou interesse. Ao utilizar o site, você
              concorda em não inserir dados falsos, ofensivos ou que infrinjam
              os direitos de terceiros.
            </p>

            <h2 className="text-base font-semibold">4. Isenção de garantias</h2>
            <p>
              Este site é fornecido “como está”. Embora façamos o possível para
              manter as informações atualizadas e o site em pleno funcionamento,
              não garantimos que o conteúdo seja livre de erros, interrupções ou
              falhas.
            </p>

            <h2 className="text-base font-semibold">5. Links externos</h2>
            <p>
              O site pode conter links para outros sites ou plataformas
              externas. A AutoShop não se responsabiliza por conteúdos,
              políticas de privacidade ou serviços oferecidos por terceiros.
            </p>

            <h2 className="text-base font-semibold">
              6. Alterações nos Termos
            </h2>
            <p>
              Reservamo-nos o direito de alterar ou atualizar estes Termos de
              Uso a qualquer momento. As versões atualizadas serão publicadas
              nesta mesma página com a data de modificação.
            </p>

            <h2 className="text-base font-semibold">7. Fale conosco</h2>
            <p>
              Se você tiver dúvidas ou sugestões sobre estes Termos, entre em
              contato pelos canais abaixo:
            </p>

            <p className="font-medium">
              AutoShop
              <br />
              autoshop@gmail.com
              <br />
              (00) 0000 - 0000
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
