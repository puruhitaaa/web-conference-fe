import { apiConfig } from "./config"

export const authRoutes = {
  login: `${apiConfig.baseUrl}/login`,
  logout: `${apiConfig.baseUrl}/logout`,
  logoutSuperAdmin: `${apiConfig.baseUrl}/logout/superadmin`,
}
