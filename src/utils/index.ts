import cookie from "@http/cookie";
import { AxiosResponse } from "axios";
import _dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useRequest } from "ahooks";
import { getCurrentUsersProfile } from "@service/users";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";

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
  }, [cookie.get("Authorization")]);
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
export const formatDuration = (duration: Duration) => {
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

export const dayjs = _dayjs;
