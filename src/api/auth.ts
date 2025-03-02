import { apiConfig } from "./config";

export const authRoutes = {
    login: `${apiConfig.baseUrl}/login`,
    register: `${apiConfig.baseUrl}/register`,
    logout: `${apiConfig.baseUrl}/logout`,
    refresh: `${apiConfig.baseUrl}/refresh`,
}