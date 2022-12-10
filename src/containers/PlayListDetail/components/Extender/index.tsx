import { useRequest } from "ahooks";
import React from "react";
import { useIntl } from "react-intl";

import Table from "@components/Table";
import { PlaylistTrackObject } from "@service/playlists/types";
import { getRecommendations } from "@service/tracks";
import { SimplifiedTrackObject } from "@service/tracks/types";
import useColumns from "@utils/columns";

interface ExtenderProps {
  id: string;
  tracks: PlaylistTrackObject[];
  runAddTracksToPlaylist: (
    playlist_id: string,
    params: {
      position?: number;
      uris?: string;
    }
  ) => void;
}

export default function Extender(props:ExtenderProps)
{
  const {id,tracks,runAddTracksToPlaylist} = props;
  const {formatMessage} = useIntl();
  const extenderColumns = useColumns({
    number: { show: false },
    operations: { show: false },
  });
  const { data: recommendationTracks, run: runGetRecommendationTracks } =
    useRequest(getRecommendations, { manual: true });

  const randomPick = (array: any[], count = 5) => {
    if (array.length <= count) {
      return array;
    }

    const result = [];

    for (let i = 0; i < count; ++i) {
      const idx = Math.floor(Math.random() * array.length);
      result.push(array[idx]);
    }

    return result;
  };

  const handleGetRecommendations = () => {
    const trackIds = Array.from(
      new Set(
        tracks.filter((track) => track.track).map((track) => track.track.id)
      )
    );
    runGetRecommendationTracks({
      seed_artists: "",
      seed_genres: "",
      seed_tracks: randomPick(trackIds, 5).join(","),
    });
  };

  const handleAddTracksToCurrentPlaylist = (ids: string[]) => {
    id && runAddTracksToPlaylist(id, { uris: ids.join(",") });
  };

  return recommendationTracks ? <section>
    <h1 className="text-base">
      {formatMessage({ id: "playlist.extender.recommended.title" })}
    </h1>
    <p>
      {formatMessage({ id: "playlist.extender.songs.in.playlist" })}
    </p>
    <Table<SimplifiedTrackObject>
      showHeader={false}
      dataSource={recommendationTracks?.tracks ?? []}
      colcount={3}
      columns={extenderColumns.concat([
        {
          dataIndex: "uri",
          title: "addToPlaylist",
          visible: true,
          align: "right",
          render: (t) => 
            <button
              onClick={() => handleAddTracksToCurrentPlaylist([t])}
            >
              {formatMessage({
                id: tracks.find((track) => track.track.uri === t)
                  ? "duplicate.tracks.alreadyAdded"
                  : "playlist.extender.button.add",
              })}
            </button>
          ,
        },
      ])}
      rowKey={(row) => `${row.id}_${row.album?.id}`}
      total={recommendationTracks?.tracks?.length ?? 0}
      next={handleGetRecommendations}
      gridTemplateColumns="4fr 2fr minmax(120px, 1fr)"
    />
  </section> : null;
}