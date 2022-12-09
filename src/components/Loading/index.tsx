import React from "react";

import { CommonProps } from "../../type";

export default function Loading(props: CommonProps & { loading: boolean }) {
  const { children, loading } = props;

  return <div>{loading ? "Loading" : children}</div>;
}