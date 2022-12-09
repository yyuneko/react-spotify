import classnames from "_classnames@2.3.2@classnames";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import Clock from "@assets/icons/clock.svg";
import Equalizer from "@assets/icons/equalizer.gif";
import { Follow } from "@components/Follow";
import Image from "@components/Image";
import Join from "@components/Join";
import Link from "@components/Link";
import { ColumnProp } from "@components/Table";
import { AlbumBase } from "@service/albums/types";
import { SimplifiedArtistObject } from "@service/artists/types";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import { dayjs } from "@utils/index";

interface RowType {
  id: string;
  name: string;
  album: AlbumBase;
  artists: SimplifiedArtistObject[];
  is_saved: boolean;
}

type Visible = boolean | ((colcount: number) => boolean);
type Align = "left" | "right";

interface ColumnsProps {
  number?: {
    show?: boolean;
    start?: number;
    visible?: Visible;
    align?: Align;
  };
  track?: {
    show?: boolean;
    simplified?: boolean;
    visible?: Visible;
    align?: Align;
  };
  album?: {
    show?: boolean;
    visible?: Visible;
    align?: Align;
  };
  addAt?: {
    show?: boolean;
    visible?: Visible;
    align?: Align;
  };
  operations?: {
    show?: boolean;
    visible?: Visible;
    align?: Align;
  };
  contextUri?: string;
  image?: {
    show:boolean;
    url?:string
  };
}

export default function useColumns(props?: ColumnsProps) {
  const { contextUri, image = {show: true} } = props ?? {};
  let { number, track, album, operations, addAt } = props ?? {};
  number = {
    show: true,
    start: 1,
    visible: true,
    align: "left",
    ...number ?? {},
  };
  track = {
    show: true,
    simplified: false,
    visible: true,
    align: "left",
    ...track ?? {},
  };
  album = { show: true, visible: true, align: "left", ...album ?? {} };
  addAt = {
    show: false,
    visible: true,
    align: "left",
    ...addAt ?? {},
  };
  operations = {
    show: true,
    visible: true,
    align: "right",
    ...operations ?? {},
  };
  const { formatDate, formatMessage } = useIntl();

  const paused = useSelector<state, boolean>((state) => state.player.paused);

  const currentTrack = useSelector<state, TrackObject | undefined>(
    (state) => state.player.trackWindow.currentTrack
  );
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string }
  >((state) => state.player.context);
  const numberColumn = {
    dataIndex: "number",
    title: "#",
    visible: number.visible,
    align: number.align,
    render: (t: any, r: RowType, index: number) =>
      currentTrack?.id === r.id && !paused ? 
        <Image src={Equalizer} width="14" height="14" />
        : 
        <span className={currentTrack?.id === r.id ? "playing" : ""}>
          {index + (number?.start ?? 1)}
        </span>
    ,
  };
  const trackColumn = {
    dataIndex: "name",
    title: formatMessage({ id: "sort.title" }),
    visible: track.visible,
    align: track.align,
    render: (t: string, r: RowType) => image?.show ?
      <div className="inline-flex w-1-1">
        <Image
          width="40"
          height="40"
          className="mr-16"
          src={r.album?.images?.[0]?.url ?? image.url}
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
      </div> : <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
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
  };
  const simplifiedTrackColumn = {
    dataIndex: "id",
    title: formatMessage({ id: "sort.title" }),
    visible: track.visible,
    align: track.align,
    render: (t: string, r: RowType) => image?.show ?
      <div className="inline-flex w-1-1">
        <Image
          width="40"
          height="40"
          className="mr-16"
          src={r.album?.images?.[0]?.url ?? image.url}
        />
        <div
          className={classnames({
            "text-base": true,
            "text-m": true,
            playing: currentTrack?.id === t && context.uri === contextUri,
          })}
        >
          {r.name}
        </div>
      </div> : <div
        className={classnames({
          "text-base": true,
          "text-m": true,
          playing: currentTrack?.id === t && context.uri === contextUri,
        })}
      >
        {r.name}
      </div>
    ,
  };
  const albumColumn = {
    dataIndex: "album",
    title: formatMessage({ id: "sort.album" }),
    visible: album.visible,
    align: album.align,
    render: (t: AlbumBase) => 
      <div>
        <Link
          to={`/album/${t.id ?? t.uri?.match?.(/spotify:album:([a-zA-Z0-9]+)/)?.[1]}`}
          className="text-s"
        >
          {t.name}
        </Link>
      </div>
    ,
  };
  const addAtColumn = {
    dataIndex: "added_at",
    title: formatMessage({ id: "sort.date-added" }),
    visible: addAt.visible,
    render: (t: string | number) => <div>{formatDate(t)}</div>,
  };
  const operationsColumn = {
    dataIndex: "duration_ms",
    title: <Clock width="16" height="16" className="pr-32" />,
    visible: operations.visible,
    align: operations.align,
    render: (t: number, r: RowType) => 
      <div className="inline-flex" style={{ alignItems: "center" }}>
        <Follow followed={r.is_saved} className="mr-24" />
        <div className="ml-8">{dayjs.duration(t).format("m:ss")}</div>
      </div>
    ,
  };

  return [
    number.show && numberColumn,
    track.show && (track.simplified ? simplifiedTrackColumn : trackColumn),
    album.show && albumColumn,
    addAt.show && addAtColumn,
    operations.show && operationsColumn,
  ].filter((column) => column) as ColumnProp<RowType>[];
}
