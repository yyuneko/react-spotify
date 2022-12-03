import React, {useState} from "react";
import ReactDom from "react-dom/client";
import {IntlProvider} from "react-intl";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import cookie from "@http/cookie";
import "@style/global.less";
import "@style/theme.less";

import zhCN from "./locales/zh-CN";
import routes from "./router";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.onSpotifyWebPlaybackSDKReady = () => {
  cookie.set("sdk_ok", "true");
};

function App() {
  const [locale] = useState("zh-CN");

  return (
    <IntlProvider locale={locale} messages={zhCN}>
      <RouterProvider router={createBrowserRouter(routes)}></RouterProvider>
    </IntlProvider>
  );
}

ReactDom.createRoot(document.getElementById("root")).render(<App />);
