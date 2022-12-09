import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { AlbumCard } from "@components/Card";
import Link from "@components/Link";
import { SearchTabProps } from "@containers/Search";
import { AlbumObject } from "@service/albums/types";
import { search } from "@service/search";
import { dayjs } from "@utils/index";

export default function SearchAlbums(props: SearchTabProps) {
  const { q } = props;
  const [total, setTotal] = useState(0);
  const [albums, setAlbums] = useState<AlbumObject[]>([]);
  const { run, loading } = useRequest(search, {
    manual: true,
    onSuccess: (res) => {
      if (res.albums) {
        setTotal(res.albums.total);
        setAlbums(albums.concat(res.albums.items));
      }
    },
  });

  useEffect(() => {
    setAlbums([]);
    q &&
      run({
        q,
        type: "album",
        include_external: "audio",
        limit: 20,
      });
  }, [q]);

  const handleSearchAlbums = () => {
    if (loading) {
      return;
    }

    q &&
      run({
        q,
        type: "album",
        include_external: "audio",
        limit: 20,
        offset: albums.length,
      });
  };

  return (
    <InfiniteScroll
      next={handleSearchAlbums}
      hasMore={albums.length < total}
      loader={<div>Loading</div>}
      dataLength={albums.length}
      scrollableTarget="app__main"
    >
      <div
        className="grid pt-24"
        style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
      >
        {albums.map((album) => 
          <AlbumCard
            key={album.id}
            id={album.id}
            media={album.images[0].url}
            name={album.name}
            yearOrArtists={
              <div
                className="flex"
                style={{
                  alignItems: "baseline",
                  whiteSpace: "pre",
                  flexWrap: "wrap",
                }}
              >
                <span>{dayjs(album.release_date).year()}</span>
                {" • "}
                {album.artists.map((artist, index) => 
                  <>
                    <Link to={`/artist/${artist.id}`} ellipsis={false}>
                      {artist.name}
                    </Link>
                    {index != album.artists.length - 1 && ", "}
                  </>
                )}
              </div>
            }
          />
        )}
      </div>
    </InfiniteScroll>
  );
}
