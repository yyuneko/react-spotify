import React, { ReactNode } from "react";

export interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}