import React from "react";
import styles from "./index.module.less";

function Join(props: any) {
  const { children, type = "comma" } = props;
  return (
    <div
      className={type === "comma" ? styles["join-comma"] : styles["join-dot"]}
    >
      {children}
    </div>
  );
}
export default Join;
