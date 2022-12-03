import React from "react";

import Paused from "@assets/icons/paused.svg";
import Playing from "@assets/icons/playing.svg";

import styles from "./index.module.less";

import { CommonProps } from "../../type";

interface PlayButtonProps extends CommonProps {
  isPlaying?: boolean;
  size?: number;
  onClick: () => void;
}

export default function PlayButton(props: PlayButtonProps) {
  const { isPlaying = false, size = 48, onClick, className = "" } = props;

  return isPlaying ? 
    <button
      className={className + " button " + styles["playButton"]}
      style={{ width: size + "px", height: size + "px" }}
      onClick={onClick}
    >
      <Playing width="24" height="24" />
    </button>
    : 
    <button
      className={className + " button " + styles["playButton"]}
      style={{ width: size + "px", height: size + "px" }}
      onClick={onClick}
    >
      <Paused width="24" height="24" />
    </button>
  ;
}
