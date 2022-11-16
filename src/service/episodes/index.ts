// import http from "@http/index"

// export const getAnEpisode = async (id) => {
//         const result = await http.get<OneEpisode>(`/episodes/{id}`);
//         return result;
// }
// export const getMultipleEpisodes = async () => {
//         const result = await http.get<ManyEpisodes>(`/episodes`);
//         return result;
// }
// export const getUsersSavedEpisodes = async () => {
//         const result = await http.get<PagingObject>(`/me/episodes`);
//         return result;
// }
// export const saveEpisodesUser = async () => {
//         const result = await http.put<any>(`/me/episodes`);
//         return result;
// }
// export const removeEpisodesUser = async () => {
//         const result = await http.delete<any>(`/me/episodes`);
//         return result;
// }
// export const checkUsersSavedEpisodes = async () => {
//         const result = await http.get<ArrayOfBooleans>(`/me/episodes/contains`);
//         return result;
// }
