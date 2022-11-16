import http from "@http/index";
import { CategoryObject, PagedCategories } from "./types";

export const getCategories = async (params: {
	country?: string;
	limit?: number;
	locale?: string;
	offset?: number;
}) => {
	const result = await http.get<PagedCategories>(`/browse/categories`, {
		params,
	});
	return result;
};
export const getACategory = async (
	category_id: string,
	params: {
		country?: string;
		locale?: string;
	}
) => {
	const result = await http.get<CategoryObject>(
		`/browse/categories/${category_id}`,
		{ params }
	);
	return result;
};
