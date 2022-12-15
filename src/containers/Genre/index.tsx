import { useRequest } from "ahooks";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useParams } from "react-router-dom";

import { Card } from "@components/Card";
import Image from "@components/Image";
import NavBar from "@components/NavBar";
import { getACategory } from "@service/categories";
import { getACategoriesPlaylists } from "@service/playlists";
import { SimplifiedPlaylistObject } from "@service/playlists/types";
import { useCurrentUser } from "@utils/index";

export default function Genre() {
  const { id } = useParams();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [playlists, setPlaylists] = useState<SimplifiedPlaylistObject[]>([]);
  const {
    run: runGetPlaylists
  } = useRequest(getACategoriesPlaylists, {
    manual: true,
    onSuccess: (res) => {
      setTotal(res.playlists.total);
      setPlaylists(playlists.concat(res.playlists.items));
    }
  });
  const {
    data: categoryDetail,
    run: runGetCategoryDetail
  } = useRequest(getACategory, { manual: true });
  useEffect(() => {
    if (id && user) {
      runGetCategoryDetail(id, { country: user.country });
      runGetPlaylists(id, { country: user.country, limit: 20 });
    }
  }, [id, user]);

  const next = () => {
    id && user && runGetPlaylists(id, {
      country: user.country,
      limit: 20,
      offset: playlists.length
    });
  };

  return <>
    <NavBar/>
    <div className="p-32">
      <h1 className="text-8xl text-base">{categoryDetail?.name}</h1>
      {!!playlists.length &&
      <InfiniteScroll
        next={next}
        hasMore={playlists.length < total}
        dataLength={playlists.length}
        loader={"Loading"}
        scrollThreshold={0.95}
        scrollableTarget="app__main"
      >
        <div className="grid"
          style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}>
          {
            playlists.map(playlist => playlist && <Card
              key={playlist.id}
              contextUri={`spotify:playlist:${playlist.id}`}
              media={<Image src={playlist.images[0]?.url}/>}
              title={<div>{playlist.name}</div>}
              description={<div>{playlist.description}</div>}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            />)
          }
        </div>
      </InfiniteScroll>
      }
    </div></>;
}