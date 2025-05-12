import { apiConfig } from "./config";

export const adminRoutes = {
  createAdminICODSA: `${apiConfig.baseUrl}/admin/icodsa/create`,
  createAdminICICYTA: `${apiConfig.baseUrl}/admin/icicyta/create`,
  updateAdmin: (id: number | string) =>
    `${apiConfig.baseUrl}/admin/update/${id}`,
  deleteAdmin: (id: number | string) =>
    `${apiConfig.baseUrl}/admin/delete/${id}`,
  listAllAdmins: `${apiConfig.baseUrl}/admin/list`,
  listICODSAAdmins: `${apiConfig.baseUrl}/admin/list/icodsa`,
  listICICYTAAdmins: `${apiConfig.baseUrl}/admin/list/icicyta`,
};
