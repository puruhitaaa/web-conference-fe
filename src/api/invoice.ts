import { apiConfig } from "./config"

export const invoiceRoutes = {
  // ICODSA invoice endpoints
  listICODSA: `${apiConfig.baseUrl}/icodsa/invoices`,
  showICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/icodsa/invoices/${id}`,
  updateICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/icodsa/invoices/update/${id}`,
  deleteICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/icodsa/invoices/delete/${id}`,

  // ICICYTA invoice endpoints
  listICICYTA: `${apiConfig.baseUrl}/icicyta/invoices`,
  showICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/icicyta/invoices/${id}`,
  updateICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/icicyta/invoices/update/${id}`,
  deleteICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/icicyta/invoices/delete/${id}`,
}
