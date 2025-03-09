import createRefresh from "react-auth-kit/createRefresh";
import axios from "axios";
import { authRoutes } from "@/api/auth";

export const refresh = createRefresh({
  interval: 10, // The time in sec to refresh the Access token,
  refreshApiCallback: async (param) => {
    try {
      const response = await axios.post(authRoutes.refresh, param, {
        headers: { Authorization: `Bearer ${param.authToken}` },
      });
      return {
        isSuccess: true,
        newAuthToken: response.data.token,
        newAuthTokenExpireIn: 10,
        newRefreshTokenExpiresIn: 60,
      };
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
      };
    }
  },
});
