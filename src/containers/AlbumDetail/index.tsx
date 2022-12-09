import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { AlbumCard } from "@components/Card";
import { SaveAlbum } from "@components/Follow";
import Image from "@components/Image";
import Join from "@components/Join";
import Link from "@components/Link";
import { PlaylistMenu } from "@components/Menu";
import NavBar from "@components/NavBar";
import PlayButton from "@components/PlayButton";
import Table from "@components/Table";
import { getAnAlbum, getAnAlbumsTracks } from "@service/albums";
import { getAnArtistsAlbums } from "@service/artists";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import { setTitle } from "@store/ui/reducer";
import useColumns from "@utils/columns";
import { dayjs, format, useCurrentUser, useFormatDuration } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

import styles from "./index.module.less";

function AlbumDetail(props: any) {
  const { className } = props;
  const { id } = useParams();
  const user = useCurrentUser();
  const spotify = useSpotifyPlayer();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const [tracks, setTracks] = useState<TrackObject[]>([]);

  const position = useSelector<state, number>((state) => state.player.position);
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string }
  >((state) => state.player.context);
  const currentTrack = useSelector<state, TrackObject | undefined>(
    (state) => state.player.trackWindow.currentTrack
  );
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const duration = useFormatDuration(
    dayjs.duration(
      tracks.length
        ? tracks
          .map((item) => item.duration_ms)
          .reduce((sum, current) => sum + current)
        : 0
    )
  );

  const { data: albumDetail, run: runGetAlbumDetail } = useRequest(getAnAlbum, {
    manual: true,
    onSuccess: (res) => {
      res && setTracks(res.tracks.items);
      runGetRelatedAlbums(res.artists[0].id);
    },
  });
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

  const { data: relatedAlbums, run: runGetRelatedAlbums } = useRequest(
    getAnArtistsAlbums,
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (id) {
      runGetAlbumDetail(id);
    }
  }, [id]);
  useEffect(() => {
    if (paused && albumDetail) {
      dispatch(setTitle(`Spotify - ${albumDetail.name}`));
    }
  }, [paused, albumDetail]);

  const handlePlayCurrentPlaylist = () => {
    if (!albumDetail) {
      return;
    }

    if (paused) {
      spotify.start(
        { device_id: currentDevice },
        context.uri === albumDetail.uri && currentTrack
          ? {
            context_uri: albumDetail.uri,
            offset: { uri: currentTrack.uri },
            position_ms: position,
          }
          : { context_uri: albumDetail.uri }
      );
    } else {
      spotify.player.pause();
    }
  };

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

  const handleOnRow = (row: TrackObject, index: number) => ({
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

  return albumDetail ? 
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
          className={styles["albumCover"]}
          src={albumDetail.images?.[0]?.url}
        />
        <div style={{ flex: "1" }}>
          <span className="text-base">
            {formatMessage({ id: albumDetail.album_type })}
          </span>
          <div
            className="text-xxl text-base text-bold"
            style={{ fontSize: "2rem" }}
          >
            {albumDetail.name}
          </div>
          <div className="inline-flex" style={{ alignItems: "baseline" }}>
            <Join type="dot">
              {albumDetail.artists.map((artist) => 
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="text-base text-bold"
                >
                  {artist.name}
                </Link>
              )}
              <span className="text-base">
                {dayjs(albumDetail.release_date).year()}
              </span>
              <span className="text-base">
                {format(
                  formatMessage({
                    id: "tracklist-header.songs-counter",
                  }),
                  albumDetail.tracks.total
                )}
              </span>
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
          isPlaying={!paused && context.uri === albumDetail.uri}
          onClick={handlePlayCurrentPlaylist}
        />
        {user && albumDetail && <SaveAlbum id={id} className="mr-24" />}
        <PlaylistMenu id={id} />
      </div>
      <div className="pl-16 pr-16 pb-32">
        <Table<TrackObject>
          gridTemplateColumns="16px 4fr minmax(120px, 1fr)"
          colcount={3}
          total={albumDetail.tracks.total}
          next={handleSearchTracks}
          dataSource={tracks}
          columns={columns}
          rowKey="id"
          enabledKey="is_playable"
          onRow={handleOnRow}
          rowSelection={rowSelected}
        />
        <div className="mt-32">
          <div className="text-s">
            {dayjs(albumDetail.release_date).format(
              formatMessage({ id: "date-format" })
            )}
          </div>
          {albumDetail.copyrights?.map?.((copyright) => 
            <p
              key={copyright.type}
              style={{ fontSize: "0.6785rem", fontWeight: "400" }}
            >
              {copyright.type === "P" &&
                (copyright.text.startsWith("(P)")
                  ? copyright.text.replace("(P)", "℗")
                  : "℗ " + copyright.text)}
              {copyright.type === "C" &&
                (copyright.text.startsWith("(C)")
                  ? copyright.text.replace("(C)", "©")
                  : "© " + copyright.text)}
              {copyright.type === "R" &&
                (copyright.text.startsWith("(R)")
                  ? copyright.text.replace("(R)", "®")
                  : "® " + copyright.text)}
            </p>
          )}
        </div>
        {!!relatedAlbums?.items?.length && 
          <div>
            <h2 className="text-base">
              {format(
                formatMessage({ id: "album-page.more-by-artist" }),
                albumDetail.artists[0].name
              )}
            </h2>
            <div
              className={"grid " + styles["albumRelated"]}
              style={{
                gridTemplateColumns: "repeat(var(--col-count),minmax(0,1fr))",
                gridTemplateRows: "1fr",
                gridAutoRows: "0",
              }}
            >
              {relatedAlbums.items.slice(0, colcount).map((album) => 
                <AlbumCard
                  key={album.id}
                  id={album.id}
                  media={album.images[0].url}
                  name={album.name}
                  yearOrArtists={dayjs(albumDetail.release_date).year()}
                />
              )}
            </div>
          </div>
        }
      </div>
    </>
    : 
    <div className={className}>Loading</div>
  ;
}

export default AlbumDetail;
