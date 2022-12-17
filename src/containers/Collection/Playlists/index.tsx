import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { PlaylistCard } from "@components/Card";
import Join from "@components/Join";
import Loading from "@components/Loading";
import PlayButton from "@components/PlayButton";
import { getAListOfCurrentUsersPlaylists } from "@service/playlists";
import { PlaylistTrackObject, SimplifiedPlaylistObject } from "@service/playlists/types";
import { getUsersSavedTracks } from "@service/tracks";
import { PagingObject } from "@service/types";
import { state } from "@store/index";
import { format, useCurrentUser, usePlayContext } from "@utils/index";

function LikedSongsCard(props: {
  likedSongs?: PagingObject<PlaylistTrackObject>;
}) {
  const { likedSongs } = props;
  const user = useCurrentUser();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string }
  >((state) => state.player.context);
  useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const handlePlayCurrentPlaylist = usePlayContext({
    uri: `spotify:user:${user?.id}:collection`,
  });

  return (
    <div
      className="flex gap-20 p-20 flex-col items-stretch relative justify-end text-base"
      style={{
        background: "linear-gradient(149.46deg,#450af5,#8e8ee5 99.16%)",
        gridColumn: "1/3",
      }}
      onClick={() => navigate("/collection/tracks")}
    >
      <div>
        <Join
          ellipsis={false}
          style={{
            display: "-webkit-box",
            maxHeight: "130px",
          }as React.CSSProperties}
        >
          {likedSongs?.items?.map?.((track) => 
            <span key={track.track.id}>
              <span>
                {track.track.artists.map((artist) => artist.name).join(",")}
              </span>
              &nbsp;
              <span className="opacity-70">{track.track.name}</span>
            </span>
          )}
        </Join>
      </div>
      <div>
        <div className="text-4xl">
          {formatMessage({ id: "sidebar.liked_songs" })}
        </div>
        <div>
          {format(
            formatMessage({ id: "artist-page.liked-songs-by-artist-title" }),
            likedSongs?.total
          )}
        </div>
      </div>
      <div className="absolute right-16 bottom-16">
        <PlayButton
          size={56}
          className="mr-32"
          isPlaying={
            !paused && context.uri === `spotify:user:${user?.id}:collection`
          }
          onClick={e => {handlePlayCurrentPlaylist();e.stopPropagation();}}
        />
      </div>
    </div>
  );
}

export default function Playlists() {
  const user = useCurrentUser();
  const { formatMessage } = useIntl();
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [playlists, setPlaylists] = useState<SimplifiedPlaylistObject[]>([]);
  const { run: runGetPlaylists } = useRequest(
    getAListOfCurrentUsersPlaylists,
    {
      manual: true,
      onSuccess: (res) => {
        setTotal(res.total);
        setPlaylists(playlists.concat(res.items));
      },
    }
  );
  const { data: likedSongs, run: runGetLikedSongs } = useRequest(
    getUsersSavedTracks,
    {
      manual: true,
      onSuccess: () => {
        setInitialLoading(false);
      },
    }
  );
  useEffect(() => {
    if (user) {
      setPlaylists([]);
      runGetPlaylists({ limit: 20 });
      runGetLikedSongs({ limit: 7 });
    }
  }, [user]);

  const handleSearchPlaylists = () => {
    if (user) {
      runGetPlaylists({ limit: 20, offset: playlists.length });
    }
  };

  return (
    <Loading loading={initialLoading}>
      <div>
        <h1 className="text-base">{formatMessage({ id: "playlists" })}</h1>
        <InfiniteScroll
          next={handleSearchPlaylists}
          hasMore={playlists.length < total}
          loader={"Loading"}
          dataLength={playlists.length}
          scrollableTarget="app__main"
        >
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
          >
            <LikedSongsCard likedSongs={likedSongs} />
            {playlists.map((playlist) => 
              <PlaylistCard
                key={playlist.id}
                id={playlist.id}
                media={playlist.images?.[0]?.url}
                name={playlist.name}
                owner={playlist.owner.display_name ?? playlist.owner.id}
              />
            )}
          </div>
        </InfiniteScroll>
      </div>
    </Loading>
  );
}
