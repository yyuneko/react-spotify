import { ImageObject, PagingObject } from "@service/types";

export interface PagedCategories {
	categories: PagingObject;
}
export interface CategoryObject {
	/** A link to the Web API endpoint returning full details of the category. */
	href: string;
	/** The category icon, in various sizes. */
	icons: ImageObject[];
	/** The [Spotify category ID](/documentation/web-api/#spotify-uris-and-ids) of the category. */
	id: string;
	/** The name of the category. */
	name: string;
}
