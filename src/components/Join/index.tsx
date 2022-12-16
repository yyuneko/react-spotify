import classnames from "classnames";
import React from "react";

import styles from "./index.module.less";

import { CommonProps } from "../../type";

interface Props extends CommonProps {
  type?: "comma" | "dot";
  ellipsis?: boolean;
}

function Join(props: Props) {
  const { children, type = "comma", ellipsis = true,className, ...otherProps } = props;

  return (
    <div
      {...otherProps}
      className={classnames({
        [styles["join-comma"]]: type === "comma",
        [styles["join-dot"]]: type === "dot",
        [styles["ellipsis"]]: ellipsis
      }) + " " + (className ?? "")}
    >
      {children}
    </div>
  );
}

export default Join;
