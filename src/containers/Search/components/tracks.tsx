import classnames from "_classnames@2.3.2@classnames";
import { useDebounce, useRequest } from "ahooks";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import Equalizer from "@assets/icons/equalizer.gif";
import { Follow } from "@components/Follow";
import Join from "@components/Join";
import Link from "@components/Link";
import Table, { ColumnProp } from "@components/Table";
import { SearchTabProps } from "@containers/Search";
import { search } from "@service/search";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import { PlayerState } from "@store/player/reducer";
import { dayjs } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

export default function SearchTracks(props: SearchTabProps) {
  const { q } = props;
  const spotify = useSpotifyPlayer();
  const { formatMessage } = useIntl();
  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const [colcount, setColCount] = useState(window.innerWidth > 776 ? 4 : 3);
  const colcountDebounce = useDebounce(colcount, { wait: 500 });
  const [total, setTotal] = useState(0);
  const columns: ColumnProp<TrackObject>[] = [
    {
      dataIndex: "number",
      title: "#",
      visible: true,
      render: (t, r, index) =>
        currentTrack?.id === r.id && !paused ? 
          <img src={Equalizer} width="14" height="14" />
          : 
          <span className={currentTrack?.id === r.id ? "playing" : ""}>
            {index + 1}
          </span>
      ,
    },
    {
      dataIndex: "name",
      title: formatMessage({ id: "sort.title" }),
      visible: true,
      render: (t, r) => 
        <div className="inline-flex w-1-1">
          <img
            width="40"
            height="40"
            className="mr-16"
            src={r.album.images?.[0]?.url}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              maxWidth: "calc(100% - 40px)",
            }}
          >
            <Link
              to={`/track/${r.id}`}
              className={classnames({
                "text-base": true,
                "text-m": true,
                playing: currentTrack?.id === r.id,
              })}
            >
              {t}
            </Link>
            <Join>
              {r.artists.map((artist) => 
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="text-s"
                >
                  {artist.name}
                </Link>
              )}
            </Join>
          </div>
        </div>
      ,
    },
    {
      dataIndex: "album",
      title: formatMessage({ id: "sort.album" }),
      visible: (colcount) => colcount >= 4,
      render: (t) => 
        <div>
          <Link to={`/album/${t.id}`} className=" text-s">
            {t.name}
          </Link>
        </div>
      ,
    },
    {
      dataIndex: "duration_ms",
      title: "时长",
      visible: (colcount) => colcount >= 3,
      render: (t, r) => 
        <div className="inline-flex" style={{ alignItems: "center" }}>
          <Follow followed={r.is_saved} className="mr-24" />
          <div className="ml-8">{dayjs.duration(t).format("m:ss")}</div>
        </div>
      ,
    },
  ];

  const {
    paused,
    device: { current: currentDevice },
    trackWindow: { currentTrack },
  } = useSelector<state, PlayerState>((state) => state.player);

  const { run, loading } = useRequest(search, {
    manual: true,
    onSuccess: (res) => {
      if (res.tracks) {
        setTotal(res.tracks.total);
        setTracks(tracks.concat(res.tracks.items));
      }
    },
  });

  const onWindowResize = useCallback((e) => {
    setColCount(e.target.innerWidth > 776 ? 4 : 3);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);

    return function () {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

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
        total={total}
        next={handleSearchTracks}
        colcount={colcountDebounce}
        dataSource={tracks}
        columns={columns}
        rowKey="id"
        onRow={handleOnRow}
        rowSelection={rowSelected}
      />
    </div>
  );
}
