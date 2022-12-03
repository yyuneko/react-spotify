import { useRequest } from "ahooks";
import classnames from "classnames";
import React, { useEffect } from "react";

import HeartFill from "@assets/icons/heart-fill.svg";
import Heart from "@assets/icons/heart.svg";
import {
  checkIfUserFollowsPlaylist,
  followPlaylist,
  unfollowPlaylist,
} from "@service/users";
import { useCurrentUser } from "@utils/index";

export function Follow(props: any) {
  const { followed, onClick, size = 16, style, className = "" } = props;

  return (
    <button
      aria-checked={followed}
      onClick={onClick}
      style={style}
      className={
        classnames({
          button: true,
          icon__highlight: followed,
          button__hover: true,
        }) +
        " " +
        className
      }
    >
      {followed ? 
        <HeartFill width={size} height={size} />
        : 
        <Heart width={size} height={size} />
      }
    </button>
  );
}

export function FollowPlaylist(props: any) {
  const { id, className } = props;
  const user = useCurrentUser();
  const { data: isFollowingPlaylist, run: checkIsFollowingPlaylist } =
    useRequest(checkIfUserFollowsPlaylist, {
      manual: true,
    });
  const { run: runFollowPlaylist } = useRequest(followPlaylist, {
    manual: true,
    onSuccess: () => {
      id && user && checkIsFollowingPlaylist(id, { ids: user.id });
    },
  });
  const { run: runUnfollowPlaylist } = useRequest(unfollowPlaylist, {
    manual: true,
    onSuccess: () => {
      id && user && checkIsFollowingPlaylist(id, { ids: user.id });
    },
  });
  useEffect(() => {
    if (id && user) {
      checkIsFollowingPlaylist(id, { ids: user.id });
    }
  }, [id, user]);

  const onChange = () => {
    if (id && user) {
      if (isFollowingPlaylist?.[0]) {
        runUnfollowPlaylist(id);
      } else {
        runFollowPlaylist(id);
      }
    }
  };

  return (
    <Follow
      size={32}
      followed={isFollowingPlaylist?.[0]}
      onClick={onChange}
      className={className}
    />
  );
}
