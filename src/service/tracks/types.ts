import { SimplifiedAlbumObject } from "@service/albums/types";
import { ArtistObject, SimplifiedArtistObject } from "@service/artists/types";
import {
	ExternalIdObject,
	ExternalUrlObject,
	SectionObject,
	SegmentObject,
	TimeIntervalObject,
} from "@service/types";

export interface ManyTracks {
	tracks: TrackObject[];
}
export interface TrackRestrictionObject {
	/** The reason for the restriction. Supported values:<br>
- `market` - The content item is not available in the given market.<br>
- `product` - The content item is not available for the user's subscription type.<br>
- `explicit` - The content item is explicit and the user's account is set to not play explicit content.<br>
Additional reasons may be added in the future.
**Note**: If you use this field, make sure that your application safely handles unknown values. */
	reason: string;
}
export interface TrackObject {
	/** The album on which the track appears. The album object includes a link in `href` to full information about the album. */
	album: SimplifiedAlbumObject;
	/** The artists who performed the track. Each artist object includes a link in `href` to more detailed information about the artist. */
	artists: ArtistObject[];
	/** A list of the countries in which the track can be played, identified by their [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code. */
	available_markets: string[];
	/** The disc number (usually `1` unless the album consists of more than one disc). */
	disc_number: number;
	/** The track length in milliseconds. */
	duration_ms: number;
	/** Whether or not the track has explicit lyrics ( `true` = yes it does; `false` = no it does not OR unknown). */
	explicit: boolean;
	/** Known external IDs for the track. */
	external_ids: ExternalIdObject;
	/** Known external URLs for this track. */
	external_urls: ExternalUrlObject;
	/** A link to the Web API endpoint providing full details of the track. */
	href: string;
	/** The [Spotify ID](/documentation/web-api/#spotify-uris-and-ids) for the track. */
	id: string;
	/** Part of the response when [Track Relinking](/documentation/general/guides/track-relinking-guide/) is applied. If `true`, the track is playable in the given market. Otherwise `false`. */
	is_playable: boolean;
	/** Part of the response when [Track Relinking](/documentation/general/guides/track-relinking-guide/) is applied, and the requested track has been replaced with different track. The track in the `linked_from` object contains information about the originally requested track. */
	linked_from: TrackObject;
	/** Included in the response when a content restriction is applied.
See [Restriction Object](/documentation/web-api/reference/#object-trackrestrictionobject) for more details. */
	restrictions: TrackRestrictionObject;
	/** The name of the track. */
	name: string;
	/** The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.<br>The popularity of a track is a value between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.<br>Generally speaking, songs that are being played a lot now will have a higher popularity than songs that were played a lot in the past. Duplicate tracks (e.g. the same track from a single and an album) are rated independently. Artist and album popularity is derived mathematically from track popularity. _**Note**: the popularity value may lag actual popularity by a few days: the value is not updated in real time._ */
	popularity: number;
	/** A link to a 30 second preview (MP3 format) of the track. Can be `null` */
	preview_url: string;
	/** The number of the track. If an album has several discs, the track number is the number on the specified disc. */
	track_number: number;
	/** The object type: "track". */
	type: string;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for the track. */
	uri: string;
	/** Whether or not the track is from a local file. */
	is_local: boolean;
}
export interface AudioFeaturesObject {
	/** A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic. */
	acousticness: number;
	/** A URL to access the full audio analysis of this track. An access token is required to access this data. */
	analysis_url: string;
	/** Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable. */
	danceability: number;
	/** The duration of the track in milliseconds. */
	duration_ms: number;
	/** Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy. */
	energy: number;
	/** The Spotify ID for the track. */
	id: string;
	/** Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0. */
	instrumentalness: number;
	/** undefined */
	key: number;
	/** Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live. */
	liveness: number;
	/** undefined */
	loudness: number;
	/** undefined */
	mode: number;
	/** Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks. */
	speechiness: number;
	/** undefined */
	tempo: number;
	/** undefined */
	time_signature: number;
	/** A link to the Web API endpoint providing full details of the track. */
	track_href: string;
	/** The object type. */
	type: string;
	/** The Spotify URI for the track. */
	uri: string;
	/** A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry). */
	valence: number;
}

export interface AudioAnalysisObject {
	/** undefined */
	meta: object;
	/** undefined */
	track: object;
	/** The time intervals of the bars throughout the track. A bar (or measure) is a segment of time defined as a given number of beats. */
	bars: TimeIntervalObject[];
	/** The time intervals of beats throughout the track. A beat is the basic time unit of a piece of music; for example, each tick of a metronome. Beats are typically multiples of tatums. */
	beats: TimeIntervalObject[];
	/** Sections are defined by large variations in rhythm or timbre, e.g. chorus, verse, bridge, guitar solo, etc. Each section contains its own descriptions of tempo, key, mode, time_signature, and loudness. */
	sections: SectionObject[];
	/** Each segment contains a roughly conisistent sound throughout its duration. */
	segments: SegmentObject[];
	/** A tatum represents the lowest regular pulse train that a listener intuitively infers from the timing of perceived musical events (segments). */
	tatums: TimeIntervalObject[];
}
export interface RecommendationSeedObject {
	/** The number of tracks available after min\_\* and max\_\* filters have been applied. */
	afterFilteringSize: number;
	/** The number of tracks available after relinking for regional availability. */
	afterRelinkingSize: number;
	/** A link to the full track or artist data for this seed. For tracks this will be a link to a [Track Object](/documentation/web-api/reference/#object-trackobject). For artists a link to [an Artist Object](/documentation/web-api/reference/#object-artistobject). For genre seeds, this value will be `null`. */
	href: string;
	/** The id used to select this seed. This will be the same as the string used in the `seed_artists`, `seed_tracks` or `seed_genres` parameter. */
	id: string;
	/** The number of recommended tracks available for this seed. */
	initialPoolSize: number;
	/** The entity type of this seed. One of `artist`, `track` or `genre`. */
	type: string;
}
export interface LinkedTrackObject {
	/** Known external URLs for this track. */
	external_urls: ExternalUrlObject;
	/** A link to the Web API endpoint providing full details of the track. */
	href: string;
	/** The [Spotify ID](/documentation/web-api/#spotify-uris-and-ids) for the track. */
	id: string;
	/** The object type: "track". */
	type: string;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for the track. */
	uri: string;
}

export interface SimplifiedTrackObject {
	/** The artists who performed the track. Each artist object includes a link in `href` to more detailed information about the artist. */
	artists: SimplifiedArtistObject[];
	/** A list of the countries in which the track can be played, identified by their [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code. */
	available_markets: string[];
	/** The disc number (usually `1` unless the album consists of more than one disc). */
	disc_number: number;
	/** The track length in milliseconds. */
	duration_ms: number;
	/** Whether or not the track has explicit lyrics ( `true` = yes it does; `false` = no it does not OR unknown). */
	explicit: boolean;
	/** External URLs for this track. */
	external_urls: ExternalUrlObject;
	/** A link to the Web API endpoint providing full details of the track. */
	href: string;
	/** The [Spotify ID](/documentation/web-api/#spotify-uris-and-ids) for the track. */
	id: string;
	/** Part of the response when [Track Relinking](/documentation/general/guides/track-relinking-guide/) is applied. If `true`, the track is playable in the given market. Otherwise `false`. */
	is_playable: boolean;
	/** Part of the response when [Track Relinking](/documentation/general/guides/track-relinking-guide/) is applied and is only part of the response if the track linking, in fact, exists. The requested track has been replaced with a different track. The track in the `linked_from` object contains information about the originally requested track. */
	linked_from: LinkedTrackObject;
	/** Included in the response when a content restriction is applied.
See [Restriction Object](/documentation/web-api/reference/#object-trackrestrictionobject) for more details. */
	restrictions: TrackRestrictionObject;
	/** The name of the track. */
	name: string;
	/** A URL to a 30 second preview (MP3 format) of the track. */
	preview_url: string;
	/** The number of the track. If an album has several discs, the track number is the number on the specified disc. */
	track_number: number;
	/** The object type: "track". */
	type: string;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for the track. */
	uri: string;
	/** Whether or not the track is from a local file. */
	is_local: boolean;
}

export interface RecommendationsObject {
	/** An array of [recommendation seed objects](/documentation/web-api/reference/#object-recommendationseedobject). */
	seeds: RecommendationSeedObject[];
	/** An array of [track object (simplified)](/documentation/web-api/reference/#object-simplifiedtrackobject) ordered according to the parameters supplied. */
	tracks: SimplifiedTrackObject[];
}
export interface RecommendationsParams {
	/** The target size of the list of recommended tracks. For seeds with unusually small pools or when highly restrictive filtering is applied, it may be impossible to generate the requested number of recommended tracks. Debugging information for such cases is available in the response. Default: 20\. Minimum: 1\. Maximum: 100. */
	limit: number;
	/** An [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
      If a country code is specified, only content that is available in that market will be returned.<br>
      If a valid user access token is specified in the request header, the country associated with
      the user account will take priority over this parameter.<br>
      _**Note**: If neither market or user country are provided, the content is considered unavailable for the client._<br>
      Users can view the country that is associated with their account in the [account settings](https://www.spotify.com/se/account/overview/). */
	market: string;
	/** A comma separated list of [Spotify IDs](/documentation/web-api/#spotify-uris-and-ids) for seed artists.  Up to 5 seed values may be provided in any combination of `seed_artists`, `seed_tracks` and `seed_genres`. */
	seed_artists: string;
	/** A comma separated list of any genres in the set of [available genre seeds](#available-genre-seeds).  Up to 5 seed values may be provided in any combination of `seed_artists`, `seed_tracks` and `seed_genres`. */
	seed_genres: string;
	/** A comma separated list of [Spotify IDs](/documentation/web-api/#spotify-uris-and-ids) for a seed track.  Up to 5 seed values may be provided in any combination of `seed_artists`, `seed_tracks` and `seed_genres`. */
	seed_tracks: string;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_acousticness: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_acousticness: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_acousticness: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_danceability: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_danceability: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_danceability: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_duration_ms: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_duration_ms: number;
	/** Target duration of the track (ms) */
	target_duration_ms: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_energy: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_energy: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_energy: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_instrumentalness: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_instrumentalness: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_instrumentalness: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_key: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_key: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_key: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_liveness: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_liveness: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_liveness: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_loudness: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_loudness: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_loudness: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_mode: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_mode: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_mode: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_popularity: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_popularity: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_popularity: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_speechiness: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_speechiness: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_speechiness: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_tempo: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_tempo: number;
	/** Target tempo (BPM) */
	target_tempo: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_time_signature: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_time_signature: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_time_signature: number;
	/** For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `min_tempo=140` would restrict results to only those tracks with a tempo of greater than 140 beats per minute. */
	min_valence: number;
	/** For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, `max_instrumentalness=0.35` would filter out most tracks that are likely to be instrumental. */
	max_valence: number;
	/** For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request `target_energy=0.6` and `target_danceability=0.8`. All target values will be weighed equally in ranking results. */
	target_valence: number;
}
export interface ManyAudioFeatures {
	audio_features: AudioFeaturesObject[];
}
