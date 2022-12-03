import React, { useEffect, useState } from "react";

import styles from "./index.module.less";

import { CommonProps } from "../../type";

interface Props extends CommonProps {
  max?: number;
  value?: number;
  onSeek: (offset: number, ready?: boolean) => void;
}

export default function ProgressBar(props: Props) {
  const { max = 1, value = 0, onSeek,style ,className = ""} = props;
  const [clicked, setClicked] = useState(false);
  
  useEffect(() => {
    const mouseUpListener = (e: MouseEvent) => {
      if (!clicked) { return; }
      setClicked(false);
      onSeek(value / max);
      e.stopPropagation();
    };

    document.addEventListener("mouseup", mouseUpListener);

    return function () {
      document.removeEventListener("mouseup", mouseUpListener);
    };
  }, [clicked]);

  const onClick = (e:React.MouseEvent<HTMLDivElement,MouseEvent>) => {
    onSeek(
      (e.pageX - e.currentTarget.getBoundingClientRect().left) /
              e.currentTarget.offsetWidth
    );
    e.stopPropagation();
  };

  const onMouseMove = (e:React.MouseEvent<HTMLDivElement,MouseEvent>) => {
    if (!clicked) { return; }
    onSeek(
      (e.pageX - e.currentTarget.getBoundingClientRect().left) /
              e.currentTarget.offsetWidth,
      false
    );
  };

  return (
    <div className={styles["progressBar"] + " " + className} style={style}>
      <div
        onClick={onClick}
        onMouseMove={onMouseMove}
        className={styles["progressBar__bg"]}
        style={{ "--progress-bar-width": `${value / max * 100}%`} as React.CSSProperties}
      >
        <div className={styles["progressBar__front"]}>
          <div className={styles["progressBar__frontCurrent"]}></div>
        </div>
        <div
          className={styles["progressBar__frontButton"]}
          onMouseDown={() => setClicked(true)}
        ></div>
      </div>
    </div>
  );
}
