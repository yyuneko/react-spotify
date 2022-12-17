import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import Paused from "@assets/icons/paused.svg";
import Playing from "@assets/icons/playing.svg";
import { Follow } from "@components/Follow";
import Image from "@components/Image";
import Join from "@components/Join";
import Link from "@components/Link";
import Table from "@components/Table";
import { getAnAlbumsTracks } from "@service/albums";
import { SimplifiedAlbumObject } from "@service/albums/types";
import { checkUsersSavedTracks, removeTracksUser, saveTracksUser } from "@service/tracks";
import { SimplifiedTrackObject, TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import useColumns from "@utils/columns";
import { dayjs, format, usePlayContext } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

import { CommonProps } from "../../../../type";
import styles from "../../index.module.less";

interface AlbumOverviewProps extends CommonProps {
  id: string;
  albumDetail: SimplifiedAlbumObject;
  setCurrentAlbum: (albumDetail?: SimplifiedAlbumObject) => void;
  currentAlbum?:SimplifiedAlbumObject;
}

export default function AlbumOverview(props: AlbumOverviewProps) {
  const { id, albumDetail, setCurrentAlbum,currentAlbum } = props;
  const { formatMessage } = useIntl();
  const { ref: headerRef, inView: headerInview } = useInView({
    root: document.querySelector("#app__main"),
    threshold: 0.2,
    // triggerOnce: true,
  });
  const { ref: bodyRef, inView: bodyInview } = useInView({
    root: document.querySelector("#app__main"),
    threshold: 0.2,
    // triggerOnce: true,
  });
  const spotify = useSpotifyPlayer();
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const currentTrack = useSelector<state, TrackObject | undefined>(
    (state) => state.player.trackWindow.currentTrack
  );
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string }
  >((state) => state.player.context);
  const [tracks, setTracks] = useState<SimplifiedTrackObject[]>([]);
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const columns = useColumns({
    image: { show: false },
    contextUri: albumDetail?.uri,
    album: { show: false },
    addAt: { show: false },
  });
  const { run: runGetAlbumTracks, loading: runGetAlbumTracksLoading } =
    useRequest(getAnAlbumsTracks, {
      manual: true,
      onSuccess: (res) => {
        res && setTracks(tracks.concat(res.items));
      },
    });

  const { data: isSavingTrack, run: checkIsSavingTrack } = useRequest(
    checkUsersSavedTracks,
    { manual: true }
  );

  const { run: runSaveTrack } = useRequest(saveTracksUser, {
    manual: true,
    onSuccess: () => {
      currentTrack?.id && checkIsSavingTrack({ ids: currentTrack.id });
    },
  });

  const { run: runRemoveTrack } = useRequest(removeTracksUser, {
    manual: true,
    onSuccess: () => {
      currentTrack?.id && checkIsSavingTrack({ ids: currentTrack.id });
    },
  });

  useEffect(() => {
    if(!headerInview && bodyInview){setCurrentAlbum(albumDetail);}
    else if(currentAlbum?.id === id){setCurrentAlbum(undefined);}

    if (id && bodyInview && tracks.length === 0) {
      setTracks([]);
      runGetAlbumTracks(id, { limit: 20 });
    }
  }, [id, bodyInview,headerInview,albumDetail,currentAlbum]);

  const handlePlayCurrentAlbum = usePlayContext({ 
    type: "context",
    uri: albumDetail.uri 
  });

  const handleSearchTracks = () => {
    if (runGetAlbumTracksLoading) {
      return;
    }

    id &&
    runGetAlbumTracks(id, {
      offset: tracks.length,
      limit: 20,
    });
  };

  const handleOnRow = (row: SimplifiedTrackObject, index: number) => ({
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
          context_uri: albumDetail?.uri,
          offset: { position: index },
        }
      );
    },
  });

  const toggleSaveTrack = () => {
    if (currentTrack?.id) {
      if (isSavingTrack?.[0]) {
        runRemoveTrack({ ids: currentTrack.id });
      } else {
        runSaveTrack({ ids: currentTrack.id });
      }
    }
  };

  return <div className={styles["albumOverview"]}>
    <div
      className="p-32 flex w-full items-end box-border gap-24 items-start"
      ref={headerRef}
    >
      <Image
        alt="cover"
        className="w-136 aspect-square"
        src={albumDetail?.images?.[0]?.url}/>
      <div className="flex-1 flex-col">
        <Link
          to={`/album/${albumDetail?.id}`}
          className="text-4xl text-base py-16 font-black">
          {albumDetail?.name}
        </Link>
        {albumDetail && <Join type="dot">
          <span>
            {formatMessage({ id: albumDetail?.album_type })}
          </span>
          <span>
            {dayjs(albumDetail.release_date)
              .year()}
          </span>
          <span>
            {format(
              formatMessage({
                id: "tracklist-header.songs-counter",
              }),
              albumDetail.total_tracks
            )}
          </span>
        </Join>}
        <div className="inline-flex gap-16 pt-8 items-center">
          {(paused || context.uri != albumDetail.uri) &&
            <button
              onClick={handlePlayCurrentAlbum}
              className={styles["togglePlay"] + " button"}
              title={formatMessage({ id: "playback-control.play" })}
            >
              <Paused/>
            </button>
          }
          {!paused && context.uri === albumDetail.uri &&
            <button
              onClick={handlePlayCurrentAlbum}
              className={styles["togglePlay"] + " button"}
              title={formatMessage({ id: "playback-control.pause" })}
            >
              <Playing/>
            </button>
          }
          <Follow
            size={24}
            onClick={toggleSaveTrack}
            followed={isSavingTrack?.[0]}
            style={{ width: "var(--button-size)" }}
          />
        </div>
      </div>
    </div>
    <Table<SimplifiedTrackObject>
      outerRef={bodyRef}
      scrollableTarget={`album_${albumDetail.id}`}
      className="px-16 xl:px-32"
      gridTemplateColumns="16px 4fr minmax(120px, 1fr)"
      colcount={3}
      total={albumDetail.total_tracks}
      next={handleSearchTracks}
      dataSource={tracks}
      columns={columns}
      rowKey="id"
      enabledKey="is_playable"
      onRow={handleOnRow}
      rowSelection={rowSelected}
    />
  </div>;
}