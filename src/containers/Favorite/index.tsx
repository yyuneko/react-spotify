import { useRequest } from "ahooks";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import Image from "@components/Image";
import Join from "@components/Join";
import Link from "@components/Link";
import Loading from "@components/Loading";
import NavBar from "@components/NavBar";
import PlayButton from "@components/PlayButton";
import Table from "@components/Table";
import { PlaylistTrackObject } from "@service/playlists/types";
import { getUsersSavedTracks } from "@service/tracks";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import { setTitle } from "@store/ui/reducer";
import useColumns from "@utils/columns";
import { format, useCurrentUser } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

import styles from "../PlayListDetail/index.module.less";

function Favorite() {
  const user = useCurrentUser();
  const spotify = useSpotifyPlayer();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const [tracks, setTracks] = useState<PlaylistTrackObject[]>([]);
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string }
  >((state) => state.player.context);
  const position = useSelector<state, number>((state) => state.player.position);
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const currentTrack = useSelector<state, TrackObject | undefined>(
    (state) => state.player.trackWindow.currentTrack
  );

  const { data: playlistDetail, run: runGetTracks } = useRequest(
    getUsersSavedTracks,
    {
      manual: true,
      onSuccess: (res) => {
        if (loading) {
          setLoading(false);
        }

        res && setTracks(tracks.concat(res.items));
      },
    }
  );

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
  const columns = useColumns({
    contextUri: `spotify:user:${user?.id}`,
    album: { visible: (colCnt) => colCnt >= 4 },
    addAt: { show: true, visible: (colCnt: number) => colCnt >= 5 },
  });

  useEffect(() => {
    user && runGetTracks({ limit: 20 });
  }, [user]);
  useEffect(() => {
    if (paused) {
      dispatch(
        setTitle(
          `Spotify - ${formatMessage({
            id: "keyboard.shortcuts.description.likedSongs",
          })}`
        )
      );
    }
  }, [paused]);

  const handlePlayCurrentPlaylist = () => {
    if (!playlistDetail || !currentDevice) {
      return;
    }

    if (paused) {
      spotify.start(
        { device_id: currentDevice },
        context.uri === `spotify:user:${user?.id}:collection` && currentTrack
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
    });
  };

  const handleOnRow = (
    row: Omit<PlaylistTrackObject, "track"> & TrackObject,
    index: number
  ) => ({
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

  return (
    <Loading loading={loading}>
      <NavBar />
      <div style={{ display: "flex", width: "100%", alignItems: "flex-end" }}>
        <Image
          src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
          className={styles["playlistCover"]}
        />
        <div style={{ flex: "1" }}>
          <span className="text-base">{formatMessage({ id: "playlist" })}</span>
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
        <Table<Omit<PlaylistTrackObject, "track"> & TrackObject>
          colcount={colcount >= 5 ? 5 : colcount >= 4 ? 4 : 3}
          total={playlistDetail?.total ?? 0}
          next={handleSearchTracks}
          dataSource={tracks.map((item) => ({
            ...item.track,
            is_saved: item.is_saved,
            added_at: item.added_at,
            added_by: item.added_by,
          }))}
          columns={columns}
          rowKey="id"
          enabledKey="is_playable"
          onRow={handleOnRow}
          rowSelection={rowSelected}
          gridTemplateColumns={{
            5: "16px 6fr 4fr 3fr minmax(120px, 1fr)",
            4: "16px 4fr 2fr minmax(120px, 1fr)",
            3: "16px 4fr minmax(120px, 1fr)",
          }}
        />
      </div>
    </Loading>
  );
}

export default Favorite;
