import React from "react";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";

import NavBar from "@components/NavBar";
import Tabs from "@components/Tabs";
import Albums from "@containers/Collection/Albums";
import Artists from "@containers/Collection/Artists";
import Playlists from "@containers/Collection/Playlists";

function Collection() {
  const { type } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  return (
    <>
      <NavBar>
        <Tabs
          defaultActiveKey={type}
          onChange={key => navigate(`/collection/${key}`)}
          items={[
            {
              key: "playlists",
              to: "/collection/playlists",
              label: formatMessage({ id: "playlists" }),
            },
            {
              key: "artists",
              to: "/collection/artists",
              label: formatMessage({ id: "artists" }),
            },
            {
              key: "albums",
              to: "/collection/albums",
              label: formatMessage({ id: "albums" }),
            },
          ]}
        />
      </NavBar>
      <div>
        {type === "artists" && <Artists />}
        {type === "playlists" && <Playlists />}
        {type === "albums" && <Albums />}
      </div>
    </>
  );
}

export default Collection;
