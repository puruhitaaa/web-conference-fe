import { apiConfig } from "./config"

export const invoiceRoutes = {
  // Super Admin invoice endpoints
  listAll: `${apiConfig.baseUrl}/invoices`,
  show: (id: number | string) => `${apiConfig.baseUrl}/invoices/${id}`,

  // ICODSA invoice endpoints
  showICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/invoices/icodsa/${id}`,
  updateICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/invoices/update/icodsa/${id}`,

  // ICICYTA invoice endpoints
  showICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/invoices/icicyta/${id}`,
  updateICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/invoices/update/icicyta/${id}`,
}
