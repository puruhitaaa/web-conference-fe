import type { User } from "@/types/auth"
import createStore from "react-auth-kit/createStore"

export const store = createStore<User>({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
})
