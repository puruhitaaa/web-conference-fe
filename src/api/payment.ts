import { apiConfig } from "./config"

export const paymentRoutes = {
  // ICODSA payment endpoints
  listICODSA: `${apiConfig.baseUrl}/icodsa/payments`,
  showICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/icodsa/payments/${id}`,
  updateICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/icodsa/payments/update/${id}`,
  deleteICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/icodsa/payments/delete/${id}`,

  // ICICYTA payment endpoints
  listICICYTA: `${apiConfig.baseUrl}/icicyta/payments`,
  showICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/icicyta/payments/${id}`,
  updateICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/icicyta/payments/update/${id}`,
  deleteICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/icicyta/payments/delete/${id}`,
}
