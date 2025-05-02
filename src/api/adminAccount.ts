import { apiConfig } from "./config";

export const adminAccounts = {
  updatePasswordICODSA: (id: number | string) =>
    `${apiConfig.baseUrl}/icodsa/adminicodsa/update/${id}`,
  updatePasswordICICYTA: (id: number | string) =>
    `${apiConfig.baseUrl}/iciyta/adminicicyta/update/${id}`,
  //   updatePasswordSuperAdmin: (id: number | string) =>
  //     `${apiConfig.baseUrl}/icodsa/adminicicyta/update/${id}`,
};
