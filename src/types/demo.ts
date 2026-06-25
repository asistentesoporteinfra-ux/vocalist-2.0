export type SectorId =
  | "health"
  | "finance-insurance"
  | "retail-ecommerce"
  | "real-estate"
  | "public-service"
  | "fashion"
  | "travel"
  | "hotel"
  | "restaurant"
  | "education";

export type SectorOption = {
  id: SectorId | "all";
  label: string;
};

export type DemoItem = {
  id: string;
  title: string;
  description: string;
  sectorId: SectorId;
  sectorLabel: string;
  audioUrl: string;
  durationLabel: string;
  accent: string;
};
