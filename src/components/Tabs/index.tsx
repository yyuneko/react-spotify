import React, { ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./index.module.less";

import { CommonProps } from "../../type";

interface TabProps extends CommonProps {
  to: string;
  onClick?: () => void;
}

function Tab(props: TabProps) {
  const { to, children, onClick,style } = props;

  return (
    <div className={styles["pill"]} onClick={onClick} style={style}>
      <Link to={to}>{children}</Link>
    </div>
  );
}

interface TabsProps extends CommonProps {
  defaultActiveKey?: string;
  items: {
    label: string;
    key: string;
    children?: ReactNode;
    to: string;
  }[];
  onChange?: (key: string) => void;
}

export default function Tabs(props: TabsProps) {
  const { items, defaultActiveKey, onChange } = props;
  const [cur, setCur] = useState(defaultActiveKey ?? items[0].key);
  const tab = useMemo(
    () => items.find((item) => item.key === cur),
    [items, cur]
  );

  return (
    <div className={styles["tabs"]}>
      <div className={styles["pills"]}>
        {items.map((item) => 
          <Tab
            to={item.to}
            key={item.key}
            onClick={() => {
              setCur(item.key);
              onChange?.(item.key);
            }}
            style={
              cur === item.key
                ? {
                  backgroundColor: "var(--text-base)",
                  color: "var(--text-reverse)",
                }
                : {
                  backgroundColor: "var(--bg-highlight)",
                  color: "var(--text-base)",
                }
            }
          >
            {item.label}
          </Tab>
        )}
      </div>
      <div>{tab?.children}</div>
    </div>
  );
}
