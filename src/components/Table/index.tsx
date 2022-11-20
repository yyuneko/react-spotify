import React, { HTMLAttributes, ReactElement, TdHTMLAttributes } from "react";
import classnames from "classnames";
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
  getRowKey: any;
  rowSelection: number[] | number;
}

function Table<RowType = { [k: string]: any }>(props: TableProps<RowType>) {
  const {
    className = "",
    dataSource = [],
    columns = [],
    onRow = () => ({}),
    getRowKey,
    rowSelection,
  } = props;
  return (
    <div className={styles["table__container"] + " " + className}>
      <table>
        <thead className={styles["table__thead"]}>
          <tr className={styles["table__row"]}>
            {columns.map((col) => (
              <th
                className={`text-align-${col.align ?? "left"}`}
                style={col.width ? { width: col.width } : { maxWidth: "100%" }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles["table__tbody"]}>
          {dataSource.map((item, index) => (
            <tr
              className={classnames({
                [styles["table__row"]]: true,
                [styles["table__row-selected"]]:
                  (Array.isArray(rowSelection) &&
                    rowSelection.includes(index)) ||
                  rowSelection === index,
              })}
              key={
                typeof getRowKey === "function" ? getRowKey(item) : getRowKey
              }
              {...onRow(item)}
            >
              {columns.map((col) => (
                <td
                  className={styles["table__cell"]}
                  style={
                    col.width ? { width: col.width } : { maxWidth: "100%" }
                  }
                >
                  {col.render(item[col.dataIndex], item, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
