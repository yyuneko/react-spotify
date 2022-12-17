import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useIntl } from "react-intl";

import { ArtistCard } from "@components/Card";
import Loading from "@components/Loading";
import { ArtistObject } from "@service/artists/types";
import { getFollowed } from "@service/users";
import { useCurrentUser } from "@utils/index";

export default function Artists() {
  const user = useCurrentUser();
  const { formatMessage } = useIntl();
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [artists, setArtists] = useState<ArtistObject[]>([]);
  const { run: runGetArtists } = useRequest(getFollowed, {
    manual: true,
    onSuccess: (res) => {
      if (initialLoading) {
        setInitialLoading(false);
      }

      setTotal(res.artists.total);
      setArtists(artists.concat(res.artists.items));
    },
  });
  useEffect(() => {
    if (user) {
      setArtists([]);
      runGetArtists({ type: "artist", limit: 20 });
    }
  }, [user]);

  const handleSearchArtists = () => {
    if (user && artists.length) {
      runGetArtists({
        type: "artist",
        limit: 20,
        after: artists[artists.length - 1].id,
      });
    }
  };

  return (
    <Loading loading={initialLoading}>
      <div>
        <h1 className="text-base">{formatMessage({ id: "artists" })}</h1>
        <InfiniteScroll
          next={handleSearchArtists}
          hasMore={artists.length < total}
          loader={"Loading"}
          dataLength={artists.length}
          scrollableTarget="app__main"
        >
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
          >
            {artists.map((artist) => 
              <ArtistCard
                key={artist.id}
                id={artist.id}
                media={artist.images?.[0]?.url}
                name={artist.name}
                type={formatMessage({ id: "card.tag.artist" })}
              />
            )}
          </div>
        </InfiniteScroll>
      </div>
    </Loading>
  );
}
