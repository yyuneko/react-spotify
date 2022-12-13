import { useDebounce, useRequest } from "ahooks";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Player from "@components/Player";
import SideBar from "@components/SideBar";
import "./index.less";
import { getRecentlyPlayed } from "@service/player";
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import { setCurrentContext, setCurrentTrack } from "@store/player/reducer";
import { setColcount, setTitle } from "@store/ui/reducer";
import { useCurrentUser } from "@utils/index";
import { SpotifyPlayerProvider } from "@utils/player";

function MainLayout() {
  const dispatch = useDispatch();
  const user = useCurrentUser();
  const title = useSelector<state, string>((state) => state.ui.documentTitle);
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const currentTrack = useSelector<state, TrackObject | undefined>(
    (state) => state.player.trackWindow.currentTrack
  );
  const [colcount, setColCount] = useState(
    Math.max(Math.floor((window.innerWidth - 240) / 210), 2)
  );
  const colcountDebounce = useDebounce(colcount, { wait: 500 });
  const colWidth = useSelector<state, number>((state) => state.ui.colWidth);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onWindowResize = useCallback((e) => {
    setColCount(Math.max(Math.floor((e.target.innerWidth - 240) / 210), 2));
  }, []);
  const { run: runGetRecentlyPlayed } = useRequest(getRecentlyPlayed, {
    manual: true,
    onSuccess: (res) => {
      dispatch(setCurrentTrack(res.items[0].track));

      if (res.items[0].context) {
        dispatch(
          setCurrentContext({
            type: res.items[0].context.type,
            id: res.items[0].context.uri.match(
              new RegExp(`spotify:${res.items[0].context.type}:([a-zA-Z0-9]+)`)
            )?.[1],
            uri: res.items[0].context.uri,
          })
        );
      }
    },
  });
  useEffect(() => {
    if (user) {
      runGetRecentlyPlayed({ limit: 1 });
    }
  }, [user]);
  useEffect(() => {
    window.addEventListener("resize", onWindowResize);

    return function () {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);
  useEffect(() => {
    dispatch(setColcount(colcountDebounce));
  }, [colcountDebounce]);
  useEffect(() => {
    document.title = title;
  }, [title]);
  useEffect(() => {
    if (!paused && currentTrack) {
      dispatch(
        setTitle(
          `${currentTrack.name} • ${currentTrack.artists
            .map((artist) => artist.name)
            .join(",")}`
        )
      );
    }
  }, [paused, currentTrack]);

  return (
    <div
      id="app"
      data-theme={"dark"}
      style={
        {
          "--col-count": colcountDebounce,
          "--col-width": colWidth + "px",
        } as React.CSSProperties
      }
    >
      <div id="app__sidebar">
        <SideBar />
      </div>
      <div id="app__main" className="scrollbar">
        <Outlet />
      </div>
      <div id="app__controller-bar">
        <Player />
      </div>
    </div>
  );
}

export default () => 
  <SpotifyPlayerProvider>
    <MainLayout />
  </SpotifyPlayerProvider>
;
