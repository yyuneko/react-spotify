import http from "@http/index";
import { CursorPagedArtists } from "@service/artists/types";
import { PagingObject, ArrayOfBooleans } from "@service/types";
import { PrivateUserObject, PublicUserObject } from "./types";

export const getCurrentUsersProfile = async () => {
	const result = await http.get<PrivateUserObject>(`/me`);
	return result;
};
export const getUsersTopArtistsAndTracks = async (
	type: "artists" | "tracks",
	params: {
		limit?: string;
		offset?: number;
		time_range?: "long_term" | "medium_term" | "short_term" | "medium_term";
	}
) => {
	const result = await http.get<PagingObject>(`/me/top/${type}`, { params });
	return result;
};
export const getUsersProfile = async (user_id: string) => {
	const result = await http.get<PublicUserObject>(`/users/${user_id}`);
	return result;
};
export const followPlaylist = async (
	playlist_id: string,
	body: { public?: boolean }
) => {
	const result = await http.put<any>(
		`/playlists/${playlist_id}/followers`,
		body
	);
	return result;
};
export const unfollowPlaylist = async (playlist_id: string) => {
	const result = await http.del<any>(`/playlists/${playlist_id}/followers`);
	return result;
};
export const getFollowed = async (params: {
	type: "artists";
	after?: string;
	limit?: number;
}) => {
	const result = await http.get<CursorPagedArtists>(`/me/following`, {
		params,
	});
	return result;
};
export const followArtistsUsers = async (params: {
	ids: string;
	type: "artist" | "user";
}) => {
	const result = await http.put<any>(`/me/following`, undefined, { params });
	return result;
};
export const unfollowArtistsUsers = async (params: {
	ids: string;
	type: "artist" | "user";
}) => {
	const result = await http.del<any>(`/me/following`, { params });
	return result;
};
export const checkCurrentUserFollows = async (params: {
	ids: string;
	type: "artist" | "user";
}) => {
	const result = await http.get<ArrayOfBooleans>(`/me/following/contains`, {
		params,
	});
	return result;
};
export const checkIfUserFollowsPlaylist = async (
	playlist_id: string,
	params: { ids: string }
) => {
	const result = await http.get<ArrayOfBooleans>(
		`/playlists/${playlist_id}/followers/contains`,
		{ params }
	);
	return result;
};
