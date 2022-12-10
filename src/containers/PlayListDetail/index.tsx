import { useRequest } from "ahooks";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import ContentContainer from "@components/ContentContainer";
import { FollowPlaylist } from "@components/Follow";
import Join from "@components/Join";
import Link from "@components/Link";
import { PlaylistMenu } from "@components/Menu";
import Table from "@components/Table";
import Extender from "@containers/PlayListDetail/components/Extender";
import {
  addTracksToPlaylist,
  getPlaylist,
  getPlaylistsTracks,
} from "@service/playlists";
import { PlaylistTrackObject } from "@service/playlists/types";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import { setTitle } from "@store/ui/reducer";
import useColumns from "@utils/columns";
import { dayjs, format, useCurrentUser, useFormatDuration } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

function PlayListDetail() {
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
          .map((item) => item.track?.duration_ms ?? 0)
          .reduce((sum, current) => sum + current)
        : 0
    )
  );
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );

  const {
    data: playlistDetail,
    run: runGetPlaylistDetail,
    loading: initialLoading,
  } = useRequest(getPlaylist, {
    manual: true,
    onSuccess: (res) => {
      res && setTracks(res.tracks.items);
    },
  });
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
  const { run: runAddTracksToPlaylist } = useRequest(addTracksToPlaylist, {
    manual: true,
    onSuccess: () => {
      if (runGetPlaylistTracksLoading) {
        return;
      }

      id &&
        runGetPlaylistTracks(id, {
          offset: tracks.length,
          limit: 20,
          additional_types: "track",
        });
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

  return (
    <ContentContainer
      tag="playlist"
      type="playlist"
      title={playlistDetail?.name}
      initialLoading={initialLoading}
      contextUri={`spotify:playlist:${id}`}
      cover={playlistDetail?.images?.[0]?.url}
      extra={
        <>
          <Join type="dot">
            <Link
              to={`/user/${playlistDetail?.owner?.id}`}
              className="text-base text-bold"
            >
              {playlistDetail?.owner?.display_name}
            </Link>

            {!!playlistDetail?.followers?.total && 
              <span className="text-base">{followersCount}</span>
            }

            <span className="text-base">{tracksCount}</span>
          </Join>
          ,&nbsp;
          <span>{duration}</span>
        </>
      }
      operationExtra={
        <>
          {user && playlistDetail?.owner?.id != user?.id && 
            <FollowPlaylist id={id} className="mr-24" />
          }
          <PlaylistMenu id={id} />
        </>
      }
    >
      {playlistDetail && 
        <>
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
          {id && user?.id === playlistDetail.owner.id && 
            <Extender
              id={id}
              runAddTracksToPlaylist={runAddTracksToPlaylist}
              tracks={tracks}
            />
          }
        </>
      }
    </ContentContainer>
  );
}

export default PlayListDetail;
