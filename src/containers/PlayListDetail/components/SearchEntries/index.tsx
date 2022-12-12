import React from "react";
import {useIntl} from "react-intl";

import EnterIcon from "@assets/icons/router-forward.svg";
import Table from "@components/Table";
import {History} from "@containers/PlayListDetail/components/Search";

export const getSearchTypeEntryTitle = (type: "artist" | "album" | "track") =>
  "playlist.curation.see_all_" + 
    (type === "artist" ? "artists" : type === "album" ? "album" : "songs");

export default function SearchEntries(props: {
  handlePushNewMode: (mode: History) => void;
}) {
  const {handlePushNewMode} = props;
  const {formatMessage} = useIntl();

  return <Table<"artist" | "album" | "track">
    showHeader={false}
    dataSource={["artist", "album", "track"]}
    colcount={2}
    columns={[
      {
        dataIndex: "",
        visible: true,
        render: (_, type) =>
          <span>{formatMessage({id: getSearchTypeEntryTitle(type)})}</span>
      },
      {
        dataIndex: "",
        visible: true,
        align: "right",
        render: () => <EnterIcon width="24" height="24"/>
      }]}
    rowKey={row => row} total={3} next={() => false}
    gridTemplateColumns="6fr minmax(120px, 1fr)"
    onRow={row => ({
      onClick: () => handlePushNewMode({
        mode: "search",
        type: row as "artist" | "album" | "track",
        items: []
      })
    })}
  />;
}