import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";

import "./index.less";
import { CommonProps } from "../../type";

interface Props extends CommonProps, LinkProps {
  ellipsis?: boolean;
}

function Link(props: Props) {
  const { children, className, to, ...otherProps } = props;

  return (
    <RouterLink
      to={to}
      {...otherProps}
      className={"link " + (className ?? "")}
      data-title={children}
    >
      {children}
    </RouterLink>
  );
}

export default Link;
