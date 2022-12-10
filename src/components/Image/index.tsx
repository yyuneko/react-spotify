import React from "react";

import { CommonProps } from "../../type";

interface ImageProps extends CommonProps, React.ImgHTMLAttributes<any> {
  src?: string;
  alt?: string;
}

export default function Image(props: ImageProps) {
  const { src, alt, className, ...otherProps } = props;

  return (
    <img
      className={"image " + (className ?? "")}
      src={src}
      alt={alt}
      loading="lazy"
      {...otherProps}
    />
  );
}
