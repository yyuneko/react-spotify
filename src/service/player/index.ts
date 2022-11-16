import http from "@http/index";
import { CursorPagingObject } from "@service/types";
import {
	CurrentlyPlayingContextObject,
	ManyDevices,
	QueueObject,
} from "./types";

export const getInformationAboutTheUsersCurrentPlayback = async (params: {
	additional_types?: string;
	market?: string;
}) => {
	const result = await http.get<CurrentlyPlayingContextObject>(`/me/player`, {
		params,
	});
	return result;
};
export const transferAUsersPlayback = async (body: {
	device_ids: string[];
	play: boolean;
}) => {
	const result = await http.put<any>(`/me/player`, body);
	return result;
};
export const getAUsersAvailableDevices = async () => {
	const result = await http.get<ManyDevices>(`/me/player/devices`);
	return result;
};
export const getTheUsersCurrentlyPlayingTrack = async (params: {
	additional_types?: string;
	market?: string;
}) => {
	const result = await http.get<CurrentlyPlayingContextObject>(
		`/me/player/currently-playing`,
		{ params }
	);
	return result;
};
export const startAUsersPlayback = async (
	params: { device_id?: string },
	body: {
		context_uri?: string;
		uris?: string[];
		offset?: {
			position?: number;
			uri?: string;
		};
		position_ms: number;
	}
) => {
	const result = await http.put<any>(`/me/player/play`, body, { params });
	return result;
};
export const pauseAUsersPlayback = async (params: { device_id?: string }) => {
	const result = await http.put<any>(`/me/player/pause`, undefined, {
		params,
	});
	return result;
};
export const skipUsersPlaybackToNextTrack = async (params: {
	device_id?: string;
}) => {
	const result = await http.post<any>(`/me/player/next`, undefined, {
		params,
	});
	return result;
};
export const skipUsersPlaybackToPreviousTrack = async (params: {
	device_id?: string;
}) => {
	const result = await http.post<any>(`/me/player/previous`, undefined, {
		params,
	});
	return result;
};
export const seekToPositionInCurrentlyPlayingTrack = async (params: {
	position_ms?: number;
	device_id?: string;
}) => {
	const result = await http.put<any>(`/me/player/seek`, undefined, {
		params,
	});
	return result;
};
export const setRepeatModeOnUsersPlayback = async (params: {
	state: "track" | "context" | "off";
	device_id?: string;
}) => {
	const result = await http.put<any>(`/me/player/repeat`, undefined, {
		params,
	});
	return result;
};
export const setVolumeForUsersPlayback = async (params: {
	volume_percent: number;
	device_id?: string;
}) => {
	const result = await http.put<any>(`/me/player/volume`, undefined, {
		params,
	});
	return result;
};
export const toggleShuffleForUsersPlayback = async (params: {
	state: boolean;
	device_id?: string;
}) => {
	const result = await http.put<any>(`/me/player/shuffle`, undefined, {
		params,
	});
	return result;
};
export const getRecentlyPlayed = async (params: {
	after?: number;
	before?: number;
	limit?: number;
}) => {
	const result = await http.get<CursorPagingObject>(
		`/me/player/recently-played`,
		{
			params,
		}
	);
	return result;
};
export const getQueue = async () => {
	const result = await http.get<QueueObject>(`/me/player/queue`);
	return result;
};
export const addToQueue = async (params: {
	uri: string;
	device_id?: string;
}) => {
	const result = await http.post<any>(`/me/player/queue`, undefined, {
		params,
	});
	return result;
};
