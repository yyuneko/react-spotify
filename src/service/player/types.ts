import { EpisodeObject } from "@service/episodes/types";
import { TrackObject } from "@service/tracks/types";
import { ExternalUrlObject } from "@service/types";

export interface DeviceObject {
	/** The device ID. */
	id: string;
	/** If this device is the currently active device. */
	is_active: boolean;
	/** If this device is currently in a private session. */
	is_private_session: boolean;
	/** Whether controlling this device is restricted. At present if this is "true" then no Web API commands will be accepted by this device. */
	is_restricted: boolean;
	/** A human-readable name for the device. Some devices have a name that the user can configure (e.g. \"Loudest speaker\") and some devices have a generic name associated with the manufacturer or device model. */
	name: string;
	/** Device type, such as "computer", "smartphone" or "speaker". */
	type: string;
	/** The current volume in percent. */
	volume_percent: number;
}
export interface ContextObject {
	/** The object type, e.g. "artist", "playlist", "album", "show". */
	type: string;
	/** A link to the Web API endpoint providing full details of the track. */
	href: string;
	/** External URLs for this context. */
	external_urls: ExternalUrlObject;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for the context. */
	uri: string;
}

export interface CurrentlyPlayingContextObject {
	/** The device that is currently active. */
	device: DeviceObject;
	/** off, track, context */
	repeat_state: string;
	/** If shuffle is on or off. */
	shuffle_state: string;
	/** A Context Object. Can be `null`. */
	context: ContextObject;
	/** Unix Millisecond Timestamp when data was fetched. */
	timestamp: number;
	/** Progress into the currently playing track or episode. Can be `null`. */
	progress_ms: number;
	/** If something is currently playing, return `true`. */
	is_playing: boolean;
	/** The currently playing track or episode. Can be `null`. */
	item: TrackObject | EpisodeObject;
	/** The object type of the currently playing item. Can be one of `track`, `episode`, `ad` or `unknown`. */
	currently_playing_type: string;
	/** Allows to update the user interface based on which playback actions are available within the current context. */
	actions: DisallowsObject;
}
export interface ManyDevices {
	devices: DeviceObject[];
}

export interface QueueObject {
	/** The currently playing track or episode. Can be `null`. */
	currently_playing: TrackObject | EpisodeObject;
	/** The tracks or episodes in the queue. Can be empty. */
	queue: (TrackObject | EpisodeObject)[];
}
export interface DisallowsObject {
	/** Interrupting playback. Optional field. */
	interrupting_playback: boolean;
	/** Pausing. Optional field. */
	pausing: boolean;
	/** Resuming. Optional field. */
	resuming: boolean;
	/** Seeking playback location. Optional field. */
	seeking: boolean;
	/** Skipping to the next context. Optional field. */
	skipping_next: boolean;
	/** Skipping to the previous context. Optional field. */
	skipping_prev: boolean;
	/** Toggling repeat context flag. Optional field. */
	toggling_repeat_context: boolean;
	/** Toggling shuffle flag. Optional field. */
	toggling_shuffle: boolean;
	/** Toggling repeat track flag. Optional field. */
	toggling_repeat_track: boolean;
	/** Transfering playback between devices. Optional field. */
	transferring_playback: boolean;
}
