import { apiConfig } from "./config"

export const signatureRoutes = {
  create: `${apiConfig.baseUrl}/signatures/create`,
  update: (id: number | string) =>
    `${apiConfig.baseUrl}/signatures/update/${id}`,
  delete: (id: number | string) =>
    `${apiConfig.baseUrl}/signatures/delete/${id}`,
  list: `${apiConfig.baseUrl}/signatures`,
  show: (id: number | string) => `${apiConfig.baseUrl}/signatures/${id}`,
}
