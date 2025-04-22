import { apiConfig } from "./config"

export const loaRoutes = {
  // ICODSA LOA endpoints
  listICODSA: `${apiConfig.baseUrl}/icodsa/loas`,
  showICODSA: (id: number | string) => `${apiConfig.baseUrl}/icodsa/loas/${id}`,
  createICODSA: `${apiConfig.baseUrl}/icodsa/loas/create`,
  updateICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/icodsa/loas/update/${id}`,
  deleteICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/icodsa/loas/delete/${id}`,

  // ICICYTA LOA endpoints
  listICICYTA: `${apiConfig.baseUrl}/icicyta/loas`,
  showICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/icicyta/loas/${id}`,
  createICICYTA: `${apiConfig.baseUrl}/icicyta/loas/create`,
  updateICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/icicyta/loas/update/${id}`,
  deleteICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/icicyta/loas/delete/${id}`,
}
