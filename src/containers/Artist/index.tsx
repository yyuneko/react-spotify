import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { ArtistCard } from "@components/Card";
import ContentContainer from "@components/ContentContainer";
import { PlaylistMenu } from "@components/Menu";
import Section from "@components/Section";
import Table from "@components/Table";
import Tabs, { TabItem } from "@components/Tabs";
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
  const [compilationsGroup, setCompilationsGroup] = useState<SimplifiedAlbumObject[]>([]);
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
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
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
    <ContentContainer
      initialLoading={loading}
      type="artist"
      cover={artistDetail?.images?.[0]?.url}
      title={artistDetail?.name}
      extra={format(
        formatMessage({ id: "artist.monthly-listeners-count" }),
        artistDetail?.popularity
      )}
      operationExtra={
        <>
          <button onClick={handleSwitchFollowStatus}
            aria-checked={!!following?.[0]}
            className={"mr-24 " + styles["followButton"]}>
            {formatMessage({ id: following?.[0] ? "following" : "follow" })}
          </button>
          <PlaylistMenu id={id}/>
        </>
      }
      contextUri={`spotify:artist:${id}`}
    >
      <Section title={formatMessage({ id: "artist.popular-tracks" })}>
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
      </Section>
      {!!(
        albumsGroup.length ||
          singlesGroup.length ||
          compilationsGroup.length
      ) &&
        <Section
          to={`/artist/${id}/discography/all`}
          title={formatMessage({ id: "artist-page.discography" })}>
          <Tabs
            items={[
              !!albumsGroup.length && {
                key: "artist.albums",
                label: formatMessage({ id: "artist.albums" }),
                children: !!albumsGroup.length &&
                  <Albums items={albumsGroup}/>,
              },
              !!singlesGroup.length && {
                key: "artist.singles",
                label: formatMessage({ id: "artist.singles" }),
                children: !!singlesGroup.length &&
                  <Albums items={singlesGroup}/>,
              },
              !!compilationsGroup.length && {
                key: "artist.compilations",
                label: formatMessage({ id: "artist.compilations" }),
                children: !!compilationsGroup.length &&
                  <Albums items={compilationsGroup}/>,
              },
            ].filter((item) => item) as unknown as TabItem[]}
          />
        </Section>
      }
      <Section title={format(
        formatMessage({ id: "artist-page.featuring.seo.title" }),
        artistDetail?.name
      )}>
      </Section>
      {!!relatedArtists?.artists?.length &&
        <Section
          to={`/artist/${id}/related`}
          title={formatMessage({ id: "artist-page.fansalsolike" })}>
          <div
            className="grid"
            aria-colcount={colcount}
            style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
          >
            {relatedArtists.artists.slice(0, colcount)
              .map((artist) =>
                <ArtistCard
                  key={artist.id}
                  id={artist.id}
                  media={artist.images[0]?.url}
                  name={artist.name}
                  type={formatMessage({ id: "card.tag.artist" })}
                />
              )}
          </div>
        </Section>
      }
      {!!appearsOnGroup.length &&
        <Section
          to={`/artist/${id}/appears-on`}
          title={formatMessage({ id: "artist.appears-on" })}>
          <Albums items={appearsOnGroup}/>
        </Section>
      }
    </ContentContainer>
  );
}

export default Artist;
