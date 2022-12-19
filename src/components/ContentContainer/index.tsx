import classnames from "classnames";
import Vibrant from "node-vibrant";
import { Palette } from "node-vibrant/lib/color";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
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
    className = ""
  } = props;
  const { formatMessage } = useIntl();
  const { ref, entry } = useInView({
    root: document.querySelector("#app__main"),
    threshold: 1
  });
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const context = useSelector<state,
    { type?: string; id?: string; uri?: string; name?: string }>
    ((state) => state.player.context);
  const fontSize = useSelector<state, number>(state => state.ui.fontSize);
  const handlePlayCurrentContext = usePlayContext({ uri: contextUri });
  const [dominatedColor, setDominatedColor] = useState("var(--bg-base)");

  const titleFontSize = useMemo(() => {
    if (title) {
      const width = (document.getElementById("app__main")
        ?.getBoundingClientRect()?.width ?? 300) - 300;
      const length = title.split("")
        .reduce((sum, cur) =>
          (cur.charCodeAt(0) <= 255 ? 0.5 : 1) + sum, 0) * fontSize;

      if (6 * length <= width) {
        return 6;
      }

      if (4.5 * length <= width) {
        return 4.5;
      }

      if (3.5 * length <= width) {
        return 3.5;
      }

      if (3 * length <= width) {
        return 3;
      }

      return 2;
    }

  }, [title, colcount]);
  useEffect(() => {
    if (cover) {
      const img = Vibrant.from(cover);
      img.getPalette()
        .then((colors:Palette) => {
          const all = Object.keys(colors)
            .reduce((sum,cur) => sum + colors[cur]!.population,0);

          if (colors.Vibrant && colors.Vibrant.population > all / 6) {
            setDominatedColor(`rgb(${colors.Vibrant.rgb.join(",")})`);

            return;
          }

          const items = Object.keys(colors)
            .filter(key => colors[key]!.population > all / 6)
            .sort((a,b) => colors[b]!.population - colors[a]!.population);
          items[0] && setDominatedColor(`rgb(${colors[items[0]]!.rgb.join(",")})`);
        });
    }
  }, [cover]);

  return (
    <Loading loading={initialLoading}>
      <div className="relative">
        <div
          style={{ backgroundColor: dominatedColor }}
          className="w-full h-full absolute top-0 left-0"/>
        <div className={"w-full h-full absolute top-0 left-0 " + styles["bg"]}/>
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
          className="px-16 xl:px-32 pb-24 flex w-full items-end box-border"
          style={{ maxHeight: "436px", minHeight: "276px", height: "calc(30vh - 64px)" }}
        >
          <Image
            alt="cover"
            fallback={fallback}
            className={styles["cover"] + " z-0"} src={cover}
            shape={type === "artist" ? "circle" : "square"}/>
          <div className="flex-1 z-0">
            {tag &&
              <span className="text-base">{formatMessage({ id: tag })}</span>
            }
            <div
              style={title
                ? { fontSize: `${titleFontSize}rem` }
                : undefined}
              className="text-8xl text-base py-16 font-black break-all">{title}</div>
            {description && <p className="text-m">{description}</p>}
            {extra &&
              <div className="inline-flex items-baseline">
                {extra}
              </div>
            }
          </div>
        </div>
      </div>
      <div
        ref={ref}
        style={{ height: "104px" }}
        className="flex px-16 xl:px-32 pt-24 pb-24 box-border items-center"
      >
        <PlayButton
          size={56}
          className="mr-32"
          isPlaying={!paused && context.uri === contextUri}
          onClick={handlePlayCurrentContext}
        />
        {operationExtra}
      </div>
      <div className={className}>{children}</div>
    </Loading>
  );
}
