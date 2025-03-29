import { apiConfig } from "./config"

export const virtualAccountRoutes = {
  create: `${apiConfig.baseUrl}/virtual-accounts/create`,
  update: (id: number | string) =>
    `${apiConfig.baseUrl}/virtual-accounts/update/${id}`,
  delete: (id: number | string) =>
    `${apiConfig.baseUrl}/virtual-accounts/delete/${id}`,
  list: `${apiConfig.baseUrl}/virtual-accounts/list`,
  show: (id: number | string) => `${apiConfig.baseUrl}/virtual-accounts/${id}`,
}
