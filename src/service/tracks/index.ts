import http from "@http/index";
import { ArrayOfBooleans, PagingObject } from "@service/types";
import {
	AudioAnalysisObject,
	AudioFeaturesObject,
	ManyAudioFeatures,
	ManyTracks,
	RecommendationsObject,
	RecommendationsParams,
	TrackObject,
} from "./types";

export const getTrack = async (id: string, params: { market?: string }) => {
	const result = await http.get<TrackObject>(`/tracks/${id}`, { params });
	return result;
};
export const getSeveralTracks = async (params: {
	ids: string;
	market?: string;
}) => {
	const result = await http.get<ManyTracks>(`/tracks`, { params });
	return result;
};
export const getUsersSavedTracks = async (params: {
	limit?: number;
	market?: string;
	offset?: string;
}) => {
	const result = await http.get<PagingObject>(`/me/tracks`, { params });
	return result;
};
export const saveTracksUser = async (params: { ids: string }) => {
	const result = await http.put<any>(`/me/tracks`, undefined, { params });
	return result;
};
export const removeTracksUser = async (params: { ids: string }) => {
	const result = await http.del<any>(`/me/tracks`, { params });
	return result;
};
export const checkUsersSavedTracks = async (params: { ids: string }) => {
	const result = await http.get<ArrayOfBooleans>(`/me/tracks/contains`, {
		params,
	});
	return result;
};
export const getSeveralAudioFeatures = async (params: { ids: string }) => {
	const result = await http.get<ManyAudioFeatures>(`/audio-features`, {
		params,
	});
	return result;
};
export const getAudioFeatures = async (id: string) => {
	const result = await http.get<AudioFeaturesObject>(`/audio-features/${id}`);
	return result;
};
export const getAudioAnalysis = async (id: string) => {
	const result = await http.get<AudioAnalysisObject>(`/audio-analysis/${id}`);
	return result;
};
export const getRecommendations = async (params: RecommendationsParams) => {
	const result = await http.get<RecommendationsObject>(`/recommendations`, {
		params,
	});
	return result;
};
