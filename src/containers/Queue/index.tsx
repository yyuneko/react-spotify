import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import Equalizer from "@assets/icons/equalizer.gif";
import Image from "@components/Image";
import Link from "@components/Link";
import Table from "@components/Table";
import { getQueue } from "@service/player";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import useColumns from "@utils/columns";
import { useSpotifyPlayer } from "@utils/player";

export default function Queue() {
  const { formatMessage } = useIntl();
  const spotify = useSpotifyPlayer();
  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const currentTrack = useSelector<state, TrackObject | undefined>(
    (state) => state.player.trackWindow.currentTrack
  );
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string; name?: string }
  >((state) => state.player.context);
  const { data: queue, run: runGetQueue } = useRequest(getQueue, {
    manual: true,
    onSuccess: (res) => {
      const curIndex = res.queue.findIndex(
        (track) =>
          track.id === currentTrack?.id &&
          track.album.uri === currentTrack?.album?.uri
      );

      if (curIndex === -1) {
        setTracks(res.queue);

        return;
      }

      const before = res.queue.slice(0, curIndex);
      const after = res.queue.slice(curIndex + 1);
      setTracks(after.concat(before));
    },
  });
  const columns = useColumns({
    number: { start: 2 },
    album: { visible: (colCnt) => colCnt > 3 },
  });
  useEffect(() => {
    runGetQueue();
  }, [currentTrack?.id, context.uri]);
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
          offset: { uri: row.uri },
        }
      );
    },
  });

  return (
    <div>
      <h1>{formatMessage({ id: "playback-control.queue" })}</h1>
      {!!currentTrack && 
        <section>
          <h2>{formatMessage({ id: "queue.now-playing" })}</h2>
          <Table<TrackObject>
            gridTemplateColumns={{
              4: "16px 4fr 2fr minmax(120px, 1fr)",
              3: "16px 4fr minmax(120px, 1fr)",
            }}
            colcount={colcount > 4 ? 4 : 3}
            showHeader={false}
            dataSource={[currentTrack]}
            columns={[
              {
                title: "#",
                dataIndex: "number",
                visible: true,
                render: () =>
                  !paused ? 
                    <Image src={Equalizer} width="14" height="14" />
                    : 
                    <span className="playing">1</span>
                ,
              },
              ...columns.slice(1),
            ]}
            rowKey={"id"}
            total={1}
            next={() => false}
          />
        </section>
      }
      {!!queue?.queue?.length && 
        <section>
          <h2 className="inline-flex items-baseline">
            {formatMessage({ id: "queue.next-from" })}
            <Link to={`/${context.type}/${context.id}`}>{context.name}</Link>
          </h2>
          <Table<TrackObject>
            gridTemplateColumns={{
              4: "16px 4fr 2fr minmax(120px, 1fr)",
              3: "16px 4fr minmax(120px, 1fr)",
            }}
            colcount={colcount > 4 ? 4 : 3}
            showHeader={false}
            dataSource={tracks}
            columns={columns}
            rowKey={(row, index) => `${row.id}_${row.album.id}_${index}`}
            total={tracks.length}
            next={() => false}
            onRow={handleOnRow}
            rowSelection={rowSelected}
          />
        </section>
      }
    </div>
  );
}
