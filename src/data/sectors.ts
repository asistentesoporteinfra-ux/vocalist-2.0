import type { SectorOption } from "@/types/demo";

export const sectors: readonly SectorOption[] = [
  { id: "all", label: "Todos" },
  { id: "health", label: "Salud" },
  { id: "finance-insurance", label: "Finanzas y Seguros" },
  { id: "retail-ecommerce", label: "Retail y E-commerce" },
  { id: "real-estate", label: "Sector Inmobiliario" },
  { id: "public-service", label: "Atención al Ciudadano" },
  { id: "fashion", label: "Moda y Ropa" },
  { id: "travel", label: "Agencia de Viajes" },
  { id: "hotel", label: "Hotel" },
  { id: "restaurant", label: "Restaurante" },
  { id: "education", label: "Educación" },
] as const;
