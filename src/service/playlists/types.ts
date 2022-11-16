import {
	ExternalUrlObject,
	FollowersObject,
	ImageObject,
} from "@service/types";
export interface PlaylistUserObject {
	/** Known public external URLs for this user. */
	external_urls: ExternalUrlObject;
	/** Information about the followers of this user. */
	followers: FollowersObject;
	/** A link to the Web API endpoint for this user. */
	href: string;
	/** The [Spotify user ID](/documentation/web-api/#spotify-uris-and-ids) for this user. */
	id: string;
	/** The object type. */
	type: string;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for this user. */
	uri: string;
}

export interface PlaylistOwnerObject extends PlaylistUserObject {
	/** The name displayed on the user's profile. `null` if not available. */
	display_name?: string;
}
export interface PlaylistObject {
	/** `true` if the owner allows other users to modify the playlist. */
	collaborative: boolean;
	/** The playlist description. _Only returned for modified, verified playlists, otherwise_ `null`. */
	description: string;
	/** Known external URLs for this playlist. */
	external_urls: ExternalUrlObject;
	/** Information about the followers of the playlist. */
	followers: FollowersObject;
	/** A link to the Web API endpoint providing full details of the playlist. */
	href: string;
	/** The [Spotify ID](/documentation/web-api/#spotify-uris-and-ids) for the playlist. */
	id: string;
	/** Images for the playlist. The array may be empty or contain up to three images. The images are returned by size in descending order. See [Working with Playlists](/documentation/general/guides/working-with-playlists/). _**Note**: If returned, the source URL for the image (`url`) is temporary and will expire in less than a day._ */
	images: ImageObject[];
	/** The name of the playlist. */
	name: string;
	/** The user who owns the playlist */
	owner: PlaylistOwnerObject;
	/** The playlist's public/private status: `true` the playlist is public, `false` the playlist is private, `null` the playlist status is not relevant. For more about public/private status, see [Working with Playlists](/documentation/general/guides/working-with-playlists/) */
	public: boolean;
	/** The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version */
	snapshot_id: string;
	/** The tracks of the playlist. */
	tracks: object;
	/** The object type: "playlist" */
	type: string;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for the playlist. */
	uri: string;
}
export interface PlaylistTracksRefObject {
	/** A link to the Web API endpoint where full details of the playlist's tracks can be retrieved. */
	href: string;
	/** Number of tracks in the playlist. */
	total: number;
}
export interface SimplifiedPlaylistObject {
	/** `true` if the owner allows other users to modify the playlist. */
	collaborative: boolean;
	/** The playlist description. _Only returned for modified, verified playlists, otherwise_ `null`. */
	description: string;
	/** Known external URLs for this playlist. */
	external_urls: ExternalUrlObject;
	/** A link to the Web API endpoint providing full details of the playlist. */
	href: string;
	/** The [Spotify ID](/documentation/web-api/#spotify-uris-and-ids) for the playlist. */
	id: string;
	/** Images for the playlist. The array may be empty or contain up to three images. The images are returned by size in descending order. See [Working with Playlists](/documentation/general/guides/working-with-playlists/). _**Note**: If returned, the source URL for the image (`url`) is temporary and will expire in less than a day._ */
	images: ImageObject[];
	/** The name of the playlist. */
	name: string;
	/** The user who owns the playlist */
	owner: PlaylistOwnerObject;
	/** The playlist's public/private status: `true` the playlist is public, `false` the playlist is private, `null` the playlist status is not relevant. For more about public/private status, see [Working with Playlists](/documentation/general/guides/working-with-playlists/) */
	public: boolean;
	/** The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version */
	snapshot_id: string;
	/** A collection containing a link ( `href` ) to the Web API endpoint where full details of the playlist's tracks can be retrieved, along with the `total` number of tracks in the playlist. Note, a track object may be `null`. This can happen if a track is no longer available. */
	tracks: PlaylistTracksRefObject;
	/** The object type: "playlist" */
	type: string;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for the playlist. */
	uri: string;
}

export interface PagingPlaylistObject {
	/** undefined */
	items: SimplifiedPlaylistObject[];
}
export interface PlaylistSnapshotId {
	snapshot_id: string;
}
