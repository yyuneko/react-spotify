import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";

import "./index.less";
import { CommonProps } from "../../type";

type Props = CommonProps & LinkProps

function Link(props: Props) {
  const { children, className, to, onClick,...otherProps } = props;

  return (
    <RouterLink
      to={to}
      className={"link " + (className ?? "")}
      data-title={children}
      onClick={(e) => {
        onClick?.(e);
        e.stopPropagation();
      }}
      {...otherProps}
    >
      {children}
    </RouterLink>
  );
}

export default Link;
