import { Timestamp } from "firebase/firestore";

export type Carro = {
  id: string;
  nome: string;
  modelo: string;
  descricao: string;
  preco: number;
  quilometragem: number;
  combustivel: string;
  ano: number;
  cor: string;
  cambio: string;
  portas: number;
  imagemCapa: string;
  galeria: string[];
  criadoEm: Timestamp;
};
