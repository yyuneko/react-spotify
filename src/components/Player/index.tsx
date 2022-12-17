import { useRequest } from "ahooks";
import classnames from "classnames";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

import DevicePicker from "@assets/icons/device-picker.svg";
import Fullscreen from "@assets/icons/fullscreen.svg";
import VolumeMute from "@assets/icons/mute.svg";
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
import Image from "@components/Image";
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
import { TrackObject } from "@service/tracks/types";
import { state } from "@store/index";
import {
  incPosition,
  setMute,
  setPosition,
  setRepeatMode,
  setShuffle,
  setVolume,
} from "@store/player/reducer";
import { dayjs, usePlayContext } from "@utils/index";
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
  const navigate = useNavigate();
  const location = useLocation();
  const position = useSelector<state, number>((state) => state.player.position);
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const volume = useSelector<state, number>((state) => state.player.volume);
  const shuffle = useSelector<state, boolean>((state) => state.player.shuffle);
  const duration = useSelector<state, number>((state) => state.player.duration);
  const repeatMode = useSelector<state, number>((state) => state.player.repeatMode);

  const context = useSelector<state,
    { type?: string; id?: string; uri?: string }>((state) => state.player.context);
  const currentTrack = useSelector<state, TrackObject | undefined>(
    (state) => state.player.trackWindow.currentTrack
  );
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
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
    const timer = setInterval(() => {
      if (!paused) {
        dispatch(incPosition());
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

  const handleTogglePlay = usePlayContext(context.uri ? {
    type: "context",
    uri: context.uri
  } : { type: "track", uri: currentTrack?.uri });

  const handleNext = () =>
    spotify.skipToNext({
      device_id: currentDevice,
    });

  const handleTrackSeek = (offset: number, ready = true) => {
    setPosition(offset * (duration ?? 0));

    if (ready) {
      spotify.player.seek(offset * (duration ?? 0));
    }
  };

  const handleChangeVolume = (offset: number, ready = true) => {
    if (ready) {
      if(!currentDevice){ return; }
      const volume = Math.max(0, Math.min(1, offset));
      setVolumeForUsersPlayback({
        volume_percent: Math.ceil(volume * 100),
        device_id: currentDevice,
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
      state: !shuffle,
      device_id: currentDevice,
    })
      .then(() => {
        dispatch(setShuffle(!shuffle));
      });
  };

  const handleChangeRepeatMode = () => {
    if(!currentDevice){ return; }
    const mode = (repeatMode + 1) % 3 ;
    setRepeatModeOnUsersPlayback({
      state: repeatModes[mode],
      device_id: currentDevice,
    })
      .then(() => {
        dispatch(setRepeatMode(mode));
      });
  };

  const handleSOpenLyrics = () => {
    if (location.pathname === "/lyrics") {
      navigate(-1);
    } else {
      navigate("/lyrics");
    }
  };

  const handleOpenQueue = () => {
    if (location.pathname === "/queue") {
      navigate(-1);
    } else {
      navigate("/queue");
    }
  };

  const handleSwitchMuteMode = () => {
    dispatch(setMute(volume != 0));
  };

  return (
    <div className={styles["player"]}>
      {currentTrack && 
        <div className={styles["playerTrack"]}>
          <Image
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
                  key={artist.id ?? artist.uri}
                  className="text-s"
                  to={`/artist/${
                    artist.id ??
                    artist.uri?.match?.(/spotify:artist:([a-zA-Z0-9]+)/)?.[1]
                  }`}
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
                    device_id: currentDevice,
                  })
                }
              />
            </button>
          </div>
          <button
            onClick={handleTogglePlay}
            className={styles["togglePlay"] + " button"}
            title={formatMessage({ id: "playback-control." + paused ? "pause" : "play" })}
          >
            {paused ? <Paused/> : <Playing/>}
          </button>
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
              {repeatMode === 2 ? <SingleTrackRepeat/> : <Repeat/>}
            </button>
          </div>
        </div>
        <div className={styles["progressBar"]}>
          {dayjs.duration(position).format("mm:ss")}
          <ProgressBar
            max={duration}
            className="flex-1"
            value={position}
            onSeek={handleTrackSeek}
          />
          {dayjs.duration(duration ?? 0).format("mm:ss")}
        </div>
      </div>
      <div className={styles["playerOther"]}>
        <button
          className={classnames({
            button: true,
            checked: location.pathname === "/lyrics",
            "checked-icon": location.pathname === "/lyrics",
          })}
          onClick={handleSOpenLyrics}
        >
          <OpenLyric/>
        </button>
        <button
          className={classnames({
            button: true,
            checked: location.pathname === "/queue",
            "checked-icon": location.pathname === "/queue",
          })}
          onClick={handleOpenQueue}
        >
          <OpenQueue/>
        </button>
        <button className="button">
          <DevicePicker />
        </button>
        <button className="button" onClick={handleSwitchMuteMode}>
          {volume != 0 ? <Volume/> : <VolumeMute/>}
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
