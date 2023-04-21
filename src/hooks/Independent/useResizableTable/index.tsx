import React, { useState } from 'react';
import { Resizable } from 'react-resizable';
import type { ResizableProps } from 'react-resizable';
import type { TableColumnsType, TableColumnType } from 'antd';

type ResizableTitleProps = TableColumnType<Record<string, any>> & {
  resizable?: boolean;
  onResize: (...args: any[]) => void;
};

const ResizableTitle: React.FC<ResizableTitleProps> = (props) => {
  const { resizable = true, width, onResize, ...restProps } = props;

  if (!resizable || !width) {
    // @ts-ignore
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width as number}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      axis="x"
      onResize={onResize}
      draggableOpts={{
        // 默认user-select为none，false为取消此设置
        enableUserSelectHack: false,
      }}
    >
      {/* @ts-ignore */}
      <th {...restProps} />
    </Resizable>
  );
};

interface Props<TRecord> {
  columns: TableColumnsType<TRecord>;
}

export default function useResizableTable<TRecord>(props: Props<TRecord>) {
  const [columns, setColumns] = useState(props.columns);

  const handleResize =
    (index: number): ResizableProps['onResize'] =>
    (_, { size }) => {
      const newColumns = [...columns];
      newColumns[index] = { ...newColumns[index], width: size.width };
      setColumns(newColumns);
    };

  const mergeColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: { width: any; resizable?: boolean }) => ({
      width: column.width,
      resizable: column.resizable,
      onResize: handleResize(index),
    }),
  }));

  return {
    columns: mergeColumns,
    components: {
      header: {
        cell: ResizableTitle,
      },
    },
  };
}
