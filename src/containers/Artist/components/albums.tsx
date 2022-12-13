import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import { AlbumCard } from "@components/Card";
import { SimplifiedAlbumObject } from "@service/albums/types";
import { state } from "@store/index";
import { dayjs } from "@utils/index";

export default function Albums(props: { items: SimplifiedAlbumObject[] }) {
  const { items } = props;
  const { formatMessage } = useIntl();
  const colcount = useSelector<state, number>((state) => state.ui.colcount);

  return (
    <div
      className="grid"
      aria-colcount={colcount}
      style={{ gridTemplateColumns: "repeat(var(--col-count),1fr)" }}
    >
      {items.slice(0, colcount).map((album) => 
        <AlbumCard
          key={album.id}
          id={album.id}
          media={album.images[0].url}
          name={album.name}
          yearOrArtists={
            <div>
              <span>{dayjs(album.release_date).year()}</span>
              {" • "}
              <span>{formatMessage({ id: album.album_group })}</span>
            </div>
          }
        />
      )}
    </div>
  );
}
