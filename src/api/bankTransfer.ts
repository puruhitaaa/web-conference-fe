import { apiConfig } from "./config"

export const bankTransferRoutes = {
  create: `${apiConfig.baseUrl}/bank-transfer/create`,
  update: (id: number | string) =>
    `${apiConfig.baseUrl}/bank-transfer/update/${id}`,
  delete: (id: number | string) =>
    `${apiConfig.baseUrl}/bank-transfer/delete/${id}`,
  list: `${apiConfig.baseUrl}/bank-transfer/list`,
  show: (id: number | string) => `${apiConfig.baseUrl}/bank-transfer/${id}`,
}
