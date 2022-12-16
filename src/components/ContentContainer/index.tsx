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
  const context = useSelector<state,
    { type?: string; id?: string; uri?: string; name?: string }>
    ((state) => state.player.context);
  const fontSize = useSelector<state, number>(state => state.ui.fontSize);
  const handlePlayCurrentContext = usePlayContext({ uri: contextUri });

  const getTitleFontSize = () => {
    if (title) {
      const width = (document.getElementById("app__main")
        ?.getBoundingClientRect()?.width ?? 300) - 250;
      console.log(width);

      return Math.min(6, Math.max(2, Math.floor(width / title.length / fontSize)));
    }

    return 2;
  };

  return (
    <Loading loading={initialLoading}>
      <NavBar/>
      <div className="pl-32 pr-32 pb-24 flex w-full items-end box-border"
      >
        <Image alt="cover" className={styles["cover"]} src={cover}/>
        <div className="flex-1">
          {tag &&
            <span className="text-base">{formatMessage({ id: tag })}</span>
          }
          <div
            style={title
              ? { fontSize: `${getTitleFontSize()}rem` }
              : undefined}
            className="text-8xl text-base font-bold py-16">{title}</div>
          {description && <p className="text-m">{description}</p>}
          {extra &&
            <div className="inline-flex items-baseline">
              {extra}
            </div>
          }
        </div>
      </div>
      <div
        style={{ height: "104px" }}
        className="flex pl-32 pr-32 pt-24 pb-24 box-border"
      >
        <PlayButton
          size={56}
          className="mr-32"
          isPlaying={!paused && context.uri === contextUri}
          onClick={handlePlayCurrentContext}
        />
        {operationExtra}
      </div>
      <div className="pl-32 pr-32">{children}</div>
    </Loading>
  );
}
