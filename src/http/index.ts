import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import cookie from "./cookie";
const axiosInstance = axios.create({
	baseURL: "https://api.spotify.com/v1",
});
// axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.headers.common["authorization"] = decodeURIComponent(
	cookie.get("Authorization")
);
function get<T>(
	url: string,
	config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
	return axiosInstance.get(url, config);
}
function post<T>(
	url: string,
	data?: any,
	config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
	return axiosInstance.post(url, data, config);
}
function put<T>(
	url: string,
	data?: any,
	config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
	return axiosInstance.put(url, data, config);
}
function del<T>(
	url: string,
	config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
	return axiosInstance.delete(url, config);
}
export default {
	get,
	post,
	put,
	del,
};
