import http from "@http/index";
import { ManyTracks } from "@service/tracks/types";
import { PagingObject } from "@service/types";
import { ArtistObject, ManyArtists } from "./types";

export const getAnArtist = async (id: string) => {
	const result = await http.get<ArtistObject>(`/artists/${id}`);
	return result;
};
export const getMultipleArtists = async (params: { ids: string }) => {
	const result = await http.get<ManyArtists>(`/artists`, { params });
	return result;
};
export const getAnArtistsAlbums = async (id: string) => {
	const result = await http.get<PagingObject>(`/artists/${id}/albums`);
	return result;
};
export const getAnArtistsTopTracks = async (
	id: string,
	params: {
		market?: string;
	}
) => {
	const result = await http.get<ManyTracks>(`/artists/${id}/top-tracks`, {
		params,
	});
	return result;
};
export const getAnArtistsRelatedArtists = async (id: string) => {
	const result = await http.get<ManyArtists>(
		`/artists/${id}/related-artists`
	);
	return result;
};
