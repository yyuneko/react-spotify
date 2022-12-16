import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import Anonymous from "@assets/icons/anonymous.svg";
import {
  AlbumCard,
  ArtistCard,
  PlaylistCard,
  PopularSearchResultCard,
  SearchResultProps,
} from "@components/Card";
import Link from "@components/Link";
import Loading from "@components/Loading";
import Table from "@components/Table";
import { SearchTabProps } from "@containers/Search";
import { search } from "@service/search";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import useColumns from "@utils/columns";
import { dayjs } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

export default function SearchAll(props: SearchTabProps) {
  const { q } = props;
  const { formatMessage } = useIntl();
  const spotify = useSpotifyPlayer();
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const [mostPopular, setMostPopular] = useState<
    SearchResultProps | undefined
  >();
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const { data, run, loading } = useRequest(search, {
    manual: true,
    onSuccess: (res) => {
      if (!(res.tracks && res.artists)) {
        return;
      }

      if (res.artists.items[0].popularity >= res.tracks.items[0].popularity) {
        setMostPopular({ type: "artist", value: res.artists.items[0] });
      } else {
        setMostPopular({ type: "track", value: res.tracks.items[0] });
      }
    },
  });
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const columns = useColumns({
    number: { show: false },
    album: { show: false },
  });

  useEffect(() => {
    q &&
      run({
        q,
        type: "track,artist,album,playlist",
        include_external: "audio",
      });
  }, [q]);

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
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(var(--col-count),minmax(0,1fr))",
        }}
      >
        {mostPopular && 
          <section style={{ gridColumn: "1/3" }}>
            <h2 className="text-base">
              {formatMessage({ id: "search.title.top-result" })}
            </h2>
            <PopularSearchResultCard {...mostPopular} />
          </section>
        }
        {!!data?.tracks?.items?.length && 
          <section style={{ gridColumn: colcount > 3 ? "3/-1" : "1/-1" }}>
            <h2 className="text-base">
              {formatMessage({ id: "search.title.tracks" })}
            </h2>
            <Table<TrackObject>
              gridTemplateColumns="4fr minmax(120px, 1fr)"
              colcount={2}
              showHeader={false}
              total={Math.min(4, data.tracks.limit)}
              next={() => false}
              dataSource={data.tracks.items.slice(0, 4) ?? []}
              columns={columns}
              rowKey="id"
              onRow={handleOnRow}
              rowSelection={rowSelected}
            />
          </section>
        }
        {!!data?.artists?.items?.length && 
          <section style={{ gridColumn: "1/-1" }}>
            <h2 className="text-base">
              {formatMessage({ id: "search.title.artists" })}
            </h2>
            <div
              className="grid pt-24"
              style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
            >
              {data.artists.items.slice(0, colcount).map((artist) => 
                <ArtistCard
                  key={artist.id}
                  id={artist.id}
                  media={artist.images?.[0]?.url}
                  name={artist.name}
                  type={formatMessage({ id: "card.tag.artist" })}
                  fallback={<Anonymous width="64" height="64" />}
                />
              )}
            </div>
          </section>
        }
        {!!data?.albums?.items?.length && 
          <section style={{ gridColumn: "1/-1" }}>
            <h2 className="text-base">
              {formatMessage({ id: "search.title.albums" })}
            </h2>
            <div
              className="grid pt-24"
              style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
            >
              {data.albums.items.slice(0, colcount).map((album) => 
                <AlbumCard
                  key={album.id}
                  id={album.id}
                  media={album.images[0]?.url}
                  name={album.name}
                  yearOrArtists={
                    <div className="flex items-baseline whitespace-pre flex-wrap">
                      <span>{dayjs(album.release_date).year()}</span>
                      {" • "}
                      {album.artists.map((artist, index) => 
                        <span key={artist.id}>
                          <Link to={`/artist/${artist.id}`}>
                            {artist.name}
                          </Link>
                          {index != album.artists.length - 1 && ", "}
                        </span>
                      )}
                    </div>
                  }
                />
              )}
            </div>
          </section>
        }
        {!!data?.playlists?.items?.length && 
          <section style={{ gridColumn: "1/-1" }}>
            <h2 className="text-base">
              {formatMessage({ id: "search.title.playlists" })}
            </h2>
            <div
              className="grid pt-24"
              style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
            >
              {data.playlists.items.slice(0, colcount).map((playlist) => 
                <PlaylistCard
                  key={playlist.id}
                  id={playlist.id}
                  media={playlist.images[0]?.url}
                  name={playlist.name}
                  owner={playlist.owner.display_name ?? playlist.owner.id}
                />
              )}
            </div>
          </section>
        }
      </div>
    </Loading>
  );
}
