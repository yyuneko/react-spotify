import cookie from "@http/cookie";
import http from "@http/index";
import { processResult } from "@utils/index";
export const refreshToken = async () => {
  const result = await http.get<any>("/refresh_token", {
    params: {
      refresh_token: cookie.get("refresh_token"),
    },
    baseURL: "http://localhost:8888",
    withCredentials: true,
  });
  return processResult(result);
};
