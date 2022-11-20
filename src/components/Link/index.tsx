import React from "react";
import { Link as RouterLink } from "react-router-dom";
import styles from "./index.module.less";

function Link(props: any) {
  const { children, className, ...otherProps } = props;
  return (
    <RouterLink
      {...otherProps}
      className={
        styles["link"] + " text-overflow-ellipsis " + (className ?? "")
      }
      title={children}
    >
      {children}
    </RouterLink>
  );
}
export default Link;
