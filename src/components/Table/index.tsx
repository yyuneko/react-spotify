import classnames from "classnames";
import React, { HTMLAttributes, ReactElement, ReactNode, TdHTMLAttributes, } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInView } from "react-intersection-observer";

import { getValueWithKeys } from "@utils/index";

import styles from "./index.module.less";

import { CommonProps } from "../../type";

export interface ColumnProp<RowType> {
  dataIndex: string;
  title?: ReactNode;
  align?: "left" | "right";
  width?: number | string;
  visible: boolean | ((colcount: number) => boolean);
  render: (t: any, r: RowType, index: number) => ReactElement;
}

interface TableProps<RowType> extends CommonProps {
  outerRef?:React.Ref<any>
  scrollableTarget?: string;
  showHeader?: boolean;
  dataSource: RowType[];
  colcount: number;
  columns: ColumnProp<RowType>[];
  onRow?: (
    row: RowType,
    index: number
  ) => HTMLAttributes<any> | TdHTMLAttributes<any>;
  rowKey: string | string[] | ((r: RowType, index: number) => string);
  rowSelection?: number[] | number;
  enabledKey?: string | string[];
  total: number;
  next: () => void;
  gridTemplateColumns: string | { [colcount: number]: string };
}

function Table<RowType>(props: TableProps<RowType>) {
  const {
    showHeader = true,
    className = "",
    style,
    dataSource = [],
    columns = [],
    colcount,
    onRow = () => ({}),
    rowKey,
    rowSelection,
    enabledKey,
    total,
    next,
    gridTemplateColumns,
    scrollableTarget,
    outerRef
  } = props;
  const { ref: innerRef, entry } = useInView({
    root: document.querySelector("#app__main"),
    threshold: [1]
  });

  return (
    <div
      className={styles["table__container"] + " " + className}
      role="grid"
      aria-colcount={colcount}
      ref={outerRef}
    >
      {showHeader && <>
        <div ref={innerRef}/>
        <div
          className={classnames({
            isPinned: (entry?.intersectionRatio ?? 1) < 1,
            [styles["table__thead"]]: true,
            "text-xs": true
          }) + " px-16 xl:px-32"}
          role="presentation"
        >
          <div
            className={styles["table__row"]}
            role="row"
            aria-rowindex={1}
            style={{
              gridTemplateColumns:
                typeof gridTemplateColumns === "string"
                  ? gridTemplateColumns
                  : gridTemplateColumns[colcount],
              ...style,
            }}
          >
            {columns.map((col, colIndex) =>
              <div
                role="columnheader"
                key={col.dataIndex + colIndex}
                aria-colindex={colIndex + 1}
                className={classnames({
                  [styles["table__cell"]]: true,
                  [styles[col.align ?? "left"]]: true,
                  [styles["table__cell-can-hidden"]]: !(typeof col.visible ===
                  "function"
                    ? col.visible(colcount)
                    : col.visible),
                })}
                style={col.width ? { width: col.width } : { maxWidth: "100%" }}
              >
                {col.title}
              </div>
            )}
          </div>
        </div>
      </>
      }
      <div role="presentation" id={scrollableTarget}
        className="px-16 xl:px-32">
        <InfiniteScroll
          next={next}
          loader={"loading"}
          scrollableTarget={scrollableTarget ?? "app__main"}
          dataLength={dataSource?.length ?? 0}
          hasMore={(dataSource?.length ?? 0) < total}
          scrollThreshold={0.95}
        >
          {dataSource?.map?.((item, index) => {
            try {
              return (
                <div
                  draggable
                  role="row"
                  {...onRow(item, index)}
                  aria-rowindex={index + 2}
                  key={
                    typeof rowKey === "function"
                      ? rowKey(item, index)
                      : getValueWithKeys(item, rowKey)
                  }
                  aria-selected={
                    Array.isArray(rowSelection) &&
                    rowSelection.includes(index) ||
                    rowSelection === index
                  }
                  aria-disabled={
                    !!(enabledKey && !getValueWithKeys(item, enabledKey))
                  }
                  className={styles["table__row"]}
                  style={{
                    gridTemplateColumns:
                      typeof gridTemplateColumns === "string"
                        ? gridTemplateColumns
                        : gridTemplateColumns[colcount],
                    ...style,
                  }}
                >
                  {columns.map((col, colIndex) =>
                    <div
                      role="gridcell"
                      aria-colindex={colIndex + 1}
                      key={
                        (typeof rowKey === "function"
                          ? rowKey(item, index)
                          : getValueWithKeys(item, rowKey)) + colIndex
                      }
                      className={classnames({
                        [styles["table__cell"]]: true,
                        [styles[col.align ?? "left"]]: true,
                        [styles["table__cell-can-hidden"]]:
                          !(typeof col.visible === "function"
                            ? col.visible(colcount)
                            : col.visible),
                      })}
                      style={
                        col.width ? { width: col.width } : { maxWidth: "100%" }
                      }
                    >
                      {col.render(typeof item === "object"
                        ? item?.[col.dataIndex] : undefined, item, index)}
                    </div>
                  )}
                </div>
              );
            } catch (e) {
              return null;
            }
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Table;
