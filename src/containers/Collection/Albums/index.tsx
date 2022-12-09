import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useIntl } from "react-intl";

import { AlbumCard } from "@components/Card";
import Link from "@components/Link";
import { getUsersSavedAlbums } from "@service/albums";
import { SavedAlbumObject } from "@service/albums/types";
import { useCurrentUser } from "@utils/index";

export default function Albums() {
  const user = useCurrentUser();
  const { formatMessage } = useIntl();
  const [total, setTotal] = useState(0);
  const [albums, setAlbums] = useState<SavedAlbumObject[]>([]);
  const { run: runGetAlbums } = useRequest(getUsersSavedAlbums, {
    manual: true,
    onSuccess: (res) => {
      setTotal(res.total);
      setAlbums(albums.concat(res.items));
    },
  });
  useEffect(() => {
    if (user) {
      runGetAlbums({ limit: 20 });
    }
  }, [user]);

  const handleSearchAlbums = () => {
    if (user) {
      runGetAlbums({ limit: 20, offset: albums.length });
    }
  };

  return (
    <div>
      <h1 className="text-base">{formatMessage({ id: "albums" })}</h1>
      <InfiniteScroll
        next={handleSearchAlbums}
        hasMore={albums.length < total}
        loader={"Loading"}
        dataLength={albums.length}
        scrollableTarget="app__main"
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
        >
          {albums.map((album) => 
            <AlbumCard
              key={album.album.id}
              id={album.album.id}
              media={album.album.images?.[0]?.url}
              name={album.album.name}
              yearOrArtists={
                <div
                  className="flex"
                  style={{
                    alignItems: "baseline",
                    whiteSpace: "pre",
                    flexWrap: "wrap",
                  }}
                >
                  {album.album.artists.map((artist, index) => 
                    <span key={artist.id}>
                      <Link to={`/artist/${artist.id}`} ellipsis={false}>
                        {artist.name}
                      </Link>
                      {index != album.album.artists.length - 1 && ", "}
                    </span>
                  )}
                </div>
              }
            />
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
}