import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useIntl } from "react-intl";

import Anonymous from "@assets/icons/anonymous.svg";
import { ArtistCard } from "@components/Card";
import Loading from "@components/Loading";
import { SearchTabProps } from "@containers/Search";
import { ArtistObject } from "@service/artists/types";
import { search } from "@service/search";

export default function SearchArtists(props: SearchTabProps) {
  const { q } = props;
  const { formatMessage } = useIntl();
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [artists, setArtists] = useState<ArtistObject[]>([]);
  const { run, loading } = useRequest(search, {
    manual: true,
    onSuccess: (res) => {
      if (initialLoading) {
        setInitialLoading(false);
      }

      if (res.artists) {
        setTotal(res.artists.total);
        setArtists(artists.concat(res.artists.items));
      }
    },
  });

  useEffect(() => {
    setArtists([]);
    q &&
      run({
        q,
        type: "artist",
        include_external: "audio",
        limit: 20,
      });
  }, [q]);

  const handleSearchArtists = () => {
    if (loading) {
      return;
    }

    q &&
      run({
        q,
        type: "artist",
        include_external: "audio",
        limit: 20,
        offset: artists.length,
      });
  };

  return (
    <Loading loading={initialLoading}>
      <InfiniteScroll
        next={handleSearchArtists}
        hasMore={artists.length < total}
        loader={<div>Loading</div>}
        dataLength={artists.length}
        scrollableTarget="app__main"
      >
        <div
          className="grid pt-24"
          style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
        >
          {artists.map((artist) => 
            <ArtistCard
              key={artist.id}
              id={artist.id}
              media={artist.images?.[0]?.url}
              name={artist.name}
              type={formatMessage({ id: "card.tag.artist" })}
              fallback={<Anonymous width="64" height="64" />}
            />
          )}
        </div>
      </InfiniteScroll>
    </Loading>
  );
}
