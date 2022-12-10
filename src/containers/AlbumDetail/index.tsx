import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { AlbumCard } from "@components/Card";
import ContentContainer from "@components/ContentContainer";
import { SaveAlbum } from "@components/Follow";
import Join from "@components/Join";
import Link from "@components/Link";
import { PlaylistMenu } from "@components/Menu";
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

function AlbumDetail() {
  const { id } = useParams();
  const user = useCurrentUser();
  const spotify = useSpotifyPlayer();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const [tracks, setTracks] = useState<TrackObject[]>([]);

  const paused = useSelector<state, boolean>((state) => state.player.paused);
  useSelector<state, { type?: string; id?: string; uri?: string }>(
    (state) => state.player.context
  );
  useSelector<state, TrackObject | undefined>(
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

  const {
    data: albumDetail,
    run: runGetAlbumDetail,
    loading,
  } = useRequest(getAnAlbum, {
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

  return (
    <ContentContainer
      initialLoading={loading}
      type="album"
      tag={albumDetail?.album_type ?? "album"}
      title={albumDetail?.name}
      extra={
        albumDetail && 
          <>
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
          </>
        
      }
      cover={albumDetail?.images?.[0]?.url}
      contextUri={`spotify:album:${id}`}
      operationExtra={
        <>
          {user && albumDetail && <SaveAlbum id={id} className="mr-24" />}
          <PlaylistMenu id={id} />
        </>
      }
    >
      {albumDetail && 
        <>
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
        </>
      }
    </ContentContainer>
  );
}

export default AlbumDetail;
