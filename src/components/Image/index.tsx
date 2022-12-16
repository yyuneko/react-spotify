import classnames from "classnames";
import React, { ReactNode } from "react";

import { CommonProps } from "../../type";

interface ImageProps extends CommonProps, React.ImgHTMLAttributes<any> {
  src?: string;
  fallback?:ReactNode;
  alt?: string;
  shape?: "square" | "circle";
}

export default function Image(props: ImageProps) {
  const { src, alt, className, shape = "square",fallback, ...otherProps } = props;

  return (
    src ? <img
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
    /> : <div 
      className={ classnames({
        image: true,
        circle: shape === "circle",
        flex: true,
        "justify-center": true,
        "items-center": true
      }) + " " + (className ?? "")}>
      {fallback}
    </div>
  );
}
