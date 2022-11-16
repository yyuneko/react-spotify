import http from "@http/index";
import { SearchItems } from "./types";

export const search = async (params: {
	q: string;
	type: string[];
	include_external?: string;
	limit?: number;
	market?: string;
	offset?: string;
}) => {
	const result = await http.get<SearchItems>(`/search`, { params });
	return result;
};
