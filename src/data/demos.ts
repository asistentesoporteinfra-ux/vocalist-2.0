import type { DemoItem } from "@/types/demo";

export const demos: readonly DemoItem[] = [
  {
    id: "salud-triage-01",
    title: "Triage inicial de pacientes",
    description:
      "El paciente llama. El agente responde en 1 segundo, evalúa urgencia y agenda el paso correcto — sin hacer esperar, sin errores de triaje.",
    sectorId: "health",
    sectorLabel: "Salud",
    audioUrl: "/demos/salud/salud1.mp3",
    durationLabel: "01:01",
    accent: "linear-gradient(135deg, #43a5ff, #2ee6a6)",
  },
  {
    id: "salud-recordatorio-02",
    title: "Recordatorio de citas",
    description:
      "El 30 % de las citas se pierden por ausencias. Este agente llama, confirma y reprograma sin que nadie levante el teléfono.",
    sectorId: "health",
    sectorLabel: "Salud",
    audioUrl: "/demos/salud/salud2.mp3",
    durationLabel: "10:55",
    accent: "linear-gradient(135deg, #38bdf8, #6366f1)",
  },
  {
    id: "finanzas-cobranza-01",
    title: "Gestión de cobranza temprana",
    description:
      "La probabilidad de cobro cae cada semana. El agente llama en el momento exacto, negocia y registra — sin gestor, sin excusas.",
    sectorId: "finance-insurance",
    sectorLabel: "Finanzas y Seguros",
    audioUrl: "/demos/finanzas/cobranzas.mp3",
    durationLabel: "00:50",
    accent: "linear-gradient(135deg, #8b5cf6, #d946ef)",
  },
  {
    id: "finanzas-siniestros-02",
    title: "Apertura de siniestros",
    description:
      "El cliente reporta. El agente recopila, valida y abre el caso en menos de 3 minutos. Cero papeleos. Cero demoras en la primera milla.",
    sectorId: "finance-insurance",
    sectorLabel: "Finanzas y Seguros",
    audioUrl: "/demos/finanzas/siniestros.mp3",
    durationLabel: "00:46",
    accent: "linear-gradient(135deg, #d946ef, #f43f5e)",
  },
  {
    id: "finanzas-finnova-03",
    title: "Banca virtual con agente de voz",
    description:
      "El cliente consulta saldos, transferencias y productos bancarios sin esperar en la línea. El agente autentica, responde y ejecuta — como un ejecutivo, pero en segundos y sin horario.",
    sectorId: "finance-insurance",
    sectorLabel: "Finanzas y Seguros",
    audioUrl: "/demos/finanzas/finnova.mp3",
    durationLabel: "03:35",
    accent: "linear-gradient(135deg, #f43f5e, #e11d48)",
  },
  {
    id: "retail-devoluciones-01",
    title: "Gestión de devoluciones",
    description:
      "El cliente quiere devolver. En lugar de perderlo, el agente retiene, ofrece alternativas y resuelve — todo en la misma llamada.",
    sectorId: "retail-ecommerce",
    sectorLabel: "Retail y E-commerce",
    audioUrl: "/demos/retail/reembolso.mp3",
    durationLabel: "00:41",
    accent: "linear-gradient(135deg, #34d399, #22d3ee)",
  },
  {
    id: "retail-abandono-02",
    title: "Recuperación de carrito",
    description:
      "El 70 % de los carritos se abandonan. Este agente llama en el momento justo, desmonta la objeción y reactiva la compra.",
    sectorId: "retail-ecommerce",
    sectorLabel: "Retail y E-commerce",
    audioUrl: "/demos/retail/recuperacioncarrito.mp3",
    durationLabel: "00:28",
    accent: "linear-gradient(135deg, #a3e635, #10b981)",
  },
  {
    id: "retail-globalmart-03",
    title: "Soporte al cliente omnicanal",
    description:
      "El cliente llama por una duda de facturación o envío. El agente consulta el historial, resuelve sin transferencias y registra la solución — con la precisión de un sistema y la calidez de un humano.",
    sectorId: "retail-ecommerce",
    sectorLabel: "Retail y E-commerce",
    audioUrl: "/demos/retail/globalmart.mp3",
    durationLabel: "05:42",
    accent: "linear-gradient(135deg, #10b981, #14b8a6)",
  },
  {
    id: "realestate-visitas-01",
    title: "Agendamiento de visitas",
    description:
      "Cada lead no contactado en la primera hora se enfría. El agente responde al instante, califica y agenda — antes de que la competencia llame.",
    sectorId: "real-estate",
    sectorLabel: "Sector Inmobiliario",
    audioUrl: "/demos/inmobiliario/agendamientoinmobiliario.mp3",
    durationLabel: "00:29",
    accent: "linear-gradient(135deg, #60a5fa, #22d3ee)",
  },
  {
    id: "realestate-prospectos-02",
    title: "Precalificación de prospectos",
    description:
      "No todos los interesados son compradores. El agente filtra por presupuesto, zona y urgencia — y entrega solo los leads que valen tu tiempo.",
    sectorId: "real-estate",
    sectorLabel: "Sector Inmobiliario",
    audioUrl: "/demos/inmobiliario/prospeccion.mp3",
    // TODO: ⚠️ archivo prospeccion.mp3 no existe en public/demos/inmobiliario/ — subir el audio real
    durationLabel: "00:42",
    accent: "linear-gradient(135deg, #14b8a6, #3b82f6)",
  },
  {
    id: "realestate-aura-03",
    title: "Customer care inmobiliario",
    description:
      "El cliente que ya compró necesita seguimiento, revisión de documentos o reprogramación. El agente resuelve al instante sin desviar al asesor — manteniendo la relación viva y la operación en marcha.",
    sectorId: "real-estate",
    sectorLabel: "Sector Inmobiliario",
    audioUrl: "/demos/inmobiliario/aura-inmobiliaria.mp3",
    durationLabel: "06:49",
    accent: "linear-gradient(135deg, #3b82f6, #6366f1)",
  },
  {
    id: "public-service-civi-01",
    title: "Orientación al ciudadano",
    description:
      "Cada llamada sin resolver genera tres más. El agente orienta, explica derechos y rutas en segundos — sin colas, sin transferencias, sin frustraciones.",
    sectorId: "public-service",
    sectorLabel: "Atención al Ciudadano",
    audioUrl: "/demos/ciudadano/civi.mp3",
    durationLabel: "00:55",
    accent: "linear-gradient(135deg, #f59e0b, #f97316)",
  },
  {
    id: "public-service-tramites-02",
    title: "Gestión de trámites y turnos",
    description:
      "El ciudadano no sabe qué documentos llevar ni a qué ventanilla ir. El agente lo guía paso a paso, valida requisitos y asigna el turno correcto — en una sola llamada.",
    sectorId: "public-service",
    sectorLabel: "Atención al Ciudadano",
    audioUrl: "/demos/ciudadano/tramites.mp3",
    durationLabel: "00:55",
    accent: "linear-gradient(135deg, #fb923c, #f43f5e)",
  },
  {
    id: "public-service-municipal-03",
    title: "Atención municipal y agenda de voz",
    description:
      "El ciudadano necesita reportar una incidencia, pedir un turno o conocer servicios municipales. El agente lo recibe con voz natural, lo orienta y crea el ticket — sin formularios, sin esperar a que abran la oficina.",
    sectorId: "public-service",
    sectorLabel: "Atención al Ciudadano",
    audioUrl: "/demos/ciudadano/agenda-voz-municipal.mp3",
    durationLabel: "03:14",
    accent: "linear-gradient(135deg, #f97316, #dc2626)",
  },
  {
    id: "fashion-venta-01",
    title: "Venta de ropa asistida por IA",
    description:
      "El cliente explora, duda y abandona. El agente recomienda la talla correcta, resuelve la objeción de precio y cierra — antes de que cierre la pestaña.",
    sectorId: "fashion",
    sectorLabel: "Moda y Ropa",
    audioUrl: "/demos/moda/moda.mp3",
    durationLabel: "05:11",
    accent: "linear-gradient(135deg, #f472b6, #a855f7)",
  },
  {
    id: "fashion-sofia-02",
    title: "Venta cruzada y fidelización",
    description:
      "La clienta habitual recibe una recomendación personalizada basada en su historial. El agente sugiere, resuelve dudas de talla y cierra la venta cruzada — como la mejor vendedora, pero disponible 24/7.",
    sectorId: "fashion",
    sectorLabel: "Moda y Ropa",
    audioUrl: "/demos/moda/sofia-ropa.mp3",
    durationLabel: "06:44",
    accent: "linear-gradient(135deg, #a855f7, #8b5cf6)",
  },
  {
    id: "travel-agencia-01",
    title: "Venta de paquetes de viaje",
    description:
      "El cliente tiene un destino vago y un presupuesto ajustado. El agente arma el paquete ideal, cotiza en tiempo real y convierte la duda en reserva.",
    sectorId: "travel",
    sectorLabel: "Agencia de Viajes",
    audioUrl: "/demos/viajes/viajes.mp3",
    durationLabel: "02:33",
    accent: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  },
  {
    id: "travel-colombia-02",
    title: "Venta de destinos nacionales",
    description:
      "El cliente quiere viajar a Colombia y tiene dudas de fechas, precios y destinos. El agente arma la cotización al vuelo, sugiere experiencias locales y convierte el interés en reserva confirmada.",
    sectorId: "travel",
    sectorLabel: "Agencia de Viajes",
    audioUrl: "/demos/viajes/viajes-colombia.mp3",
    durationLabel: "05:23",
    accent: "linear-gradient(135deg, #0ea5e9, #6366f1)",
  },
  {
    id: "hotel-reserva-01",
    title: "Reserva y upsell de habitaciones",
    description:
      "El agente confirma disponibilidad, ofrece el upgrade en el momento exacto y cierra la reserva con fecha, nombre y tarjeta — sin que nadie marque.",
    sectorId: "hotel",
    sectorLabel: "Hotel",
    audioUrl: "/demos/hotel/mundihotel.mp3",
    durationLabel: "04:20",
    accent: "linear-gradient(135deg, #fbbf24, #f59e0b)",
  },
  {
    id: "restaurant-pedido-01",
    title: "Pedido y reserva de mesa",
    description:
      "El cliente llama para pedir o reservar. El agente toma el pedido completo, sugiere el combo que sube el ticket y confirma en menos de 90 segundos.",
    sectorId: "restaurant",
    sectorLabel: "Restaurante",
    audioUrl: "/demos/restaurante/burger-liz.mp3",
    durationLabel: "02:32",
    accent: "linear-gradient(135deg, #fb923c, #ef4444)",
  },
  {
    id: "education-unisanitas-01",
    title: "Orientación universitaria con IA",
    description:
      "El futuro estudiante tiene dudas sobre programas, requisitos y fechas. El agente responde al instante, guía sobre la oferta académica y agenda la cita con el asesor — sin llamadas perdidas, sin esperas, sin formularios eternos.",
    sectorId: "education",
    sectorLabel: "Educación",
    audioUrl: "/demos/educacion/unisanitas.mp3",
    durationLabel: "08:52",
    accent: "linear-gradient(135deg, #2dd4bf, #06b6d4)",
  },
] as const;
