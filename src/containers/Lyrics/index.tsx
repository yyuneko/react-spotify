import { useRequest } from "ahooks";
import classnames from "classnames";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { getLyrics } from "@service/tracks";
import { PlayerState, setPosition } from "@store/player/reducer";
import { useSpotifyPlayer } from "@utils/player";

import styles from "./index.module.less";

import { state } from "../../store";

function isBetween(curPosition: number, start: number, end: number) {
  return curPosition >= start && curPosition <= end;
}

export default function Lyrics() {
  const position = useSelector<state,number>(state => state.player.position);
  const spotify = useSpotifyPlayer();
  const lineRef = useRef([]);
  const {
    duration,
    trackWindow: { currentTrack },
  } = useSelector<state, PlayerState>((state) => state.player);
  const { data: lyrics, run: runGetLyrics } = useRequest(getLyrics, {
    manual: true,
    onSuccess: res => {
      lineRef.current.length = res.lines.length;
    }
  });
  useEffect(() => {
    if (currentTrack?.id) {
      runGetLyrics(currentTrack.id);
    }
  }, [currentTrack?.id]);

  const handleTrackSeek = (offset: string|undefined, ready = true) => {
    if(typeof offset != "string")
    {
      return;
    }

    setPosition(+offset);

    if (ready) {
      spotify.player.seek(+offset);
    }
  };

  return (
    <div>
      {lyrics?.lines?.map?.((line, index) => 
        <p
          key={line.startTimeMs}
          className={classnames({
            [styles["lyrics__current"]]: isBetween(
              position,
              +line.startTimeMs,
              +lyrics.lines[index + 1]?.startTimeMs ?? duration
            ),
          })}
          onClick={() => handleTrackSeek(line.startTimeMs)}
        >
          {line.words}
        </p>
      )}
    </div>
  );
}
