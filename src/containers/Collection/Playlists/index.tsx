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
      className="flex p-20"
      style={{
        background: "linear-gradient(149.46deg,#450af5,#8e8ee5 99.16%)",
        position: "relative",
        gridColumn: "1/3",
        flexDirection: "column",
        alignItems: "stretch",
      }}
      onClick={() => navigate("/collection/tracks")}
    >
      <div className="flex">
        <Join
          style={{
            display: "-webkit-box",
            lineClamp: 3,
            maxHeight: "130px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {likedSongs?.items?.map?.((track) => 
            <span key={track.track.id}>
              <span className="text-base">
                {track.track.artists.map((artist) => artist.name).join(",")}
              </span>
              &nbsp;
              <span>{track.track.name}</span>
            </span>
          )}
        </Join>
      </div>
      <div className="text-base">
        <div style={{ fontSize: "2rem" }}>
          {formatMessage({ id: "sidebar.liked_songs" })}
        </div>
        <div>
          {format(
            formatMessage({ id: "artist-page.liked-songs-by-artist-title" }),
            likedSongs?.total
          )}
        </div>
      </div>
      <div style={{ position: "absolute", right: "16px", bottom: "16px" }}>
        <PlayButton
          size={56}
          className="mr-32"
          isPlaying={
            !paused && context.uri === `spotify:user:${user?.id}:collection`
          }
          onClick={handlePlayCurrentPlaylist}
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
