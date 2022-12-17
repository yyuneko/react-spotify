import classnames from "classnames";
import React, { ReactNode, useMemo } from "react";
import { useInView } from "react-intersection-observer";
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
  fallback?: ReactNode;
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
    type,
    extra,
    fallback,
    description,
    contextUri,
    operationExtra,
  } = props;
  const { formatMessage } = useIntl();
  const { ref, entry } = useInView({
    root: document.querySelector("#app__main"),
    threshold: 1
  });
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const context = useSelector<state,
    { type?: string; id?: string; uri?: string; name?: string }>
    ((state) => state.player.context);
  const fontSize = useSelector<state, number>(state => state.ui.fontSize);
  const handlePlayCurrentContext = usePlayContext({ uri: contextUri });

  const titleFontSize = useMemo( () => {
    if (title) {
      const width = (document.getElementById("app__main")
        ?.getBoundingClientRect()?.width ?? 300) - 300;
      console.log(width, fontSize);
      const autoFitFontSize = width / title.length / fontSize;

      if (autoFitFontSize < 2) {
        return 2;
      }

      if (autoFitFontSize > 6) {
        return 6;
      }

      if (autoFitFontSize >= 5) {
        return 6;
      }

      if (autoFitFontSize >= 4) {
        return 4.5;
      }

      if (autoFitFontSize >= 3) {
        return 3;
      }
    }

    return 2;
  },[title]);

  return (
    <Loading loading={initialLoading}>
      <NavBar>
        <div
          className={"flex gap-16 items-center opacity-0 transition-opacity "
            + classnames({
              "duration-300 opacity-100": (entry?.intersectionRatio ?? 1) < 1
            })}>
          <PlayButton
            isPlaying={!paused && context.uri === contextUri}
            size={48}
            onClick={handlePlayCurrentContext}/>
          <h1 className="text-base text-2xl text-overflow-ellipsis">
            {title}
          </h1>
        </div>
      </NavBar>
      <div
        className="pl-16 pr-16 xl:pl-32 xl:pr-32 pb-24 flex w-full items-end box-border"
        style={{ maxHeight: "436px", minHeight: "276px", height: "calc(30vh - 64px)" }}
      >
        <Image
          alt="cover"
          fallback={fallback}
          className={styles["cover"]} src={cover}
          shape={type === "artist" ? "circle" : "square"}/>
        <div className="flex-1">
          {tag &&
            <span className="text-base">{formatMessage({ id: tag })}</span>
          }
          <div
            style={title
              ? { fontSize: `${titleFontSize}rem` }
              : undefined}
            className="text-8xl text-base py-16 font-black">{title}</div>
          {description && <p className="text-m">{description}</p>}
          {extra &&
            <div className="inline-flex items-baseline">
              {extra}
            </div>
          }
        </div>
      </div>
      <div
        ref={ref}
        style={{ height: "104px" }}
        className="flex pl-16 pr-16 xl:pl-32 xl:pr-32 pt-24 pb-24 box-border items-center"
      >
        <PlayButton
          size={56}
          className="mr-32"
          isPlaying={!paused && context.uri === contextUri}
          onClick={handlePlayCurrentContext}
        />
        {operationExtra}
      </div>
      <div>{children}</div>
    </Loading>
  );
}
