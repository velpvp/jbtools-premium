import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade - AutoShop",
  openGraph: {
    title: "Política de Privacidade - AutoShop",
    type: "website",
    siteName: "AutoShop",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Política de Privacidade - AutoShop",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PoliticaPage() {
  return (
    <>
      <Header />
      <main className="flex justify-center items-center px-2 py-5 font-medium">
        <div className="min-h-screen w-full max-w-5xl bg-white p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--primary)]">
            Política de Privacidade
          </h1>
          <div className="space-y-4 text-sm leading-relaxed text-gray-700">
            <p className="text-xs text-gray-500">
              Última atualização: 18 de junho de 2025, às 12:00
            </p>

            <p>
              A <strong>AutoShop</strong> respeita a privacidade dos visitantes
              do seu site. Esta Política de Privacidade explica como suas
              informações são coletadas, usadas e protegidas ao navegar pelo
              site <strong>https://autoshop.com.br</strong>.
            </p>

            <h2 className="text-base font-semibold">1. Coleta de dados</h2>
            <p>
              As informações que coletamos podem incluir nome, e-mail, telefone
              e outros dados fornecidos voluntariamente por você, por exemplo ao
              preencher um formulário de interesse ou contato. Também coletamos
              informações de forma automática, como tipo de dispositivo,
              navegador, localização aproximada e páginas acessadas, por meio de
              ferramentas como o Google Analytics.
            </p>

            <h2 className="text-base font-semibold">
              2. Como utilizamos seus dados
            </h2>
            <p>Os dados coletados são usados para:</p>
            <ul className="list-disc list-inside">
              <li>
                Entrar em contato com você em resposta a mensagens ou
                formulários enviados;
              </li>
              <li>Melhorar a navegação e o desempenho do site;</li>
              <li>
                Analisar o comportamento dos usuários e otimizar o conteúdo
                apresentado.
              </li>
            </ul>

            <h2 className="text-base font-semibold">3. Uso de cookies</h2>
            <p>
              Nosso site pode usar cookies para lembrar suas preferências de
              navegação e coletar dados estatísticos de acesso. O uso de cookies
              pode ser desativado nas configurações do seu navegador, mas isso
              pode afetar a funcionalidade de algumas partes do site.
            </p>

            <h2 className="text-base font-semibold">
              4. Compartilhamento de informações
            </h2>
            <p>
              Não compartilhamos suas informações pessoais com terceiros, exceto
              quando necessário para prestação de serviços (como hospedagem,
              armazenamento em nuvem e análise de dados) ou quando exigido por
              obrigações legais.
            </p>

            <h2 className="text-base font-semibold">
              5. Armazenamento e segurança
            </h2>
            <p>
              Os dados fornecidos são armazenados com segurança utilizando
              serviços confiáveis como Firebase e Cloudinary. Aplicamos medidas
              técnicas e administrativas para proteger seus dados contra acessos
              não autorizados, alterações ou perdas.
            </p>

            <h2 className="text-base font-semibold">6. Seus direitos</h2>
            <p>
              Você pode solicitar a correção ou remoção dos seus dados pessoais
              a qualquer momento, entrando em contato conosco. Faremos o
              possível para atender a solicitação de forma segura e no menor
              prazo possível.
            </p>

            <h2 className="text-base font-semibold">
              7. Alterações nesta política
            </h2>
            <p>
              Esta política poderá ser atualizada sem aviso prévio. Sempre que
              isso ocorrer, a nova versão será publicada nesta página com a data
              da última modificação.
            </p>

            <h2 className="text-base font-semibold">8. Fale com a gente</h2>
            <p>
              Em caso de dúvidas ou solicitações relacionadas à privacidade dos
              seus dados, entre em contato:
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
