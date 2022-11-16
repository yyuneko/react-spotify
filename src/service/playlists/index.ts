import http from "@http/index";
import { ArrayOfImages, PagingObject } from "@service/types";
import {
	PagingPlaylistObject,
	PlaylistObject,
	PlaylistSnapshotId,
} from "./types";

export const getPlaylist = async (
	playlist_id: string,
	params: {
		additional_types?: string;
		fields?: string;
		market?: string;
	}
) => {
	const result = await http.get<PlaylistObject>(`/playlists/${playlist_id}`, {
		params,
	});
	return result;
};
export const changePlaylistDetails = async (
	playlist_id: string,
	body: {
		name?: string;
		public?: boolean;
		collaborative?: boolean;
		description?: string;
	}
) => {
	const result = await http.put<any>(`/playlists/${playlist_id}`, body);
	return result;
};
export const getPlaylistsTracks = async (
	playlist_id: string,
	params: {
		additional_types?: string;
		fields?: string;
		limit?: number;
		market?: string;
		offset?: number;
	}
) => {
	const result = await http.get<PagingObject>(
		`/playlists/${playlist_id}/tracks`,
		{ params }
	);
	return result;
};
export const addTracksToPlaylist = async (
	playlist_id: string,
	params: {
		position?: number;
		uris?: string;
	}
) => {
	const result = await http.post<any>(
		`/playlists/${playlist_id}/tracks`,
		undefined,
		{ params }
	);
	return result;
};
export const reorderOrReplacePlaylistsTracks = async (
	playlist_id: string,
	params: {
		uris?: string;
	},
	body: {
		uris?: string[];
		range_start?: number;
		insert_before?: number;
		range_length?: number;
		snapshot_id?: string;
	}
) => {
	const result = await http.put<PlaylistSnapshotId>(
		`/playlists/${playlist_id}/tracks`,
		body,
		{ params }
	);
	return result;
};
export const removeTracksPlaylist = async (
	playlist_id: string,
	body: {
		tracks: { uri: string }[];
		snapshot_id?: string;
	}
) => {
	const result = await http.del<PlaylistSnapshotId>(
		`/playlists/${playlist_id}/tracks`,
		{ data: body }
	);
	return result;
};
export const getAListOfCurrentUsersPlaylists = async (params: {
	limit?: number;
	offset?: number;
}) => {
	const result = await http.get<PagingPlaylistObject>(`/me/playlists`, {
		params,
	});
	return result;
};
export const getListUsersPlaylists = async (
	user_id: string,
	params: {
		limit?: number;
		offset?: number;
	}
) => {
	const result = await http.get<PagingPlaylistObject>(
		`/users/${user_id}/playlists`,
		{ params }
	);
	return result;
};
export const createPlaylist = async (
	user_id: string,
	body: {
		name: string;
		public?: boolean;
		collaborative?: boolean;
		description?: string;
	}
) => {
	const result = await http.post<PlaylistObject>(
		`/users/${user_id}/playlists`,
		body
	);
	return result;
};
export const getFeaturedPlaylists = async (params: {
	country?: string;
	limit?: number;
	locale?: string;
	offset?: number;
	timestamp?: string;
}) => {
	const result = await http.get<PagingPlaylistObject>(
		`/browse/featured-playlists`,
		{ params }
	);
	return result;
};
export const getACategoriesPlaylists = async (
	category_id: string,
	params: {
		country?: string;
		limit?: number;
		offset?: number;
	}
) => {
	const result = await http.get<PagingPlaylistObject>(
		`/browse/categories/${category_id}/playlists`,
		{ params }
	);
	return result;
};
export const getPlaylistCover = async (playlist_id: string) => {
	const result = await http.get<ArrayOfImages>(
		`/playlists/${playlist_id}/images`
	);
	return result;
};
export const uploadCustomPlaylistCover = async (playlist_id: string) => {
	const result = await http.put<any>(`/playlists/${playlist_id}/images`);
	return result;
};
