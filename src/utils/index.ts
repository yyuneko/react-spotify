import { useRequest } from "ahooks";
import { AxiosResponse } from "axios";
import _dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

import cookie from "@http/cookie";
import { TrackObject } from "@service/tracks/types";
import { getCurrentUsersProfile } from "@service/users";
import { state } from "@store/index";
import { useSpotifyPlayer } from "@utils/player";

_dayjs.extend(duration);

export function useCurrentUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: myInfo, run: getMyInfo } = useRequest(getCurrentUsersProfile, {
    manual: true,
    onSuccess: () => {
      if (location.pathname === "/login") {
        navigate(decodeURIComponent(location.state.from) ?? "/");
      }
    },
  });
  useEffect(() => {
    getMyInfo();
  }, [cookie.get("authorization")]);

  return myInfo;
}

export const processResult = <T>(
  data?: AxiosResponse<T>,
  defaultValue?: any
) => {
  if (data && data.status >= 200 && data.status < 300) {
    return data.data;
  }

  return defaultValue as T;
};

export const format = (str: string, ...datas: any[]) => {
  let finalStr = str;

  for (let i = 0; i < datas?.length; ++i) {
    finalStr = finalStr.replace(`{${i}}`, String(datas?.[0]));
  }

  return finalStr;
};

export const useFormatDuration = (duration: Duration) => {
  const { formatMessage } = useIntl();

  if (duration.days()) {
    return (
      format(formatMessage({ id: "time.over" }), 2) +
      format(formatMessage({ id: "time.hours.long" }), 4)
    );
  }

  let finalStr = "";

  if (duration.hours()) {
    finalStr += format(
      formatMessage({ id: "time.hours.long" }),
      duration.hours()
    );
  }

  finalStr += format(
    formatMessage({ id: "time.minutes.long" }),
    duration.minutes()
  );

  return finalStr;
};

export const getValueWithKeys = (obj: any, keys?: string[] | string) =>
  keys &&
  (Array.isArray(keys)
    ? keys.length &&
      keys.reduce((obj, key) => obj && typeof obj === "object" && obj[key], obj)
    : obj[keys]);

export const dayjs = _dayjs;

export function useLocalStorage() {
  const location = useLocation();

  const get = (key: string) => {
    const value = localStorage.getItem(location.pathname + "/" + key);

    return value && JSON.parse(value);
  };

  const set = (key: string, value: any) => {
    localStorage.setItem(location.pathname + "/" + key, value);
  };

  return { get, set };
}

export function usePlayContext({
  uri,
  type = "context"
}: { uri?: string, type?: "context" | "track" }){
  const spotify = useSpotifyPlayer();
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const position = useSelector<state, number>((state) => state.player.position);
  const context = useSelector<
    state,
    { type?: string; id?: string; uri?: string; name?: string }
  >((state) => state.player.context);
  const currentDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.current
  );
  const currentTrack = useSelector<state, TrackObject | undefined>(
    (state) => state.player.trackWindow.currentTrack
  );
  const localDevice = useSelector<state, string | undefined>(
    (state) => state.player.device.local
  );

  return () => {
    if (!uri) {
      return;
    }

    if (context.uri === uri) {
      if (paused) {
        if (currentDevice != localDevice) {
          spotify.start(
            {device_id: currentDevice},
            currentTrack && ["playlist", "album"].includes(context.type!)
              ? {
                context_uri: uri,
                offset: {uri: currentTrack?.uri},
                position_ms: position,
              }
              : {context_uri: uri}
          );
        } else {
          spotify.player.resume();
        }
      } else {
        spotify.player.pause();
      }
    } else {
      if (type === "track") {
        spotify.start({device_id: currentDevice}, {uris: [uri]});
      } else {
        spotify.start({device_id: currentDevice}, {context_uri: uri});
      }
    }
  };
}