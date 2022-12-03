import classnames from "_classnames@2.3.2@classnames";
import { useDebounce, useRequest } from "ahooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import Equalizer from "@assets/icons/equalizer.gif";
import { Follow } from "@components/Follow";
import Join from "@components/Join";
import Link from "@components/Link";
import NavBar from "@components/NavBar";
import PlayButton from "@components/PlayButton";
import Table, { ColumnProp } from "@components/Table";
import { PlaylistTrackObject } from "@service/playlists/types";
import { getUsersSavedTracks } from "@service/tracks";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import { PlayerState } from "@store/player/reducer";
import { dayjs, format, useCurrentUser } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

import styles from "../PlayListDetail/index.module.less";

function Favorite(props: any) {
  const { className } = props;
  const user = useCurrentUser();
  const spotify = useSpotifyPlayer();
  const { formatDate, formatMessage } = useIntl();
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const [tracks, setTracks] = useState<PlaylistTrackObject[]>([]);
  const [colcount, setColCount] = useState(window.innerWidth > 1000 ? 5 : 4);
  const colcountDebounce = useDebounce(colcount, { wait: 500 });
  const {
    context,
    position,
    paused,
    device: { current: currentDevice },
    trackWindow: { currentTrack },
  } = useSelector<state, PlayerState>((state) => state.player);
  const {
    data: playlistDetail,
    loading,
    run: runGetTracks,
  } = useRequest(getUsersSavedTracks, {
    manual: true,
    onSuccess: (res) => {
      res && setTracks(tracks.concat(res.items));
    },
  });

  const tracksCount = useMemo(
    () =>
      playlistDetail &&
      format(
        formatMessage({
          id: "tracklist-header.songs-counter",
        }),
        playlistDetail.total
      ),
    [playlistDetail?.total]
  );
  const columns: ColumnProp<PlaylistTrackObject>[] = [
    {
      dataIndex: "number",
      title: "#",
      visible: true,
      render: (t, r, index) => {
        return currentTrack?.id === r.track?.id && !paused ? 
          <img src={Equalizer} width="14" height="14" />
          : 
          <span className={currentTrack?.id === r.track?.id ? "playing" : ""}>
            {index + 1}
          </span>
        ;
      },
    },
    {
      dataIndex: "track",
      title: formatMessage({ id: "sort.title" }),
      visible: true,
      render: (t: TrackObject) => 
        <div className="inline-flex w-1-1">
          <img
            src={t.album.images?.[0]?.url}
            width="40"
            height="40"
            className="mr-16"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              maxWidth: "calc(100% - 40px)",
            }}
          >
            <Link
              to={`/track/${t.id}`}
              className={classnames({
                "text-base": true,
                "text-m": true,
                playing: currentTrack?.id === t.id,
              })}
            >
              {t.name}
            </Link>
            <Join>
              {t.artists.map((artist) => 
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="text-s"
                >
                  {artist.name}
                </Link>
              )}
            </Join>
          </div>
        </div>
      ,
    },
    {
      dataIndex: "track",
      title: formatMessage({ id: "sort.album" }),
      visible: (colcount) => colcount >= 4,
      render: (t: TrackObject) => 
        <div>
          <Link to={`/album/${t.album.id}`} className=" text-s">
            {t.album.name}
          </Link>
        </div>
      ,
    },
    {
      dataIndex: "added_at",
      title: formatMessage({ id: "sort.date-added" }),
      visible: (colcount) => colcount >= 5,
      render: (t: string) => <div>{formatDate(t)}</div>,
    },
    {
      dataIndex: "track",
      title: "时长",
      visible: (colcount) => colcount >= 3,
      render: (t: TrackObject, r) => 
        <div className="inline-flex" style={{ alignItems: "center" }}>
          <Follow followed={r.is_saved} className="mr-24" />
          <div className="ml-8">
            {dayjs.duration(t.duration_ms).format("m:ss")}
          </div>
        </div>
      ,
    },
  ];
  const onWindowResize = useCallback((e) => {
    setColCount(e.target.innerWidth > 1000 ? 5 : 4);
  }, []);

  useEffect(() => {
    user && runGetTracks({ limit: 20, market: "from_token" });
  }, [user]);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);

    return function () {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  const handlePlayCurrentPlaylist = () => {
    if (!playlistDetail || !currentDevice) {
      return;
    }

    if (paused) {
      spotify.start(
        { device_id: currentDevice },
        context.uri === `spotify:user:${user?.id}:collection`
          ? {
            context_uri: `spotify:user:${user?.id}:collection`,
            offset: { uri: currentTrack.uri },
            position_ms: position,
          }
          : { context_uri: `spotify:user:${user?.id}:collection` }
      );
    } else {
      spotify.player.pause();
    }
  };

  const handleSearchTracks = () => {
    if (loading) {
      return;
    }

    runGetTracks({
      offset: tracks.length,
      limit: 20,
      market: "from_token",
    });
  };

  const handleOnRow = (row: PlaylistTrackObject, index: number) => ({
    onClick: () => {
      if (index === rowSelected) {
        setRowSelected(undefined);
      } else {
        setRowSelected(index);
      }
    },
    onDoubleClick: () => {
      currentDevice &&
        spotify.start(
          { device_id: currentDevice },
          {
            context_uri: `spotify:user:${user?.id}:collection`,
            offset: { position: index },
          }
        );
    },
  });

  return playlistDetail ? 
    <>
      <NavBar />
      <div style={{ display: "flex", width: "100%", alignItems: "flex-end" }}>
        <img
          src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
          className={styles["playlist-cover"]}
        />
        <div style={{ flex: "1" }}>
          <span className="text-base">
            {formatMessage({ id: "playlists" })}
          </span>
          <div className="text-xl text-base text-bold">
            {formatMessage({ id: "keyboard.shortcuts.description.likedSongs" })}
          </div>
          <div className="inline-flex" style={{ alignItems: "baseline" }}>
            <Join type="dot">
              <Link to={`/user/${user?.id}`} className="text-base text-bold">
                {user?.display_name}
              </Link>
              <span className="text-base">{tracksCount}</span>
            </Join>
          </div>
        </div>
      </div>
      <div
        style={{ height: "104px", boxSizing: "border-box" }}
        className="flex p-24"
      >
        <PlayButton
          size={56}
          className="mr-32"
          isPlaying={
            !paused && context.uri === `spotify:user:${user?.id}:collection`
          }
          onClick={handlePlayCurrentPlaylist}
        />
      </div>
      <div className="pl-16 pr-16">
        <Table<PlaylistTrackObject>
          total={playlistDetail.total}
          next={handleSearchTracks}
          colcount={colcountDebounce}
          dataSource={tracks}
          columns={columns}
          rowKey={["track", "id"]}
          enabledKey={["track", "is_playable"]}
          onRow={handleOnRow}
          rowSelection={rowSelected}
        />
      </div>
    </>
    : 
    <div className={className}>Loading</div>
  ;
}

export default Favorite;
