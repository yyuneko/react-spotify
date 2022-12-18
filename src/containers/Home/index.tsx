import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import { ArtistCard } from "@components/Card";
import Section from "@components/Section";
import Table from "@components/Table";
import { RecentlyPlayedOverview } from "@containers/Home/components/RecentlyPlayed";
import { TrackObject } from "@service/tracks/types";
import { getUsersTopArtists, getUsersTopTracks } from "@service/users";
import { state } from "@store/index";
import useColumns from "@utils/columns";
import { useCurrentUser } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

import { CommonProps } from "../../type";

export default function Home(props: CommonProps) {
  const { className } = props;
  const { formatMessage } = useIntl();
  const user = useCurrentUser();
  const spotify = useSpotifyPlayer();
  const [currentTime, setCurrentTime] = useState("");
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const columns = useColumns({
    album: { visible: (colCnt) => colCnt > 3 },
  });
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const { data: topArtists, run: runGetTopArtists } = useRequest(
    getUsersTopArtists,
    { manual: true }
  );
  const { data: topTracks, run: runGetTopTracks } = useRequest(
    getUsersTopTracks,
    { manual: true }
  );

  useEffect(() => {
    const now = new Date();

    if (now.getHours() < 12) {
      setCurrentTime(formatMessage({ id: "home.morning" }));
    } else if (now.getHours() < 18) {
      setCurrentTime(formatMessage({ id: "home.afternoon" }));
    } else {
      setCurrentTime(formatMessage({ id: "home.evening" }));
    }
  }, []);

  useEffect(() => {
    if (user) {
      runGetTopArtists({ time_range: "short_term" });
      runGetTopTracks({ time_range: "short_term" });
    }
  }, [user]);
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
    <div className={className}>
      <Section to={""} title={currentTime}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill,minmax(max(270px,25%),1fr))",
          }}
        ></div>
      </Section>
      {!!topArtists?.items?.length && 
        <Section 
          to={"/section/top_artists_this_month"}
          title={formatMessage({ id: "top_artists_this_month" })}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(var(--col-count),1fr)",
            }}
          >
            {topArtists.items.slice(0, colcount).map((artist) => 
              <ArtistCard
                key={artist.id}
                id={artist.id}
                name={artist.name}
                media={artist.images?.[0]?.url}
                type={formatMessage({ id: "card.tag.artist" })}
              />
            )}
          </div>
        </Section>
      }
      {!!topTracks?.items?.length && 
        <Section title={formatMessage({ id: "top_tracks_this_month" })}>
          <Table<TrackObject>
            gridTemplateColumns={{
              4: "16px 4fr 2fr minmax(120px, 1fr)",
              3: "16px 4fr minmax(120px, 1fr)",
            }}
            colcount={colcount > 4 ? 4 : 3}
            showHeader={false}
            dataSource={topTracks.items.slice(0, 4)}
            columns={columns}
            rowKey={(row) => `${row.id}_${row.album.id}`}
            total={Math.min(4, topTracks.items.length)}
            next={() => false}
            onRow={handleOnRow}
            rowSelection={rowSelected}
          />
        </Section>
      }
      <RecentlyPlayedOverview/>
    </div>
  );
}
