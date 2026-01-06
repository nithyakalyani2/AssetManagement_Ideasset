import { apiFetch } from "./endpoints";

export const employeeApis = {
  login: (email: string, password: string) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};
