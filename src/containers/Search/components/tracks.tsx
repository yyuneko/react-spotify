import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Table from "@components/Table";
import { SearchTabProps } from "@containers/Search";
import { search } from "@service/search";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import useColumns from "@utils/columns";
import { useSpotifyPlayer } from "@utils/player";

export default function SearchTracks(props: SearchTabProps) {
  const { q } = props;
  const spotify = useSpotifyPlayer();
  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const [total, setTotal] = useState(0);
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const columns = useColumns({ album: { visible: (colCnt) => colCnt > 3 } });
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const { run, loading } = useRequest(search, {
    manual: true,
    onSuccess: (res) => {
      if (res.tracks) {
        setTotal(res.tracks.total);
        setTracks(tracks.concat(res.tracks.items));
      }
    },
  });

  useEffect(() => {
    setTracks([]);
    q &&
      run({
        q,
        type: "track",
        include_external: "audio",
        offset: tracks.length,
        limit: 20,
      });
  }, [q]);

  const handleSearchTracks = () => {
    if (loading) {
      return;
    }

    q &&
      run({
        q,
        type: "track",
        include_external: "audio",
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
      spotify.start({ device_id: currentDevice }, { uris: [row.uri] });
    },
  });

  return (
    <div className="pl-16 pr-16">
      <Table<TrackObject>
        gridTemplateColumns={{
          4: "16px 4fr 2fr minmax(120px, 1fr)",
          3: "16px 4fr minmax(120px, 1fr)",
        }}
        colcount={colcount > 4 ? 4 : 3}
        total={total}
        next={handleSearchTracks}
        dataSource={tracks}
        columns={columns}
        rowKey="id"
        onRow={handleOnRow}
        rowSelection={rowSelected}
      />
    </div>
  );
}
