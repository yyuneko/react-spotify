import classnames from "classnames";
import React, { ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Image from "@components/Image";
import Join from "@components/Join";
import Link from "@components/Link";
import PlayButton from "@components/PlayButton";
import { SimplifiedAlbumObject } from "@service/albums/types";
import { ArtistObject } from "@service/artists/types";
import { PlaylistObject } from "@service/playlists/types";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import { usePlayContext } from "@utils/index";

import styles from "./index.module.less";

import { CommonProps } from "../../type";

interface CardProps extends CommonProps {
  direction?: "lr" | "tb";
  media?: ReactNode;
  mediaShape?: "circle" | "square";
  title?: ReactNode;
  description?: ReactNode;
  onClick?: () => void;
  contextUri: string;
}

export function Card(props: CardProps) {
  const {
    direction = "tb",
    media,
    mediaShape = "square",
    title,
    description,
    onClick,
    contextUri,
  } = props;
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  useSelector<state, TrackObject | undefined>(
    (state) => state.player.trackWindow.currentTrack
  );
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string }
  >((state) => state.player.context);

  const handlePlayCurrentPlaylist = usePlayContext({ uri: contextUri });

  return (
    <div
      className={
        styles[`card${direction.toUpperCase()}`] + " " + styles["card"]
      }
      role="gridcell"
      onClick={onClick}
    >
      <div className={styles["card__media"]}>
        {
          <div
            className={classnames({
              flex: true,
              "flex-center": true,
              [styles["card__mediaContainer"]]: true,
              [styles["card__mediaCircle"]]: mediaShape === "circle",
            })}
          >
            {media}
          </div>
        }
        {direction === "tb" && 
          <div
            className={classnames({
              [styles["card__playButton"]]: true,
              [styles["visible"]]: !paused && context.uri === contextUri,
            })}
          >
            <PlayButton
              size={48}
              isPlaying={!paused && context.uri === contextUri}
              onClick={(e) => {
                handlePlayCurrentPlaylist();
                e.stopPropagation();
              }}
            />
          </div>
        }
      </div>
      <div className={styles["card__description"]}>
        {title && <div className="text-base pb-4">{title}</div>}
        {direction === "tb" && <div className="text-plain">{description}</div>}
      </div>
      {direction === "lr" && 
        <div
          className={classnames({
            [styles["card__playButton"]]: true,
            [styles["visible"]]: !paused && context.uri === contextUri,
          })}
        >
          <PlayButton
            size={48}
            isPlaying={!paused && context.uri === contextUri}
            onClick={(e) => {
              handlePlayCurrentPlaylist();
              e.stopPropagation();
            }}
          />
        </div>
      }
    </div>
  );
}

interface PlaylistCardProps {
  id: string;
  media: string;
  name: string;
  owner: string;
}

export function PlaylistCard(props: PlaylistCardProps) {
  const { id, media, name, owner } = props;
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  return (
    <Card
      media={<Image src={media} className="w-1-1" />}
      contextUri={`spotify:playlist:${id}`}
      title={<Link to={`/playlist/${id}`}>{name}</Link>}
      description={
        <div>
          {`${formatMessage({ id: "collection.sort.creator" })} : ${owner}`}
        </div>
      }
      onClick={() => navigate(`/playlist/${id}`)}
    />
  );
}

interface AlbumCardProps extends CommonProps {
  id: string;
  media: string;
  name: string;
  yearOrArtists: ReactNode;
}

export function AlbumCard(props: AlbumCardProps) {
  const { id, media, name, yearOrArtists } = props;
  const navigate = useNavigate();

  return (
    <Card
      media={<Image src={media} className="w-1-1" />}
      contextUri={`spotify:album:${id}`}
      title={<Link to={`/album/${id}`}>{name}</Link>}
      description={yearOrArtists}
      onClick={() => navigate(`/album/${id}`)}
    />
  );
}

interface ArtistCardProps extends CommonProps {
  id: string;
  media: string;
  name: string;
  type: string;
  fallback?: ReactNode;
}

export function ArtistCard(props: Partial<ArtistCardProps>) {
  const { id, media, name, type, fallback } = props;
  const navigate = useNavigate();

  return (
    <Card
      mediaShape="circle"
      media={media ? <Image src={media} className="w-1-1" /> : fallback}
      contextUri={`spotify:artist:${id}`}
      title={<div>{name}</div>}
      description={<div>{type}</div>}
      onClick={() => navigate(`/artist/${id}`)}
    />
  );
}

export type SearchResultProps =
  | {
      type: "album";
      value: SimplifiedAlbumObject;
    }
  | {
      type: "track";
      value: TrackObject;
    }
  | {
      type: "artist";
      value: ArtistObject;
    }
  | {
      type: "playlist";
      value: PlaylistObject;
    };

export function PopularSearchResultCard(props: SearchResultProps) {
  const { type, value } = props;
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string }
  >((state) => state.player.context);

  const image = useMemo(() => {
    switch (type) {
    case "album":
      return value.images[0]?.url;
    case "track":
      return value.album.images[0].url;
    case "artist":
      return value.images[0]?.url;
    case "playlist":
      return value.images[0]?.url;
    }
  }, [type, value]);

  const handlePlayCurrentContext = usePlayContext({
    uri: value.uri,
    type: type === "track" ? "track" : "context",
  });

  return (
    <div
      className={styles["card"] + " p-20 flex-col relative"}
      style={{ gap: "20px" }}
      onClick={() => navigate(`/${type}/${value.id}`)}
    >
      <div
        className={styles["card__media"]}
        style={{ width: "92px", height: "92px" }}
      >
        <div
          className={classnames({
            [styles["card__mediaContainer"]]: true,
            [styles["card__mediaCircle"]]: type === "artist",
          })}
        >
          <Image src={image} />
        </div>
      </div>
      <div>
        <div className="text-base text-bold" style={{ fontSize: "2rem" }}>
          {value.name}
        </div>
        <div
          className="inline-flex items-center"
          style={{ fontSize: "0.75rem", gap: "24px" }}
        >
          {(type === "track" || type === "album") && 
            <Join type="comma">
              {value.artists.map((artist) => 
                <Link key={artist.id} to={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>
              )}
            </Join>
          }
          {type === "playlist" && 
            <Link to={`/user/${value.owner.id}`}>
              {value.owner.display_name}
            </Link>
          }
          <span className="text-base">
            {formatMessage({ id: `card.tag.${type}` })}
          </span>
        </div>
      </div>
      <div
        className={classnames({
          [styles["card__playButton"]]: true,
          [styles["visible"]]: !paused && context.uri === value.uri,
        })}
        style={{ right: "16px", bottom: "16px" }}
      >
        <PlayButton
          size={48}
          isPlaying={!paused && context.uri === value.uri}
          onClick={(e) => {
            handlePlayCurrentContext();
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
}
