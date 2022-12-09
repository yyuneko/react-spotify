import { useRequest } from "ahooks";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { FollowPlaylist } from "@components/Follow";
import Image from "@components/Image";
import Join from "@components/Join";
import Link from "@components/Link";
import { PlaylistMenu } from "@components/Menu";
import NavBar from "@components/NavBar";
import PlayButton from "@components/PlayButton";
import Table from "@components/Table";
import { getPlaylist, getPlaylistsTracks } from "@service/playlists";
import { PlaylistTrackObject } from "@service/playlists/types";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import { setTitle } from "@store/ui/reducer";
import useColumns from "@utils/columns";
import { dayjs, format, useCurrentUser, useFormatDuration } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

import styles from "./index.module.less";

function PlayListDetail(props: any) {
  const { className } = props;
  const { id } = useParams();
  const user = useCurrentUser();
  const spotify = useSpotifyPlayer();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const [tracks, setTracks] = useState<PlaylistTrackObject[]>([]);
  const duration = useFormatDuration(
    dayjs.duration(
      tracks.length
        ? tracks
          .map((item) => item.track.duration_ms)
          .reduce((sum, current) => sum + current)
        : 0
    )
  );
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

  const { data: playlistDetail, run: runGetPlaylistDetail } = useRequest(
    getPlaylist,
    {
      manual: true,
      onSuccess: (res) => {
        res && setTracks(res.tracks.items);
      },
    }
  );
  const columns = useColumns({
    contextUri: playlistDetail?.uri,
    album: { visible: (colCnt) => colCnt >= 4 },
    addAt: { show: true, visible: (colCnt: number) => colCnt >= 5 },
  });
  const { run: runGetPlaylistTracks, loading: runGetPlaylistTracksLoading } =
    useRequest(getPlaylistsTracks, {
      manual: true,
      onSuccess: (res) => {
        res && setTracks(tracks.concat(res.items));
      },
    });

  const followersCount = useMemo(
    () =>
      playlistDetail &&
      format(formatMessage({ id: "likes" }), playlistDetail.followers.total),
    [playlistDetail?.followers?.total]
  );

  const tracksCount = useMemo(
    () =>
      playlistDetail &&
      format(
        formatMessage({
          id: "tracklist-header.songs-counter",
        }),
        playlistDetail.tracks.total
      ),
    [playlistDetail?.tracks?.total]
  );

  useEffect(() => {
    if (id) {
      runGetPlaylistDetail(id, {
        additional_types: "track",
      });
    }
  }, [id]);

  useEffect(() => {
    if (paused && playlistDetail) {
      dispatch(setTitle(`Spotify - ${playlistDetail.name}`));
    }
  }, [paused, playlistDetail]);

  const handlePlayCurrentPlaylist = () => {
    if (!playlistDetail) {
      return;
    }

    if (paused) {
      spotify.start(
        { device_id: currentDevice },
        context.uri === playlistDetail.uri && currentTrack
          ? {
            context_uri: playlistDetail.uri,
            offset: { uri: currentTrack.uri },
            position_ms: position,
          }
          : { context_uri: playlistDetail.uri }
      );
    } else {
      spotify.player.pause();
    }
  };

  const handleSearchTracks = () => {
    if (runGetPlaylistTracksLoading) {
      return;
    }

    id &&
      runGetPlaylistTracks(id, {
        offset: tracks.length,
        limit: 20,
        additional_types: "track",
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
      spotify.start(
        { device_id: currentDevice },
        {
          context_uri: playlistDetail?.uri,
          offset: { position: index },
        }
      );
    },
  });

  return playlistDetail ? 
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "flex-end",
          boxSizing: "border-box",
        }}
        className="pl-16 pr-16 pb-24"
      >
        <Image
          alt="cover"
          className={styles["playlistCover"]}
          src={playlistDetail.images?.[0]?.url}
        />
        <div style={{ flex: "1" }}>
          <span className="text-base">{formatMessage({ id: "playlist" })}</span>
          <div className="text-xxl text-base text-bold">
            {playlistDetail.name}
          </div>
          <p className="text-m">{playlistDetail.description}</p>
          <div className="inline-flex" style={{ alignItems: "baseline" }}>
            <Join type="dot">
              <Link
                to={`/user/${playlistDetail.owner.id}`}
                className="text-base text-bold"
              >
                {playlistDetail.owner.display_name}
              </Link>

              {!!playlistDetail.followers.total && 
                <span className="text-base">{followersCount}</span>
              }

              <span className="text-base">{tracksCount}</span>
            </Join>
            ,&nbsp;
            <span>{duration}</span>
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
          isPlaying={!paused && context.uri === playlistDetail.uri}
          onClick={handlePlayCurrentPlaylist}
        />
        {user && playlistDetail && playlistDetail.owner.id != user?.id && 
          <FollowPlaylist id={id} className="mr-24" />
        }
        <PlaylistMenu id={id} />
      </div>
      <div className="pl-16 pr-16">
        <Table<Omit<PlaylistTrackObject, "track"> & TrackObject>
          gridTemplateColumns={{
            5: "16px 6fr 4fr 3fr minmax(120px, 1fr)",
            4: "16px 4fr 2fr minmax(120px, 1fr)",
            3: "16px 4fr minmax(120px, 1fr)",
          }}
          colcount={colcount >= 5 ? 5 : colcount >= 4 ? 4 : 3}
          total={playlistDetail.tracks.total}
          next={handleSearchTracks}
          dataSource={tracks.map((item) => ({
            ...item.track,
            is_saved: item.is_saved,
            added_at: item.added_at,
            added_by: item.added_by,
          }))}
          columns={columns}
          rowKey={(item) => `${item.id}_${item.album.id}`}
          enabledKey="is_playable"
          onRow={handleOnRow}
          rowSelection={rowSelected}
        />
        <section>
          <h1 className="text-base">
            {formatMessage({ id: "playlist.extender.recommended.title" })}
          </h1>
          <p>{formatMessage({ id: "playlist.extender.songs.in.playlist" })}</p>
        </section>
      </div>
    </>
    : 
    <div className={className}>Loading</div>
  ;
}

export default PlayListDetail;
