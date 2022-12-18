import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import Section from "@components/Section";
import Table from "@components/Table";
import { getRecentlyPlayed } from "@service/player";
import { ContextObject } from "@service/player/types";
import { SimplifiedTrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import useColumns from "@utils/columns";
import { useCurrentUser } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

interface FlattenPlayHistoryObject extends SimplifiedTrackObject {
  context: ContextObject;
  played_at: string;
}

export function RecentlyPlayedOverview() {
  const { formatMessage } = useIntl();
  const spotify = useSpotifyPlayer();
  const user = useCurrentUser();
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const columns = useColumns({
    operations: { show: false },
    album: { visible: colCnt => colCnt >= 3 }
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState<FlattenPlayHistoryObject[]>([]);
  const {
    run: runGetRecentlyPlayed
  } = useRequest(getRecentlyPlayed, {
    manual: true,
    onSuccess: res => {
      setRecentlyPlayed(res.items.map(item => ({
        context: item.context,
        played_at: item.played_at,
        ...item.track
      })));
    }
  });
  useEffect(() => {
    user && runGetRecentlyPlayed({ limit: 4 });
  }, [user]);
  const handleOnRow = (row: FlattenPlayHistoryObject, index: number) => ({
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

  return <Section
    to={"/section/recently-played"}
    title={formatMessage({ id: "view.recently-played" })}
  >
    <Table<FlattenPlayHistoryObject>
      gridTemplateColumns={{
        3: "16px 4fr 2fr",
        2: "16px 4fr",
      }}
      colcount={colcount > 4 ? 3 : 2}
      showHeader={false}
      dataSource={recentlyPlayed}
      columns={columns}
      rowKey={(row) => `${row.id}_${row.context?.uri}_${row.played_at}`}
      total={Math.min(4, recentlyPlayed.length)}
      next={() => false}
      onRow={handleOnRow}
      rowSelection={rowSelected}
    />
  </Section>;
}

export default function RecentlyPlayed() {
  const { formatMessage } = useIntl();
  const spotify = useSpotifyPlayer();
  const user = useCurrentUser();
  const [before,setBefore] = useState<number|undefined>();
  const [rowSelected, setRowSelected] = useState<number | undefined>();
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const columns = useColumns({
    operations: { show: false },
    album: { visible: colCnt => colCnt >= 3 }
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState<FlattenPlayHistoryObject[]>([]);
  const {
    run: runGetRecentlyPlayed
  } = useRequest(getRecentlyPlayed, {
    manual: true,
    onSuccess: res => {
      if(res.cursors?.before && res.items.length) {setBefore(+res.cursors.before);}
      else {setBefore(undefined);}

      const items = recentlyPlayed.concat(res.items.map(item => ({
        context: item.context,
        played_at: item.played_at,
        ...item.track
      })));
      const map = new Map();
      const finalItems:FlattenPlayHistoryObject[] = [];
      items.forEach(item => {
        if(!map.get(item.id)){
          map.set(item.id,true);
          finalItems.push(item);
        }
      });
      setRecentlyPlayed(finalItems);
    }
  });
  useEffect(() => {
    setRecentlyPlayed([]);
    user && runGetRecentlyPlayed({ limit: 20 });
  }, [user]);

  const next = () => {
    user && before && runGetRecentlyPlayed({ limit: 20, before });
  };

  const handleOnRow = (row: FlattenPlayHistoryObject, index: number) => ({
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

  return <section className="px-16 xl:px-32">
    <h1 className="text-base text-2xl">
      {formatMessage({ id: "view.recently-played" })}
    </h1>
    <Table<FlattenPlayHistoryObject>
      gridTemplateColumns={{
        3: "16px 4fr 2fr",
        2: "16px 4fr",
      }}
      colcount={colcount > 4 ? 3 : 2}
      showHeader={false}
      dataSource={recentlyPlayed}
      columns={columns}
      rowKey={(row) => `${row.id}_${row.context?.uri}_${row.played_at}`}
      total={before ? recentlyPlayed.length + 1 : recentlyPlayed.length}
      next={next}
      onRow={handleOnRow}
      rowSelection={rowSelected}
    />
  </section>;
}