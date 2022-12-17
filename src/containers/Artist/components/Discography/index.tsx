import { useRequest } from "ahooks";
import classnames from "classnames";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInView } from "react-intersection-observer";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import GridView from "@assets/icons/grid.svg";
import ListView from "@assets/icons/list.svg";
import { AlbumCard } from "@components/Card";
import NavBar from "@components/NavBar";
import PlayButton from "@components/PlayButton";
import AlbumOverview from "@containers/Artist/components/AlbumOverview";
import { SimplifiedAlbumObject } from "@service/albums/types";
import { getAnArtist, getAnArtistsAlbums } from "@service/artists";
import { state } from "@store/index";
import { setTitle } from "@store/ui/reducer";
import { dayjs, usePlayContext } from "@utils/index";

import Link from "../../../../components/Link";

export default function Discography() {
  const { id, filter } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { ref, entry } = useInView({
    root: document.querySelector("#app__main"),
    threshold: [1]
  });
  const paused = useSelector<state, boolean>((state) => state.player.paused);
  const colcount = useSelector<state, number>((state) => state.ui.colcount);
  const context = useSelector<state,
    { type?: string; id?: string; uri?: string }>((state) => state.player.context);
  const [currentAlbum, setCurrentAlbum] = useState<SimplifiedAlbumObject>();
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [total, setTotal] = useState(0);
  const [albums, setAlbums] = useState<SimplifiedAlbumObject[]>([]);
  const { data: artist, run: runGetArtistDetail } =
    useRequest(getAnArtist, { manual: true });
  const { run: runGetAlbums } = useRequest(getAnArtistsAlbums, {
    manual: true,
    onSuccess: res => {
      setTotal(res.total);
      setAlbums(albums.concat(res.items));
    }
  });
  useEffect(() => {
    if (id && filter) {
      setAlbums([]);

      if(filter === "all") {
        runGetAlbums(id, {
          include_groups: "album,single,appears_on,compilation",
          limit: 20
        });
      }else{
        runGetAlbums(id,{ include_groups: filter,limit: 20 });
      }
    }
  }, [id, filter]);

  useEffect(() => {
    id && runGetArtistDetail(id);
  }, [id]);
  useEffect(() => {
    if (artist && paused) {
      dispatch(setTitle(
        `Spotify - ${artist.name} - ${formatMessage({ id: "artist-page.discography" })}`
      ));
    }
  }, [artist, paused]);

  const handlePlayCurrentAlbum = usePlayContext({
    type: "context",
    uri: currentAlbum?.uri
  });

  const next = () => {
    id && runGetAlbums(id, { limit: 20, offset: albums.length });
  };

  return <>
    <NavBar>
      <div
        className={"flex gap-16 items-center opacity-0 transition-opacity " + classnames({
          "duration-300 opacity-100": (entry?.intersectionRatio ?? 1) < 1 && currentAlbum
        })}>
        <PlayButton
          isPlaying={!paused && context.uri === currentAlbum?.uri}
          size={48}
          onClick={handlePlayCurrentAlbum}/>
        <h1 className="text-base text-2xl text-overflow-ellipsis">
          {currentAlbum?.name}
        </h1>
      </div>
    </NavBar>
    <section>
      <div ref={ref}/>
      <div
        className={"flex justify-between px-16 xl:px-32 sticky top-64 "
          + classnames({ isPinned: (entry?.intersectionRatio ?? 1) < 1 })
        }>
        <Link
          to={`/artist/${artist?.id}`}
          className="text-base text-2xl text-bold h-40 m-0"
        >
          {artist?.name}
        </Link>
        <div className="flex gap-16 items-center">
          <select onChange={e => navigate(`/artist/${id}/discography/${e.target.value}`)}>
            <option value="all" defaultChecked={filter === "all"}>
              {formatMessage({ id: "artist-page-discography.all" })}
            </option>
            <option value="album" defaultChecked={filter === "album"}>
              {formatMessage({ id: "artist.albums" })}
            </option>
            <option value="single" defaultChecked={filter === "single"}>
              {formatMessage({ id: "artist.singles" })}
            </option>
          </select>
          <button 
            className="button rounded-full w-32 h-32"
            onClick={() => setViewType("list")}
            style={{ 
              backgroundColor: viewType === "list" ? "hsla(0, 0%, 100%, 0.1)" : undefined
            }}
          >
            <ListView width="16" height="16"/>
          </button>
          <button
            className="button rounded-full w-32 h-32"
            onClick={() => setViewType("grid")}
            style={{ 
              backgroundColor: viewType === "grid" ? "hsla(0, 0%, 100%, 0.1)" : undefined
            }}
          >
            <GridView width="16" height="16"/>
          </button>
        </div>
      </div>
      <InfiniteScroll
        next={next}
        hasMore={albums.length < total}
        loader={"Loading"}
        dataLength={albums.length}
        scrollableTarget="app__main"
      >
        {viewType === "list" ? <div>
          {albums.map(album => <AlbumOverview
            key={album.id}
            id={album.id}
            albumDetail={album}
            currentAlbum={currentAlbum}
            setCurrentAlbum={setCurrentAlbum}
          />)}
        </div> :
          <div
            className="grid px-16 xl:px-32"
            aria-colcount={colcount}
            style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
          >
            {albums.map(album => <AlbumCard id={album.id} media={album.images[0]?.url}
              name={album.name} yearOrArtists={<div>
                <span>{dayjs(album.release_date)
                  .year()}</span>
                {" • "}
                <span>{formatMessage({ id: album.album_type })}</span>
              </div>}/>)}
          </div>}
      </InfiniteScroll>
    </section>
  </>;
}