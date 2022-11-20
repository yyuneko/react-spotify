import { lazy } from "react";
const AlbumDetail = lazy(() => import("@containers/AlbumDetail"));
const PlayListDetail = lazy(() => import("@containers/PlayListDetail"));
const FavoriteTracks = lazy(() => import("@containers/Favorite"));
const Profile = lazy(() => import("@containers/Profile"));
const Search = lazy(() => import("@containers/Search"));
const Artist = lazy(() => import("@containers/Artist"));
const routes = [
  {
    path: "album/:id",
    component: AlbumDetail,
  },
  {
    path: "playlist/:id",
    component: PlayListDetail,
  },
  {
    path: "search/:keyword",
    component: Search,
  },
  {
    path: "search",
    component: Search,
  },
  {
    path: "user/:id",
    component: Profile,
  },
  {
    path: "favorite",
    component: FavoriteTracks,
  },
  {
    path: "artist/:id",
    component: Artist,
  },
];
export default routes;
