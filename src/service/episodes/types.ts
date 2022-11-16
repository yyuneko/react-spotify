import { ExternalUrlObject, ImageObject } from "@service/types";

export interface EpisodeRestrictionObject {
	/** The reason for the restriction. Supported values:<br>
- `market` - The content item is not available in the given market.<br>
- `product` - The content item is not available for the user's subscription type.<br>
- `explicit` - The content item is explicit and the user's account is set to not play explicit content.<br>
Additional reasons may be added in the future.
**Note**: If you use this field, make sure that your application safely handles unknown values. */
	reason: string;
}
export interface ResumePointObject {
	/** Whether or not the episode has been fully played by the user. */
	fully_played: boolean;
	/** The user's most recent position in the episode in milliseconds. */
	resume_position_ms: number;
}
export interface EpisodeBase {
	/** A URL to a 30 second preview (MP3 format) of the episode. `null` if not available. */
	audio_preview_url: string;
	/** A description of the episode. HTML tags are stripped away from this field, use `html_description` field in case HTML tags are needed. */
	description: string;
	/** A description of the episode. This field may contain HTML tags. */
	html_description: string;
	/** The episode length in milliseconds. */
	duration_ms: number;
	/** Whether or not the episode has explicit content (true = yes it does; false = no it does not OR unknown). */
	explicit: boolean;
	/** External URLs for this episode. */
	external_urls: ExternalUrlObject;
	/** A link to the Web API endpoint providing full details of the episode. */
	href: string;
	/** The [Spotify ID](/documentation/web-api/#spotify-uris-and-ids) for the episode. */
	id: string;
	/** The cover art for the episode in various sizes, widest first. */
	images: ImageObject[];
	/** True if the episode is hosted outside of Spotify's CDN. */
	is_externally_hosted: boolean;
	/** True if the episode is playable in the given market. Otherwise false. */
	is_playable: boolean;
	/** The language used in the episode, identified by a [ISO 639](https://en.wikipedia.org/wiki/ISO_639) code. This field is deprecated and might be removed in the future. Please use the `languages` field instead. */
	language: string;
	/** A list of the languages used in the episode, identified by their [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639) code. */
	languages: string[];
	/** The name of the episode. */
	name: string;
	/** The date the episode was first released, for example `"1981-12-15"`. Depending on the precision, it might be shown as `"1981"` or `"1981-12"`. */
	release_date: string;
	/** The precision with which `release_date` value is known. */
	release_date_precision: string;
	/** The user's most recent position in the episode. Set if the supplied access token is a user token and has the scope 'user-read-playback-position'. */
	resume_point: ResumePointObject;
	/** The object type. */
	type: string;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for the episode. */
	uri: string;
	/** Included in the response when a content restriction is applied.
See [Restriction Object](/documentation/web-api/reference/#object-episoderestrictionobject) for more details. */
	restrictions: EpisodeRestrictionObject;
}
export interface EpisodeObject extends EpisodeBase {
	/** The show on which the episode belongs. */
	show: SimplifiedShowObject;
}
export interface SimplifiedShowObject extends ShowBase {}
export interface CopyrightObject {
	/** The copyright text for this content. */
	text: string;
	/** The type of copyright: `C` = the copyright, `P` = the sound recording (performance) copyright. */
	type: string;
}
export interface ShowBase {
	/** A list of the countries in which the show can be played, identified by their [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code. */
	available_markets: string[];
	/** The copyright statements of the show. */
	copyrights: CopyrightObject[];
	/** A description of the show. HTML tags are stripped away from this field, use `html_description` field in case HTML tags are needed. */
	description: string;
	/** A description of the show. This field may contain HTML tags. */
	html_description: string;
	/** Whether or not the show has explicit content (true = yes it does; false = no it does not OR unknown). */
	explicit: boolean;
	/** External URLs for this show. */
	external_urls: ExternalUrlObject;
	/** A link to the Web API endpoint providing full details of the show. */
	href: string;
	/** The [Spotify ID](/documentation/web-api/#spotify-uris-and-ids) for the show. */
	id: string;
	/** The cover art for the show in various sizes, widest first. */
	images: ImageObject[];
	/** True if all of the shows episodes are hosted outside of Spotify's CDN. This field might be `null` in some cases. */
	is_externally_hosted: boolean;
	/** A list of the languages used in the show, identified by their [ISO 639](https://en.wikipedia.org/wiki/ISO_639) code. */
	languages: string[];
	/** The media type of the show. */
	media_type: string;
	/** The name of the episode. */
	name: string;
	/** The publisher of the show. */
	publisher: string;
	/** The object type. */
	type: string;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for the show. */
	uri: string;
}
