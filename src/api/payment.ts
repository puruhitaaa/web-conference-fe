import { apiConfig } from "./config"

export const paymentRoutes = {
  listAll: `${apiConfig.baseUrl}/payments`,
  show: (id: number | string) => `${apiConfig.baseUrl}/payments/${id}`,
}
