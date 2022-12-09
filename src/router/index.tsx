import React, { lazy, Suspense } from "react";
import { Provider } from "react-redux";

import Home from "@containers/Home";
import Login from "@layouts/Login";
import MainLayout from "@layouts/MainLayout";
import store from "@store/index";
import { AuthProvider, ProtectedRoute } from "@utils/auth";

const AlbumDetail = lazy(() => import("@containers/AlbumDetail"));
const PlayListDetail = lazy(() => import("@containers/PlayListDetail"));
const FavoriteTracks = lazy(() => import("@containers/Favorite"));
const Profile = lazy(() => import("@containers/Profile"));
const Search = lazy(() => import("@containers/Search"));
const Artist = lazy(() => import("@containers/Artist"));
const Collection = lazy(() => import("@containers/Collection"));
const Lyrics = lazy(() => import("@containers/Lyrics"));
const Queue = lazy(() => import("@containers/Queue"));
const routes = [
  {
    path: "/login",
    element: 
      <AuthProvider>
        <Login />
      </AuthProvider>
    ,
  },
  {
    path: "/",
    element: 
      <AuthProvider>
        <Provider store={store}>
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        </Provider>
      </AuthProvider>
    ,
    children: [
      {
        path: "",
        index: true,
        element: 
          <Suspense>
            <Home />
          </Suspense>
        ,
      },
      {
        path: "album/:id",
        element: 
          <Suspense>
            <AlbumDetail />
          </Suspense>
        ,
      },
      {
        path: "playlist/:id",
        element: 
          <Suspense>
            <PlayListDetail />
          </Suspense>
        ,
      },
      {
        path: "search",
        element: 
          <Suspense>
            <Search />
          </Suspense>
        ,
        children: [{ path: ":keyword" }, { path: ":keyword/:type" }],
      },
      {
        path: "user/:id",
        element: 
          <Suspense>
            <Profile />
          </Suspense>
        ,
      },
      {
        path: "collection/:type",
        element: 
          <Suspense>
            <Collection />
          </Suspense>
      },
      {
        path: "collection/tracks",
        element: 
          <Suspense>
            <FavoriteTracks />
          </Suspense>
        ,
      },
      {
        path: "artist/:id",
        element: 
          <Suspense>
            <Artist />
          </Suspense>
        ,
      },
      {
        path: "lyrics",
        element: 
          <Suspense>
            <Lyrics />
          </Suspense>
        ,
      },
      {
        path: "/queue",
        element: 
          <Suspense>
            <Queue />
          </Suspense>
        ,
      },
    ],
  },
  { path: "*", element: <div>404 Not Found</div> },
];
export default routes;
