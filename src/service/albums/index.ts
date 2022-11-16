import http from "@http/index";
import { ArrayOfBooleans, PagingObject } from "@service/types";
import { AlbumObject, ManyAlbums, PagedAlbums } from "./types";

export const getAnAlbum = async (id: string, params: { market?: string }) => {
	const result = await http.get<AlbumObject>(`/albums/${id}`, { params });
	return result;
};
export const getMultipleAlbums = async (params: {
	ids?: string;
	market?: string;
}) => {
	const result = await http.get<ManyAlbums>(`/albums`, { params });
	return result;
};
export const getAnAlbumsTracks = async (
	id: string,
	params: {
		limit?: number;
		market?: string;
		offset?: number;
	}
) => {
	const result = await http.get<PagingObject>(`/albums/${id}/tracks`, {
		params,
	});
	return result;
};
export const getUsersSavedAlbums = async (params: {
	limit?: number;
	market?: string;
	offset?: number;
}) => {
	const result = await http.get<PagingObject>(`/me/albums`, { params });
	return result;
};
export const saveAlbumsUser = async (params: { ids: string }) => {
	const result = await http.put<any>(`/me/albums`, { params });
	return result;
};
export const removeAlbumsUser = async (params: { ids: string }) => {
	const result = await http.del<any>(`/me/albums`, { params });
	return result;
};
export const checkUsersSavedAlbums = async (params: { ids: string }) => {
	const result = await http.get<ArrayOfBooleans>(`/me/albums/contains`, {
		params,
	});
	return result;
};
export const getNewReleases = async (params: {
	country?: string;
	limit?: number;
	offset?: number;
}) => {
	const result = await http.get<PagedAlbums>(`/browse/new-releases`, {
		params,
	});
	return result;
};
