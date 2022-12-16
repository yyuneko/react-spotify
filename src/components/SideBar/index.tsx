import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link, useNavigate } from "react-router-dom";

import Add from "@assets/icons/add.svg";
import CollectionFill from "@assets/icons/collection-fill.svg";
import Collection from "@assets/icons/collection.svg";
import Favorite from "@assets/icons/favorite.svg";
import HomeFill from "@assets/icons/home-fill.svg";
import Home from "@assets/icons/home.svg";
import Logo from "@assets/icons/logo.svg";
import PlayingGreenIcon from "@assets/icons/playing-green.svg";
import SearchFill from "@assets/icons/search-fill.svg";
import Search from "@assets/icons/search.svg";
import NavLink from "@components/NavLink";
import { createPlaylist, getAListOfCurrentUsersPlaylists, } from "@service/playlists";
import { SimplifiedPlaylistObject } from "@service/playlists/types";
import { state } from "@store/index";
import { format, useCurrentUser } from "@utils/index";

function SideBar({ className }: { className?: string }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useCurrentUser();
  const [playlists, setPlaylists] = useState<SimplifiedPlaylistObject[]>([]);
  const { data, run, loading } = useRequest(getAListOfCurrentUsersPlaylists, {
    manual: true,
    onSuccess: (res) => {
      setPlaylists(playlists.concat(res.items));
    },
  });
  const context = useSelector<state,
    { type?: string; id?: string; uri?: string }>((state) => state.player.context);

  useEffect(() => {
    user && run({ limit: 20 });
  }, [user]);

  const handleCreateNewPlaylist = () => {
    if (!user) {
      return;
    }

    const playlistCountCreatedByCurrentUser =
      data?.items?.filter?.((playlist) => playlist.owner.id === user.id)
        ?.length ?? 0;
    createPlaylist(user.id, {
      name: format(
        formatMessage({ id: "playlist.new-default-name" }),
        playlistCountCreatedByCurrentUser + 1
      ),
    })
      .then((res) => {
        setPlaylists([]);
        run();
        navigate(`/playlist/${res.id}`);
      });
  };

  const handleGetPlaylists = () => {
    if (loading) {
      return;
    }

    user && run({ limit: 20, offset: playlists.length });
  };

  return (
    <div
      className={(className ?? "") +
        " flex pl-24 pr-24 flex-col items-stretch flex-1 h-full"}
      style={{
        backgroundColor: "var(--sidebar-base)",
      }}
    >
      <div className="text-base pt-24 pb-18">
        <Link to="/">
          <Logo width="131" height="40"/>
        </Link>
      </div>
      <ul className="list-none border-0 m-0 p-0">
        <li>
          <NavLink
            to="/"
            prefix={[<Home/>, <HomeFill/>]}
            isMatched={location.pathname === "/"}
          >
            {formatMessage({ id: "view.web-player-home" })}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search"
            prefix={[<Search/>, <SearchFill/>]}
            isMatched={location.pathname.startsWith("/search")}
          >
            {formatMessage({ id: "navbar.search" })}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/collection/playlists"
            prefix={[<Collection/>, <CollectionFill/>]}
            isMatched={
              location.pathname != "/collection/tracks" &&
              location.pathname.startsWith("/collection")
            }
          >
            {formatMessage({ id: "navbar.your-library" })}
          </NavLink>
        </li>
      </ul>
      <div className="mt-24 flex flex-col flex-1 overflow-hidden">
        <NavLink
          role="button"
          className="pt-8 pb-8"
          prefix={[
            <div
              className="items-center justify-center text-base"
              style={{
                display: "flex",
                width: "24px",
                height: "24px",
                backgroundColor: "var(--text-plain)",
              }}
            >
              <Add width="16" height="16"/>
            </div>,
            undefined,
          ]}
          onClick={handleCreateNewPlaylist}
        >
          {formatMessage({ id: "sidebar.playlist_create" })}
        </NavLink>
        <NavLink
          className="pt-8 pb-8"
          to="/collection/tracks"
          prefix={[<Favorite/>, <Favorite/>]}
          isMatched={location.pathname === "/collection/tracks"}
        >
          {formatMessage({ id: "sidebar.liked_songs" })}
        </NavLink>
        <hr
          className="w-full border-none"
          style={{
            height: "1px",
            backgroundColor: "#282828",
          }}
        />

        <ul
          id="sidebar-playlists"
          className="scrollbar list-none border-0 m-0 p-0 overflow-y-scroll"
        >
          <InfiniteScroll
            next={handleGetPlaylists}
            hasMore={playlists.length < (data?.total ?? 1)}
            loader={"Loading"}
            dataLength={playlists.length}
            scrollableTarget="sidebar-playlists"
          >
            {data?.items?.map?.((item) =>
              <li key={item.id}>
                <NavLink
                  className="w-full"
                  to={`/playlist/${item.id}`}
                  isMatched={location.pathname === `/playlist/${item.id}`}
                  suffix={context.uri === item.uri && <PlayingGreenIcon/>}
                >
                  {item.name}
                </NavLink>
              </li>
            )}
          </InfiniteScroll>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
