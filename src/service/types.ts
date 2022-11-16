import { type } from "os";

export interface PagingObject {
	/** A link to the Web API endpoint returning the full result of the request **/
	href: string;
	/** The requested content **/
	items: object[];
	/** The maximum number of items in the response (as set in the query or by default). **/
	limit: number;
	/** URL to the next page of items. ( `null` if none) **/
	next: string;
	/** The offset of the items returned (as set in the query or by default) **/
	offset: number;
	/** URL to the previous page of items. ( `null` if none) **/
	previous: string;
	/** The total number of items available to return. **/
	total: number;
}
export interface ExternalUrlObject {
	/** The [Spotify URL](/documentation/web-api/#spotify-uris-and-ids) for the object. */
	spotify: string;
}

export interface ImageObject {
	/** The source URL of the image. */
	url: string;
	/** The image height in pixels. */
	height: number;
	/** The image width in pixels. */
	width: number;
}
export type ArrayOfImages = ImageObject[];
export type ArrayOfBooleans = boolean[];

export interface FollowersObject {
	/** This will always be set to null, as the Web API does not support it at the moment. */
	href: string;
	/** The total number of followers. */
	total: number;
}
export interface ExternalIdObject {
	/** [International Standard Recording Code](http://en.wikipedia.org/wiki/International_Standard_Recording_Code) */
	isrc: string;
	/** [International Article Number](http://en.wikipedia.org/wiki/International_Article_Number_%28EAN%29) */
	ean: string;
	/** [Universal Product Code](http://en.wikipedia.org/wiki/Universal_Product_Code) */
	upc: string;
}

export interface TimeIntervalObject {
	/** The starting point (in seconds) of the time interval. */
	start: number;
	/** The duration (in seconds) of the time interval. */
	duration: number;
	/** The confidence, from 0.0 to 1.0, of the reliability of the interval. */
	confidence: number;
}
export interface SectionObject {
	/** The starting point (in seconds) of the section. */
	start: number;
	/** The duration (in seconds) of the section. */
	duration: number;
	/** The confidence, from 0.0 to 1.0, of the reliability of the section's "designation". */
	confidence: number;
	/** The overall loudness of the section in decibels (dB). Loudness values are useful for comparing relative loudness of sections within tracks. */
	loudness: number;
	/** The overall estimated tempo of the section in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration. */
	tempo: number;
	/** The confidence, from 0.0 to 1.0, of the reliability of the tempo. Some tracks contain tempo changes or sounds which don't contain tempo (like pure speech) which would correspond to a low value in this field. */
	tempo_confidence: number;
	/** The estimated overall key of the section. The values in this field ranging from 0 to 11 mapping to pitches using standard Pitch Class notation (E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on). If no key was detected, the value is -1. */
	key: number;
	/** The confidence, from 0.0 to 1.0, of the reliability of the key. Songs with many key changes may correspond to low values in this field. */
	key_confidence: number;
	/** Indicates the modality (major or minor) of a section, the type of scale from which its melodic content is derived. This field will contain a 0 for "minor", a 1 for "major", or a -1 for no result. Note that the major key (e.g. C major) could more likely be confused with the minor key at 3 semitones lower (e.g. A minor) as both keys carry the same pitches. */
	mode: number;
	/** The confidence, from 0.0 to 1.0, of the reliability of the `mode`. */
	mode_confidence: number;
	/** undefined */
	time_signature: number;
	/** The confidence, from 0.0 to 1.0, of the reliability of the `time_signature`. Sections with time signature changes may correspond to low values in this field. */
	time_signature_confidence: number;
}
export interface SegmentObject {
	/** The starting point (in seconds) of the segment. */
	start: number;
	/** The duration (in seconds) of the segment. */
	duration: number;
	/** The confidence, from 0.0 to 1.0, of the reliability of the segmentation. Segments of the song which are difficult to logically segment (e.g: noise) may correspond to low values in this field. */
	confidence: number;
	/** The onset loudness of the segment in decibels (dB). Combined with `loudness_max` and `loudness_max_time`, these components can be used to describe the "attack" of the segment. */
	loudness_start: number;
	/** The peak loudness of the segment in decibels (dB). Combined with `loudness_start` and `loudness_max_time`, these components can be used to describe the "attack" of the segment. */
	loudness_max: number;
	/** The segment-relative offset of the segment peak loudness in seconds. Combined with `loudness_start` and `loudness_max`, these components can be used to desctibe the "attack" of the segment. */
	loudness_max_time: number;
	/** The offset loudness of the segment in decibels (dB). This value should be equivalent to the loudness_start of the following segment. */
	loudness_end: number;
	/** Pitch content is given by a “chroma” vector, corresponding to the 12 pitch classes C, C#, D to B, with values ranging from 0 to 1 that describe the relative dominance of every pitch in the chromatic scale. For example a C Major chord would likely be represented by large values of C, E and G (i.e. classes 0, 4, and 7).

Vectors are normalized to 1 by their strongest dimension, therefore noisy sounds are likely represented by values that are all close to 1, while pure tones are described by one value at 1 (the pitch) and others near 0.
As can be seen below, the 12 vector indices are a combination of low-power spectrum values at their respective pitch frequencies.
<img src="https://developer.spotify.com/assets/audio/Pitch_vector.png" /> */
	pitches: number[];
	/** Timbre is the quality of a musical note or sound that distinguishes different types of musical instruments, or voices. It is a complex notion also referred to as sound color, texture, or tone quality, and is derived from the shape of a segment’s spectro-temporal surface, independently of pitch and loudness. The timbre feature is a vector that includes 12 unbounded values roughly centered around 0. Those values are high level abstractions of the spectral surface, ordered by degree of importance.

For completeness however, the first dimension represents the average loudness of the segment; second emphasizes brightness; third is more closely correlated to the flatness of a sound; fourth to sounds with a stronger attack; etc. See an image below representing the 12 basis functions (i.e. template segments).
<img src="https://developer.spotify.com/assets/audio/Timbre_basis_functions.png" />

The actual timbre of the segment is best described as a linear combination of these 12 basis functions weighted by the coefficient values: timbre = c1 x b1 + c2 x b2 + ... + c12 x b12, where c1 to c12 represent the 12 coefficients and b1 to b12 the 12 basis functions as displayed below. Timbre vectors are best used in comparison with each other. */
	timbre: number[];
}
export interface CursorObject {
	/** The cursor to use as key to find the next page of items. */
	after: string;
}
export interface CursorPagingObject {
	/** A link to the Web API endpoint returning the full result of the request. */
	href: string;
	/** The requested data. */
	items: object[];
	/** The maximum number of items in the response (as set in the query or by default). */
	limit: number;
	/** URL to the next page of items. ( `null` if none) */
	next: string;
	/** The cursors used to find the next set of items. */
	cursors: CursorObject;
	/** The total number of items available to return. */
	total: number;
}
