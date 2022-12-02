import { useRequest } from "ahooks";
import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import Add from "@assets/icons/add.svg";
import CollectionFill from "@assets/icons/collection-fill.svg";
import Collection from "@assets/icons/collection.svg";
import Favorite from "@assets/icons/favorite.svg";
import HomeFill from "@assets/icons/home-fill.svg";
import Home from "@assets/icons/home.svg";
import Logo from "@assets/icons/logo.svg";
import SearchFill from "@assets/icons/search-fill.svg";
import Search from "@assets/icons/search.svg";
import NavLink from "@components/NavLink";
import { getAListOfCurrentUsersPlaylists } from "@service/playlists";

import "./index.less";

function SideBar({ className }: { className?: string }) {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const { data } = useRequest(getAListOfCurrentUsersPlaylists);

  return (
    <div
      className={(className ?? "") + " flex pl-24 pr-24"}
      style={{
        flexDirection: "column",
        alignItems: "stretch",
        flex: 1,
        height: "100%",
        backgroundColor: "var(--sidebar-base)",
      }}
    >
      <div className="text-base pt-24 pb-18">
        <Link to="/">
          <Logo width="131" height="40" />
        </Link>
      </div>
      <ul style={{ listStyle: "none", border: 0, margin: 0, padding: 0 }}>
        <li>
          <NavLink
            to="/"
            prefix={[<Home />, <HomeFill />]}
            isMatched={location.pathname === "/"}
          >
            {formatMessage({ id: "view.web-player-home" })}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search"
            prefix={[<Search />, <SearchFill />]}
            isMatched={location.pathname.startsWith("/search")}
          >
            {formatMessage({ id: "navbar.search" })}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/collection"
            prefix={[<Collection />, <CollectionFill />]}
            isMatched={location.pathname.startsWith("/collection")}
          >
            {formatMessage({ id: "navbar.your-library" })}
          </NavLink>
        </li>
      </ul>
      <div
        className="mt-24"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1",
          overflow: "hidden",
        }}
      >
        <NavLink
          prefix={[
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "var(--text-plain)",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Add width="16" height="16" />
            </div>,
            undefined,
          ]}
        >
          {formatMessage({ id: "sidebar.playlist_create" })}
        </NavLink>
        <NavLink
          to="/collection/tracks"
          prefix={[<Favorite />, <Favorite />]}
          isMatched={location.pathname === "/collection/tracks"}
        >
          {formatMessage({ id: "sidebar.liked_songs" })}
        </NavLink>
        <hr
          style={{
            height: "1px",
            width: "100%",
            backgroundColor: "#282828",
            border: "none",
          }}
        />
        <ul
          className="scrollbar"
          style={{
            listStyle: "none",
            border: 0,
            margin: 0,
            padding: 0,
            overflowY: "scroll",
          }}
        >
          {data?.items?.map?.((item) => 
            <li key={item.id}>
              <NavLink
                to={`/playlist/${item.id}`}
                isMatched={location.pathname === `/playlist/${item.id}`}
              >
                {item.name}
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
