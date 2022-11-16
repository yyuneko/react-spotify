import { ArtistObject, SimplifiedArtistObject } from "@service/artists/types";
import { ExternalUrlObject, ImageObject, PagingObject } from "@service/types";

export interface AlbumRestrictionObject {
	/** The reason for the restriction. Albums may be restricted if the content is not available in a given market, to the user's subscription type, or when the user's account is set to not play explicit content.
Additional reasons may be added in the future. */
	reason: string;
}
export interface AlbumBase {
	/** The type of the album. **/
	album_type: string;
	/** The number of tracks in the album. **/
	total_tracks: number;
	/** The markets in which the album is available: [ISO 3166-1 alpha-2 country codes](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). _**NOTE**: an album is considered available in a market when at least 1 of its tracks is available in that market._ **/
	available_markets: string[];
	/** Known external URLs for this album. **/
	external_urls: ExternalUrlObject;
	/** A link to the Web API endpoint providing full details of the album. **/
	href: string;
	/** The [Spotify ID](/documentation/web-api/#spotify-uris-and-ids) for the album. **/
	id: string;
	/** The cover art for the album in various sizes, widest first. **/
	images: ImageObject[];
	/** The name of the album. In case of an album takedown, the value may be an empty string. **/
	name: string;
	/** The date the album was first released. **/
	release_date: string;
	/** The precision with which `release_date` value is known. **/
	release_date_precision: string;
	/** Included in the response when a content restriction is applied. **/
	restrictions: AlbumRestrictionObject;
	/** The object type. **/
	type: string;
	/** The [Spotify URI](/documentation/web-api/#spotify-uris-and-ids) for the album. **/
	uri: string;
}

export interface AlbumObject extends AlbumBase {
	/** The artists of the album. Each artist object includes a link in `href` to more detailed information about the artist. **/
	artists: ArtistObject[];
	/** The tracks of the album. */
	tracks: PagingObject;
}
export interface ManyAlbums {
	albums: AlbumObject[];
}
export interface PagedAlbums {
	albums: PagingObject[];
}

export interface SimplifiedAlbumObject extends AlbumBase {
	/** The field is present when getting an artist's albums. Compare to album_type this field represents relationship between the artist and the album. */
	album_group?: string;
	/** The artists of the album. Each artist object includes a link in `href` to more detailed information about the artist. */
	artists: SimplifiedArtistObject[];
}
