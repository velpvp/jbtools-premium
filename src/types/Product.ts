export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: "Ias" | "Streamings" | "Jogos" | "Outros";
  promo?: number | null;
  promoEnabled?: boolean;
  active: boolean;
};
