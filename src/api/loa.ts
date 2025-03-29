import { apiConfig } from "./config"

export const loaRoutes = {
  // Super Admin LOA endpoints
  list: `${apiConfig.baseUrl}/loas`,
  create: `${apiConfig.baseUrl}/loas/create`,
  show: (id: number | string) => `${apiConfig.baseUrl}/loas/${id}`,
  update: (id: number | string) => `${apiConfig.baseUrl}/loas/update/${id}`,
  delete: (id: number | string) => `${apiConfig.baseUrl}/loas/delete/${id}`,

  // Admin LOA endpoints
  adminList: `${apiConfig.baseUrl}/loas/admin`,
}
