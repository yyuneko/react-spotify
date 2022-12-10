import React, { ReactNode } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import Image from "@components/Image";
import Loading from "@components/Loading";
import NavBar from "@components/NavBar";
import PlayButton from "@components/PlayButton";
import { state } from "@store/index";
import { usePlayContext } from "@utils/index";

import styles from "./index.module.less";

import { CommonProps } from "../../type";

interface ContentContainerProps extends CommonProps {
  initialLoading: boolean;
  type: "playlist" | "album" | "collection" | "artist";
  cover?: string;
  tag?: string;
  title?: string;
  description?: string;
  extra: ReactNode;
  operationExtra?: ReactNode;
  contextUri: string;
}

export default function ContentContainer(props: ContentContainerProps) {
  const {
    initialLoading,
    children,
    cover,
    tag,
    title,
    extra,
    description,
    contextUri,
    operationExtra,
  } = props;
  const { formatMessage } = useIntl();
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string; name?: string }
  >((state) => state.player.context);

  const handlePlayCurrentContext = usePlayContext({uri: contextUri});

  return (
    <Loading loading={initialLoading}>
      <NavBar />
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "flex-end",
          boxSizing: "border-box",
        }}
        className="pl-32 pr-32 pb-24"
      >
        <Image alt="cover" className={styles["cover"]} src={cover} />
        <div style={{ flex: "1" }}>
          {tag && 
            <span className="text-base">{formatMessage({ id: tag })}</span>
          }
          <div className="text-xxl text-base text-bold">{title}</div>
          {description && <p className="text-m">{description}</p>}
          {extra && 
            <div className="inline-flex" style={{ alignItems: "baseline" }}>
              {extra}
            </div>
          }
        </div>
      </div>
      <div
        style={{ height: "104px", boxSizing: "border-box" }}
        className="flex pl-32 pr-32 pt-24 pb-24"
      >
        <PlayButton
          size={56}
          className="mr-32"
          isPlaying={!paused && context.uri === contextUri}
          onClick={ handlePlayCurrentContext}
        />
        {operationExtra}
      </div>
      <div className="pl-32 pr-32">{children}</div>
    </Loading>
  );
}
