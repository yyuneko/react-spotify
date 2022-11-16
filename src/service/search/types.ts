import { PagingObject } from "@service/types";

export interface SearchItems {
	tracks?: PagingObject;
	artists?: PagingObject;
	albums?: PagingObject;
	playlists?: PagingObject;
	shows?: PagingObject;
	episodes?: PagingObject;
	audiobooks?: PagingObject;
}
