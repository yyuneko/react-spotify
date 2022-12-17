import { useDebounce, useRequest } from "ahooks";
import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";

import SearchIcon from "@assets/icons/search.svg";
import Image from "@components/Image";
import NavBar from "@components/NavBar";
import Tabs from "@components/Tabs";
import SearchAlbums from "@containers/Search/components/albums";
import SearchAll from "@containers/Search/components/all";
import SearchArtists from "@containers/Search/components/artists";
import SearchPlaylists from "@containers/Search/components/playlists";
import SearchTracks from "@containers/Search/components/tracks";
import { getCategories } from "@service/categories";
import { useCurrentUser, useLocalStorage } from "@utils/index";

import styles from "./index.module.less";

export interface SearchTabProps {
  q?: string;
}

function Search() {
  const { keyword = "", type = "all" } = useParams();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const cache = useLocalStorage();
  const user = useCurrentUser();
  const query = useDebounce(decodeURIComponent(keyword), { wait: 500 });
  const tabs = useMemo(
    () => [
      {
        key: "all",
        to: `/search/${query}`,
        label: formatMessage({ id: "search.title.all" }),
        children: <SearchAll q={query}/>,
      },
      {
        key: "tracks",
        to: `/search/${query}/tracks`,
        label: formatMessage({ id: "search.title.tracks" }),
        children: <SearchTracks q={query}/>,
      },
      {
        key: "playlists",
        to: `/search/${query}/playlists`,
        label: formatMessage({ id: "search.title.playlists" }),
        children: <SearchPlaylists q={query}/>,
      },
      {
        key: "artists",
        to: `/search/${query}/artists`,
        label: formatMessage({ id: "search.title.artists" }),
        children: <SearchArtists q={query}/>,
      },
      {
        key: "albums",
        to: `/search/${query}/albums`,
        label: formatMessage({ id: "search.title.albums" }),
        children: <SearchAlbums q={query}/>,
      },
    ],
    [query]
  );
  const { data: categories, run: runGetCategories } =
    useRequest(getCategories, { manual: true });
  useEffect(() => {
    if (!query && user) {
      runGetCategories({ country: user.country });
    }
  }, [!query, user]);

  return (
    <div className={styles["search"]}>
      <NavBar>
        <div className={"inline-flex " + styles["input"]}>
          <span>
            <SearchIcon width="24" height="24"/>
          </span>
          <input
            placeholder={formatMessage({ id: "search.search-for-label" })}
            value={keyword}
            onChange={(e) => navigate(`/search/${e.target.value}`)}
          />
        </div>
      </NavBar>
      {keyword ?
        <div className={styles["search__tabs"] + " px-16 xl:px-32"}>
          <Tabs defaultActiveKey={type} items={tabs}/>
        </div>
        :
        <section className="px-16 xl:px-32">
          <h2>{formatMessage({ id: "search.title.recent-searches" })}</h2>
          {cache.get("history")
            ?.map
            ?.((item: string) =>
              <div>{item}</div>
            )}
          <div className="grid"
            style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}>
            {categories?.categories?.items?.map(category =>
              <div
                key={category.id}
                className={
                  "aspect-square w-full cursor-pointer text-2xl font-bold text-base "
                  + styles["category"]}
                aria-label={category.name}
                onClick={() => navigate(`/genre/${category.id}`)}
              >
                <Image className="w-full" src={category.icons[0]?.url}/>
              </div>)}
          </div>
        </section>
      }
    </div>
  );
}

export default Search;
