import { useRequest } from "ahooks";
import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import DevicePicker from "@assets/icons/device-picker.svg";
import Fullscreen from "@assets/icons/fullscreen.svg";
import NextTrack from "@assets/icons/next-track.svg";
import OpenLyric from "@assets/icons/open-lyric.svg";
import OpenQueue from "@assets/icons/open-queue.svg";
import Paused from "@assets/icons/paused.svg";
import Playing from "@assets/icons/playing.svg";
import PreviousTrack from "@assets/icons/previous-track.svg";
import Repeat from "@assets/icons/repeat.svg";
import Shuffle from "@assets/icons/shuffle.svg";
import SingleTrackRepeat from "@assets/icons/single-track-repeat.svg";
import Volume from "@assets/icons/volume.svg";
import { Follow } from "@components/Follow";
import Join from "@components/Join";
import Link from "@components/Link";
import ProgressBar from "@components/ProgressBar";
import {
  setRepeatModeOnUsersPlayback,
  setVolumeForUsersPlayback,
  toggleShuffleForUsersPlayback,
} from "@service/player";
import {
  checkUsersSavedTracks,
  removeTracksUser,
  saveTracksUser,
} from "@service/tracks";
import { state } from "@store/index";
import {
  PlayerState,
  setRepeatMode,
  setShuffle,
  setVolume,
} from "@store/player/reducer";
import { dayjs } from "@utils/index";
import { useSpotifyPlayer } from "@utils/player";

import styles from "./index.module.less";

const repeatModes: ("off" | "context" | "track")[] = [
  "off",
  "context",
  "track",
];

export default function Player() {
  const dispatch = useDispatch();
  const spotify = useSpotifyPlayer();
  const { formatMessage } = useIntl();
  const [curPosition, setCurPosition] = useState(0);

  const {
    paused,
    volume,
    context,
    shuffle,
    duration,
    position,
    repeatMode,
    trackWindow: { currentTrack },
    device: {current: currentDevice},
  } = useSelector<state, PlayerState>((state) => state.player);

  const { data: isSavingTrack, run: checkIsSavingTrack } = useRequest(
    checkUsersSavedTracks,
    { manual: true }
  );

  const { run: runSaveTrack } = useRequest(saveTracksUser, {
    manual: true,
    onSuccess: () => {
      currentTrack?.id && checkIsSavingTrack({ ids: currentTrack.id });
    },
  });

  const { run: runRemoveTrack } = useRequest(removeTracksUser, {
    manual: true,
    onSuccess: () => {
      currentTrack?.id && checkIsSavingTrack({ ids: currentTrack.id });
    },
  });

  useEffect(() => {
    console.log({
      currentTrack,
      volume,
      paused,
      position,
      shuffle,
      repeatMode,
      context,
    });
    setCurPosition(position);
  }, [position]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused) {
        setCurPosition((pos) => pos + 1000);
      }
    }, 1000);

    return function () {
      clearInterval(timer);
    };
  }, [paused]);

  useEffect(() => {
    currentTrack?.id && checkIsSavingTrack({ ids: currentTrack.id });
  }, [currentTrack?.id]);

  const toggleSaveTrack = () => {
    if (currentTrack?.id) {
      if (isSavingTrack?.[0]) {
        runRemoveTrack({ ids: currentTrack.id });
      } else {
        runSaveTrack({ ids: currentTrack.id });
      }
    }
  };

  const handleResume = () => {
    currentTrack &&
      spotify.start(
        {
          device_id: spotify.deviceId,
        },
        context.uri
          ? {
            context_uri: context.uri,
            offset: {
              uri: currentTrack.uri,
            },
            position_ms: curPosition,
          }
          : {
            uris: [currentTrack.uri],
            position_ms: curPosition,
          }
      );
  };

  const handlePause = () =>
    // spotify.pause({ device_id: spotify.deviceId })
    spotify.player.pause();

  const handleNext = () =>
    spotify.skipToNext({
      device_id: spotify.deviceId,
    });

  const handleTrackSeek = (offset: number, ready = true) => {
    setCurPosition(() => offset * (duration ?? 0));

    if (ready) {
      spotify.player.seek(offset * (duration ?? 0));
    }
  };

  const handleChangeVolume = (offset: number, ready = true) => {
    if (ready) {
      if(!currentDevice){ return; }
      const volume = Math.max(0, Math.min(1, offset));
      setVolumeForUsersPlayback({
        volume_percent: Math.ceil(volume * 100),device_id: currentDevice
      })
        .then(() => {
          dispatch(setVolume(offset));
        });
    }else{
      spotify.player.setVolume(offset).then(() => dispatch(setVolume(offset)));
    }
  };

  const handleSwitchShuffle = () => {
    if(!currentDevice){ return; }
    toggleShuffleForUsersPlayback({
      state: !shuffle,device_id: currentDevice
    })
      .then(() => {
        dispatch(setShuffle(!shuffle));
      });
  };

  const handleChangeRepeatMode = () => {
    if(!currentDevice){ return; }
    const mode = (repeatMode + 1) % 3 ;
    setRepeatModeOnUsersPlayback({
      state: repeatModes[mode],device_id: currentDevice
    }).then(() => {
      dispatch(setRepeatMode(mode));
    });
  };

  return (
    <div className={styles["player"]}>
      {currentTrack && 
        <div className={styles["playerTrack"]}>
          <img
            src={currentTrack.album.images[0].url}
            width="56"
            height="56"
            alt="cover"
          />
          <div className="ml-14 mr-14">
            <div>
              <Link
                className="text-base text-m"
                to={`/track/${currentTrack.id}`}
              >
                {currentTrack.name}
              </Link>
            </div>
            <Join>
              {currentTrack.artists.map((artist) => 
                <Link
                  key={artist.id}
                  className="text-s"
                  to={`/artist/${artist.id}`}
                >
                  {artist.name}
                </Link>
              )}
            </Join>
          </div>
          <Follow
            onClick={toggleSaveTrack}
            followed={isSavingTrack?.[0]}
            style={{ width: "var(--button-size)" }}
          />
        </div>
      }
      <div
        className={styles["playerController"]}
        style={currentTrack ? undefined : { pointerEvents: "none" }}
      >
        <div className={styles["playerController__buttons"]}>
          <div className={styles["playerController__buttonsLeft"]}>
            <button
              onClick={handleSwitchShuffle}
              className={classnames({
                button: true,
                button__hover: true,
                checked: shuffle,
                "checked-icon": shuffle,
              })}
              title={formatMessage({
                id: `playback-control.${
                  shuffle ? "disable" : "enable"
                }-shuffle`,
              })}
            >
              <Shuffle />
            </button>
            <button
              className="button button__hover"
              title={formatMessage({ id: "playback-control.skip-back" })}
            >
              <PreviousTrack
                onClick={() =>
                  spotify.skipToPrevious({
                    device_id: spotify.deviceId,
                  })
                }
              />
            </button>
          </div>
          {paused && 
            <button
              onClick={handleResume}
              className={styles["togglePlay"] + " button"}
              title={formatMessage({ id: "playback-control.play" })}
            >
              <Paused />
            </button>
          }
          {!paused && 
            <button
              onClick={handlePause}
              className={styles["togglePlay"] + " button"}
              title={formatMessage({ id: "playback-control.pause" })}
            >
              <Playing />
            </button>
          }
          <div className={styles["playerController__buttonsRight"]}>
            <button
              onClick={handleNext}
              className="button button__hover"
              title={formatMessage({ id: "playback-control.skip-forward" })}
            >
              <NextTrack />
            </button>
            <button
              onClick={handleChangeRepeatMode}
              className={classnames({
                button: true,
                button__hover: true,
                checked: repeatMode != 0,
                "checked-icon": repeatMode != 0,
              })}
              title={formatMessage({
                id:
                  repeatMode === 0
                    ? "playback-control.enable-repeat"
                    : repeatMode === 1
                      ? "playback-control.enable-repeat-one"
                      : "playback-control.disable-repeat",
              })}
            >
              {repeatMode === 2 ? <SingleTrackRepeat /> : <Repeat />}
            </button>
          </div>
        </div>
        <div className={styles["progressBar"]}>
          {dayjs.duration(curPosition).format("mm:ss")}
          <ProgressBar
            max={duration}
            className="flex-1"
            value={curPosition}
            onSeek={handleTrackSeek}
          />
          {dayjs.duration(duration ?? 0).format("mm:ss")}
        </div>
      </div>
      <div className={styles["playerOther"]}>
        <button className="button">
          <OpenLyric />
        </button>
        <button className="button">
          <OpenQueue />
        </button>
        <button className="button">
          <DevicePicker />
        </button>
        <button className="button">
          <Volume />
        </button>

        <ProgressBar
          value={volume}
          style={{ width: "92px" }}
          onSeek={handleChangeVolume}
        />

        <button className="button">
          <Fullscreen />
        </button>
      </div>
    </div>
  );
}
