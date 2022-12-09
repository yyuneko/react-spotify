import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";

import { PlaylistCard } from "@components/Card";
import Loading from "@components/Loading";
import { SearchTabProps } from "@containers/Search";
import { PlaylistObject } from "@service/playlists/types";
import { search } from "@service/search";
import { state } from "@store/index";

export default function SearchPlaylists(props: SearchTabProps) {
  const { q } = props;
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const [playlists, setPlaylists] = useState<PlaylistObject[]>([]);
  const { run, loading } = useRequest(search, {
    manual: true,
    onSuccess: (res) => {
      if (initialLoading) {
        setInitialLoading(false);
      }

      if (res.playlists) {
        setTotal(res.playlists.total);
        setPlaylists(playlists.concat(res.playlists.items));
      }
    },
  });

  useEffect(() => {
    setPlaylists([]);
    q &&
      run({
        q,
        type: "playlist",
        include_external: "audio",
        limit: 20,
      });
  }, [q]);

  const handleSearchPlaylists = () => {
    if (loading) {
      return;
    }

    q &&
      run({
        q,
        type: "playlist",
        include_external: "audio",
        limit: 20,
        offset: playlists.length,
      });
  };

  return (
    <Loading loading={initialLoading}>
      <InfiniteScroll
        next={handleSearchPlaylists}
        hasMore={playlists.length < total}
        loader={<div>Loading</div>}
        dataLength={playlists.length}
        scrollableTarget="app__main"
      >
        <div
          className="grid pt-24"
          aria-colcount={colcount}
          style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
        >
          {playlists.map((playlist) => 
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              media={playlist.images[0].url}
              name={playlist.name}
              owner={playlist.owner.display_name ?? playlist.owner.id}
            />
          )}
        </div>
      </InfiniteScroll>
    </Loading>
  );
}
