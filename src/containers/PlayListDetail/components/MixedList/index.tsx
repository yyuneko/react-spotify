import React from "react";
import {useIntl} from "react-intl";
import {useSelector} from "react-redux";

import EnterIcon from "@assets/icons/router-forward.svg";
import {SearchResultProps} from "@components/Card";
import Image from "@components/Image";
import Join from "@components/Join";
import Link from "@components/Link";
import Table, {ColumnProp} from "@components/Table";
import {History} from "@containers/PlayListDetail/components/Search";
import {state} from "@store/index";
import {useSpotifyPlayer} from "@utils/player";

interface Props {
  id: string;
  total: number;
  next: () => void;
  items: SearchResultProps[];
  runAddTracksToPlaylist: (
    playlist_id: string,
    params: {
      position?: number;
      uris?: string;
    }
  ) => void;
  handlePushNewMode?: (mode: History) => void;
}

export default function MixedList(props: Props) {
  const { id, runAddTracksToPlaylist, items, total, next, handlePushNewMode } =
    props;
  const { formatMessage } = useIntl();
  const spotify = useSpotifyPlayer();
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const columns: ColumnProp<SearchResultProps>[] = [
    {
      dataIndex: "type",
      visible: true,
      render: (t, r) => {
        switch (r.type) {
        case "track":
          return (
            <div className="inline-flex w-1-1">
              <Image
                width="40"
                height="40"
                className="mr-16"
                src={r.value.album?.images[0]?.url}
              />
              <div className="flex flex-col"
                style={{
                  minWidth: 0,
                  maxWidth: "calc(100% - 40px)",
                }}
              >
                <span className="text-base text-m text-overflow-ellipsis">
                  {r.value.name}
                </span>
                <Join>
                  {r.value.artists.map((artist) => 
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
          );
        case "album":
          return (
            <div className="inline-flex w-1-1">
              <Image
                width="40"
                height="40"
                className="mr-16"
                src={r.value.images[0]?.url}
              />
              <div className="flex flex-col"
                style={{
                  minWidth: 0,
                  maxWidth: "calc(100% - 40px)",
                }}
              >
                <span className="text-base text-m text-overflow-ellipsis">
                  {r.value.name}
                </span>
                <span className="text-plain">
                  {formatMessage({ id: "card.tag." + r.value.type })}
                </span>
              </div>
            </div>
          );
        case "artist":
          return (
            <div className="inline-flex w-1-1">
              <Image
                shape="circle"
                width="40"
                height="40"
                className="mr-16"
                src={r.value.images[0]?.url}
              />
              <div className="flex flex-col"
                style={{
                  minWidth: 0,
                  maxWidth: "calc(100% - 40px)",
                }}
              >
                <span className="text-base text-m text-overflow-ellipsis">
                  {r.value.name}
                </span>
                <span>{formatMessage({ id: "card.tag.artist" })}</span>
              </div>
            </div>
          );
        default:
          return <div />;
        }
      },
    },
    {
      dataIndex: "type",
      visible: true,
      render: (t, r) => {
        if (r.type === "track") {
          return (
            <Link
              to={`/album/${r.value.album.id}`}
              className="text-overflow-ellipsis"
            >
              {r.value.album.name}
            </Link>
          );
        }

        return <div />;
      },
    },
    {
      dataIndex: "type",
      visible: true,
      align: "right",
      render: (t, r) => {
        switch (r.type) {
        case "track":
          return (
            <button
              onClick={() => handleAddTracksToCurrentPlaylist([r.value.uri])}
            >
              {formatMessage({
                id: "playlist.extender.button.add",
              })}
            </button>
          );
        case "album":
          return <EnterIcon width="24" height="24" />;
        case "artist":
          return <EnterIcon width="24" height="24" />;
        default:
          return <div />;
        }
      },
    },
  ];

  const handleAddTracksToCurrentPlaylist = (uris: string[]) => {
    id && runAddTracksToPlaylist(id, { uris: uris.join(",") });
  };

  const handleOnRow = (row: SearchResultProps) => ({
    onClick: () => {
      switch (row.type) {
      case "album":
        handlePushNewMode?.({
          mode: "view",
          type: "album",
          id: row.value.id,
          tracks: [],
          detail: row.value
        });
        break;
      case "artist":
        handlePushNewMode?.({
          mode: "view",
          type: "artist",
          id: row.value.id,
          albums: [],
          detail: {name: row.value.name}
        });
        break;
      }
    },
    onDoubleClick: () => {
      if (row.type === "track") {
        spotify.start({ device_id: currentDevice }, { uris: [row.value.uri] });
      }
    },
  });

  return (
    <Table<SearchResultProps>
      showHeader={false}
      dataSource={items}
      colcount={3}
      columns={columns}
      rowKey={(row) => `${row.type}_${row.value.id}`}
      total={total}
      next={next}
      gridTemplateColumns={{ 3: "4fr 2fr minmax(120px, 1fr)" }}
      onRow={handleOnRow}
    />
  );
}
