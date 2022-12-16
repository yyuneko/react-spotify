import { useDebounce, useRequest } from "ahooks";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import DeleteIcon from "@assets/icons/delete.svg";
import BackToIcon from "@assets/icons/router-back.svg";
import SearchIcon from "@assets/icons/search.svg";
import { SearchResultProps } from "@components/Card";
import MixedList from "@containers/PlayListDetail/components/MixedList";
import { getAnAlbumsTracks } from "@service/albums";
import { AlbumBase, SimplifiedAlbumObject } from "@service/albums/types";
import { getAnArtistsAlbums, getAnArtistsTopTracks, } from "@service/artists";
import { search } from "@service/search";
import { SimplifiedTrackObject, TrackObject } from "@service/tracks/types";
import { format } from "@utils/index";

import styles from "./index.module.less";

import SearchEntries, { getSearchTypeEntryTitle } from "../SearchEntries";

export type History =
  | {
  mode: "search";
  type: "all" | "artist" | "album" | "track";
  items: SearchResultProps[];
  total?: number;
}
  | {
  mode: "view";
  type: "album";
  id: string;
  detail?: AlbumBase;
  tracks: SimplifiedTrackObject[];
}
  | {
  mode: "view";
  type: "artist";
  id: string;
  detail: { name: string };
  topTracks?: TrackObject[];
  totalAlbums?: number;
  albums?: SimplifiedAlbumObject[];
};

export default function Search(props: {
  id: string;
  setExtenderMode: (mode: "recommendation") => void;
  tracks: SimplifiedTrackObject[];
  runAddTracksToPlaylist: (
    playlist_id: string,
    params: {
      position?: number;
      uris?: string;
    }
  ) => void;
}) {
  const { id, setExtenderMode, runAddTracksToPlaylist } = props;
  const { formatMessage } = useIntl();
  /*
   * if mode equals to "search", then show some related search result,
   * otherwise show the content of current target, such as the tracks of an album
   */
  const searchHistoryStack = useRef<History[]>([]);
  const [currentMode, setCurrentMode] = useState<History>({
    mode: "search",
    type: "all",
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const q = useDebounce(keyword, { wait: 500 });

  const { run: runGetAlbumTracks } = useRequest(getAnAlbumsTracks, {
    manual: true,
    onSuccess: (res) => {
      if (currentMode.mode === "view" && currentMode.type === "album") {
        setCurrentMode({
          ...currentMode,
          tracks: currentMode.tracks.concat(res.items),
        });
      }
    },
  });

  const { run: runGetArtistTracks } = useRequest(getAnArtistsTopTracks, {
    manual: true,
    onSuccess: (res) => {
      if (currentMode.mode === "view" && currentMode.type === "artist") {
        setCurrentMode({ ...currentMode, topTracks: res.tracks });
      }
    },
    onFinally: () => {
      setLoading(false);
    }
  });
  const { run: runGetArtistAlbums } = useRequest(getAnArtistsAlbums, {
    manual: true,
    onSuccess: (res) => {
      if (currentMode.mode === "view" && currentMode.type === "artist") {
        setCurrentMode({
          ...currentMode,
          totalAlbums: res.total,
          albums: (currentMode.albums ?? []).concat(res.items),
        });
      }
    },
  });
  const { run: runSearch } = useRequest(search, {
    manual: true,
    onSuccess: (res) => {
      let items: SearchResultProps[] = [];

      if (res.tracks) {
        items = items.concat(
          res.tracks.items.map((item) => ({ type: "track", value: item }))
        );
      }

      if (res.albums) {
        items = items.concat(
          res.albums.items.map((item) => ({ type: "album", value: item }))
        );
      }

      if (res.artists) {
        items = items.concat(
          res.artists.items.map((item) => ({ type: "artist", value: item }))
        );
      }

      if (currentMode.mode === "search") {
        if (currentMode.type === "all") {
          setCurrentMode({
            ...currentMode,
            items: items.slice(0, 10),
            total: Math.min(10, items.length)
          });
        } else {
          setCurrentMode({
            ...currentMode,
            items: currentMode.items.concat(items),
            total: res[(currentMode.type + "s") as "artists" | "albums" | "tracks"]?.total
          });
        }
      }
    },
    onFinally: () => {
      setLoading(false);
    }
  });

  useEffect(() => {
    setCurrentMode({
      mode: "search",
      type: currentMode.mode === "search" ? currentMode.type : "all",
      items: [],
    });
    searchHistoryStack.current = [{ mode: "search", type: "all", items: [] }];
  }, [q]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (currentMode.mode === "search") {
      if (currentMode.items.length > 0) {
        return;
      }

      setLoading(true);

      if (currentMode.type === "all") {
        runSearch({
          q,
          type: "album,artist,track",
          include_external: "audio",
          limit: 4,
        });
      } else {
        runSearch({
          q,
          type: currentMode.type,
          include_external: "audio",
          limit: 10,
        });
      }
    }else{
      if(currentMode.type === "album")
      {
        if(currentMode.tracks.length >= (currentMode.detail?.total_tracks ?? 0)){return;}
        runGetAlbumTracks(currentMode.id,{ limit: 10 });
      }else if(currentMode.type === "artist")
      {
        if(currentMode.topTracks){return;}
        runGetArtistTracks(currentMode.id);
      }
    }
  }, [currentMode, loading]);

  const handleBackToPreviousMode = () => {
    setLoading(false);

    if (searchHistoryStack.current.length > 0) {
      setCurrentMode(searchHistoryStack.current.pop()!);
    }
  };

  const handlePushNewMode = (mode: History) => {
    setLoading(false);
    searchHistoryStack.current.push(currentMode);
    setCurrentMode(mode);
  };

  const next = () => {
    if (currentMode.mode === "search") {
      if (currentMode.type === "all") {
        return;
      }

      runSearch({
        q,
        type: currentMode.type,
        include_external: "audio",
        limit: 10,
        offset: currentMode.items.length
      });
    }
  };

  return (
    <>
      <section
        className="py-24 mt-24 flex justify-between sticky"
        style={{ borderTop: "1px solid hsla(0,0%,100%,0.1)" ,top: "64px" }}>
        <div>
          <h1 className="text-base text-2xl font-bold">
            {formatMessage({ id: "playlist.curation.title" })}
          </h1>
          <div className="inline-flex justify-between">
            <div className={"inline-flex " + styles["input"]}>
              <span>
                <SearchIcon width="24" height="24"/>
              </span>
              <input
                placeholder={formatMessage({
                  id: "playlist.curation.search_placeholder",
                })}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DeleteIcon width="24" height="24"
          onClick={() => setExtenderMode("recommendation")}
        />
      </section>
      {currentMode.mode === "search" &&
        <div>
          {currentMode.type != "all" &&
            <h1 onClick={handleBackToPreviousMode} className="text-lg flex items-center">
              <BackToIcon width="24" height="24"/>
              {formatMessage({
                id: getSearchTypeEntryTitle(currentMode.type)
              })}
            </h1>
          }
          {currentMode.items.length ? <><MixedList
            id={id}
            total={currentMode.total ?? 0}
            next={next}
            items={currentMode.items}
            runAddTracksToPlaylist={runAddTracksToPlaylist}
            handlePushNewMode={handlePushNewMode}
          />
          {currentMode.type === "all" &&
            <SearchEntries handlePushNewMode={handlePushNewMode}/>}</> :
            q && <div className="flex w-full justify-center">
              {format(formatMessage({ id: "search.empty-results-title" }),q)}
            </div>
          }
        </div>
      }
      {currentMode.mode === "view" &&
        <div>
          <h1 onClick={handleBackToPreviousMode} className="text-lg flex items-center">
            <BackToIcon width="24" height="24"/>
            {currentMode.detail?.name}
          </h1>
          {currentMode.type === "album" &&
            <MixedList
              handlePushNewMode={handlePushNewMode}
              id={id}
              items={currentMode.tracks.map((track) => ({
                type: "track",
                value: {
                  ...track,
                  album: { images: currentMode.detail?.images },
                } as unknown as TrackObject,
              }))}
              total={currentMode.detail?.total_tracks ?? 0}
              runAddTracksToPlaylist={runAddTracksToPlaylist}
              next={() =>
                runGetAlbumTracks(currentMode.id, {
                  limit: 10,
                  offset: currentMode.tracks.length,
                })
              }
            />
          }
          {currentMode.type === "artist" &&
            <>
              {!!currentMode.topTracks?.length && <section>
                <h1>
                  {formatMessage({ id: "playlist.curation.popular_songs" })}
                </h1>
                <MixedList
                  handlePushNewMode={handlePushNewMode}
                  id={id}
                  items={currentMode.topTracks?.map?.((track) => ({
                    type: "track",
                    value: track,
                  })) ?? []}
                  total={currentMode.topTracks?.length ?? 1}
                  runAddTracksToPlaylist={runAddTracksToPlaylist}
                  next={() => false}
                />
              </section>}
              <section>
                <h1>{formatMessage({ id: "playlist.curation.albums" })}</h1>
                <MixedList
                  handlePushNewMode={handlePushNewMode}
                  id={id}
                  items={currentMode.albums?.map?.((album) => ({
                    type: "album",
                    value: album,
                  })) ?? []}
                  total={currentMode.totalAlbums ?? 1}
                  runAddTracksToPlaylist={runAddTracksToPlaylist}
                  next={() =>
                    runGetArtistAlbums(currentMode.id, {
                      limit: 10,
                      offset: currentMode.albums?.length,
                    })
                  }
                />
              </section>
            </>
          }
        </div>
      }
    </>
  );
}
