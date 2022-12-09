import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { ArtistCard } from "@components/Card";
import Image from "@components/Image";
import Loading from "@components/Loading";
import { PlaylistMenu } from "@components/Menu";
import NavBar from "@components/NavBar";
import PlayButton from "@components/PlayButton";
import Table from "@components/Table";
import Tabs from "@components/Tabs";
import Albums from "@containers/Artist/components/albums";
import { SimplifiedAlbumObject } from "@service/albums/types";
import {
  getAnArtist,
  getAnArtistsAlbums,
  getAnArtistsRelatedArtists,
  getAnArtistsTopTracks,
} from "@service/artists";
import { TrackObject } from "@service/tracks/types";
import {
  checkCurrentUserFollows,
  followArtistsUsers,
  unfollowArtistsUsers,
} from "@service/users";
import { state } from "@store/index";
import { setTitle } from "@store/ui/reducer";
import useColumns from "@utils/columns";
import { format } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

import styles from "./index.module.less";

function Artist() {
  const { id } = useParams();
  const { formatMessage } = useIntl();
  const spotify = useSpotifyPlayer();
  const dispatch = useDispatch();
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const [albumsGroup, setAlbumsGroup] = useState<SimplifiedAlbumObject[]>([]);
  const [singlesGroup, setSinglesGroup] = useState<SimplifiedAlbumObject[]>([]);
  const [compilationsGroup, setCompilationsGroup] = useState<
    SimplifiedAlbumObject[]
  >([]);
  const [appearsOnGroup, setAppearsOnGroup] = useState<SimplifiedAlbumObject[]>(
    []
  );

  const {
    data: artistDetail,
    run: runGetArtistDetail,
    loading,
  } = useRequest(getAnArtist, { manual: true });
  const { data: topTracks, run: runGetTopTracks } = useRequest(
    getAnArtistsTopTracks,
    { manual: true }
  );
  const { data: following, run: runCheckIsFollowing } = useRequest(
    checkCurrentUserFollows,
    { manual: true }
  );
  const { run: runUnfollowArtist } = useRequest(unfollowArtistsUsers, {
    manual: true,
    onSuccess: () => id && runCheckIsFollowing({ ids: id, type: "artist" }),
  });
  const { run: runFollowArtist } = useRequest(followArtistsUsers, {
    manual: true,
    onSuccess: () => id && runCheckIsFollowing({ ids: id, type: "artist" }),
  });
  const { run: runGetAlbums } = useRequest(getAnArtistsAlbums, {
    manual: true,
    onSuccess: (res) => {
      setAlbumsGroup(
        res.items.filter((album) => album.album_group === "album")
      );
      setSinglesGroup(
        res.items.filter((album) => album.album_group === "single")
      );
      setCompilationsGroup(
        res.items.filter((album) => album.album_group === "compilation")
      );
      setAppearsOnGroup(
        res.items.filter((album) => album.album_group === "appears_on")
      );
    },
  });
  const { data: relatedArtists, run: runGetRelatedArtists } = useRequest(
    getAnArtistsRelatedArtists,
    { manual: true }
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
  const columns = useColumns({
    contextUri: artistDetail?.uri,
    album: { show: false },
    addAt: { show: false },
  });

  useEffect(() => {
    if (id) {
      runGetArtistDetail(id);
      runGetTopTracks(id);
      runCheckIsFollowing({ ids: id, type: "artist" });
      runGetAlbums(id, {
        include_groups: "album,single,appears_on,compilation",
      });
      runGetRelatedArtists(id);
    }
  }, [id]);
  useEffect(() => {
    if (paused && artistDetail) {
      dispatch(setTitle(`Spotify - ${artistDetail?.name}`));
    }
  }, [paused, artistDetail]);

  const handleSwitchFollowStatus = () => {
    if (!id) {
      return;
    }

    if (following?.[0]) {
      runUnfollowArtist({ ids: id, type: "artist" });
    } else {
      runFollowArtist({ ids: id, type: "artist" });
    }
  };

  const handlePlayCurrentArtist = () => {
    if (!artistDetail) {
      return;
    }

    if (paused) {
      spotify.start(
        { device_id: currentDevice },
        context.uri === artistDetail?.uri && currentTrack
          ? {
            context_uri: artistDetail?.uri,
            offset: { uri: currentTrack.uri },
            position_ms: position,
          }
          : { context_uri: artistDetail?.uri }
      );
    } else {
      spotify.player.pause();
    }
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
      spotify.start({ device_id: currentDevice }, { uris: [row.uri] });
    },
  });

  return (
    <Loading loading={loading}>
      <>
        <NavBar></NavBar>
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
            className={styles["artistCover"]}
            src={artistDetail?.images?.[0]?.url}
          />
          <div style={{ flex: "1" }}>
            <div className="text-xxl text-base text-bold">
              {artistDetail?.name}
            </div>
            <div>
              {format(
                formatMessage({ id: "artist.monthly-listeners-count" }),
                artistDetail?.popularity
              )}
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
            isPlaying={!paused && context.uri === artistDetail?.uri}
            onClick={handlePlayCurrentArtist}
          />
          <button onClick={handleSwitchFollowStatus}>
            {formatMessage({ id: following?.[0] ? "following" : "follow" })}
          </button>
          <PlaylistMenu id={id} />
        </div>
        <section>
          <h1 className="text-base">
            {formatMessage({ id: "artist.popular-tracks" })}
          </h1>
          <Table<TrackObject>
            gridTemplateColumns="16px 4fr minmax(120px, 1fr)"
            colcount={3}
            showHeader={false}
            dataSource={topTracks?.tracks ?? []}
            columns={columns}
            rowKey={(row) => row.album.id + "_" + row.id}
            total={topTracks?.tracks?.length ?? 0}
            next={() => false}
            onRow={handleOnRow}
            rowSelection={rowSelected}
          />
        </section>
        <section>
          <h1 className="text-base">
            {formatMessage({ id: "artist-page.discography" })}
          </h1>
          <Tabs
            items={[
              /*
               * {
               *   key: "artist-page.popular",
               *   label: formatMessage({ id: "artist-page.popular" }),
               *   children: <Albums items={albums.items.sort((a,b)=>a.)} />,
               * },
               */
              {
                key: "artist.albums",
                label: formatMessage({ id: "artist.albums" }),
                children: !!albumsGroup.length && 
                  <Albums items={albumsGroup} />
                ,
              },
              {
                key: "artist.singles",
                label: formatMessage({ id: "artist.singles" }),
                children: !!singlesGroup.length && 
                  <Albums items={singlesGroup} />
                ,
              },
              {
                key: "artist.compilations",
                label: formatMessage({ id: "artist.compilations" }),
                children: !!compilationsGroup.length && 
                  <Albums items={compilationsGroup} />
                ,
              },
            ]}
          />
        </section>
        <section>
          <h1 className="text-base">
            {format(
              formatMessage({ id: "artist-page.featuring.seo.title" }),
              artistDetail?.name
            )}
          </h1>
        </section>
        {!!relatedArtists?.artists?.length && 
          <section>
            <h1 className="text-base">
              {formatMessage({ id: "artist-page.fansalsolike" })}
            </h1>
            <div
              className="grid"
              aria-colcount={colcount}
              style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
            >
              {relatedArtists.artists.slice(0, colcount).map((artist) => 
                <ArtistCard
                  key={artist.id}
                  id={artist.id}
                  media={artist.images[0].url}
                  name={artist.name}
                  type={formatMessage({ id: "card.tag.artist" })}
                />
              )}
            </div>
          </section>
        }
        {!!appearsOnGroup.length && 
          <section>
            <h1 className="text-base">
              {formatMessage({ id: "artist.appears-on" })}
            </h1>
            <Albums items={appearsOnGroup} />
          </section>
        }
      </>
    </Loading>
  );
}

export default Artist;
