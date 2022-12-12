import classnames from "classnames";
import React from "react";

import { CommonProps } from "../../type";

interface ImageProps extends CommonProps, React.ImgHTMLAttributes<any> {
  src?: string;
  alt?: string;
  shape?: "square" | "circle";
}

export default function Image(props: ImageProps) {
  const { src, alt, className, shape = "square", ...otherProps } = props;

  return (
    <img
      className={
        classnames({
          image: true,
          circle: shape === "circle",
        }) +
        " " +
        (className ?? "")
      }
      src={src}
      alt={alt}
      loading="lazy"
      {...otherProps}
    />
  );
}
