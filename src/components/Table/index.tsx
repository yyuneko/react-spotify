import classnames from "classnames";
import React, { HTMLAttributes, ReactElement, TdHTMLAttributes } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { getValueWithKeys } from "@utils/index";

import styles from "./index.module.less";

export interface ColumnProp<RowType> {
  dataIndex: string;
  title: string;
  align?: "left" | "right" | "center" | "justify" | "char";
  width?: number | string;
  visible?: boolean;
  render: (t: any, r?: RowType, index?: number) => ReactElement;
}

interface TableProps<RowType> {
  className?: string;
  dataSource: RowType[];
  columns: ColumnProp<RowType>[];
  onRow?: (
    row: RowType,
    index?: number
  ) => HTMLAttributes<any> | TdHTMLAttributes<any>;
  rowKey: string | string[];
  rowSelection?: number[] | number;
  colcount: number;
  disabledKey?: string | string[];
  total: number;
  next: () => void;
}

function Table<RowType = { [k: string]: any }>(props: TableProps<RowType>) {
  const {
    className = "",
    dataSource = [],
    columns = [],
    onRow = () => ({}),
    rowKey,
    rowSelection,
    colcount,
    disabledKey,
    total,
    next,
  } = props;

  return (
    <div
      className={styles["table__container"] + " " + className}
      role="grid"
      aria-colcount={colcount}
    >
      <div className={styles["table__thead"]} role="presentation">
        <div className={styles["table__row"]} role="row" aria-rowindex="1">
          {columns.map((col, colIndex) => 
            <div
              role="columnheader"
              key={col.title}
              aria-colindex={colIndex + 1}
              className={classnames({
                [styles["table__cell"]]: true,
                [`text-align-${col.align ?? "left"}`]: true,
                [styles["table__cell-can-hidden"]]: [2, 3].includes(colIndex),
              })}
              style={col.width ? { width: col.width } : { maxWidth: "100%" }}
            >
              {col.title}
            </div>
          )}
        </div>
      </div>
      <div role="presentation">
        <InfiniteScroll
          next={next}
          loader={"loading"}
          scrollableTarget="app__main"
          dataLength={dataSource?.length}
          hasMore={dataSource?.length < total}
        >
          {dataSource?.map?.((item, index) => 
            <div
              draggable
              role="row"
              {...onRow(item, index)}
              aria-rowindex={index + 2}
              key={getValueWithKeys(item, rowKey)}
              aria-selected={
                Array.isArray(rowSelection) && rowSelection.includes(index) ||
                rowSelection === index
              }
              className={classnames({
                [styles["table__rowDisabled"]]: !getValueWithKeys(
                  item,
                  disabledKey
                ),
                [styles["table__row"]]: true,
                [styles["table__row-selected"]]:
                  Array.isArray(rowSelection) &&
                    rowSelection.includes(index) ||
                  rowSelection === index,
              })}
            >
              {columns.map((col, colIndex) => 
                <div
                  role="gridcell"
                  aria-colindex={colIndex + 1}
                  key={getValueWithKeys(item, rowKey) + colIndex}
                  className={classnames({
                    [styles["table__cell"]]: true,
                    [styles["table__cell-can-hidden"]]: [2, 3].includes(
                      colIndex
                    ),
                  })}
                  style={
                    col.width ? { width: col.width } : { maxWidth: "100%" }
                  }
                >
                  {col.render(item[col.dataIndex], item, index)}
                </div>
              )}
            </div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Table;
