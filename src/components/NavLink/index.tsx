import classnames from "classnames";
import React, { ReactNode } from "react";
import { LinkProps } from "react-router-dom";

import Link from "@components/Link";

import styles from "./index.module.less";

import { CommonProps } from "../../type";

interface NavLinkProps extends CommonProps, Omit<LinkProps, "prefix"> {
  prefix?: [ReactNode, ReactNode];
  isMatched?: boolean;
}

function NavLink(props: NavLinkProps) {
  const {
    className,
    children,
    prefix,
    isMatched = false,
    ...otherProps
  } = props;

  return (
    <Link
      className={
        (className ?? "") +
        classnames({
          [styles["nav-link"]]: true,
          "text-base": isMatched,
          "text-s": true,
        })
      }
      {...otherProps}
    >
      {prefix?.length === 2 && (isMatched ? prefix[1] : prefix[0])}
      {children}
    </Link>
  );
}

export default NavLink;
