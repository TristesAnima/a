import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

type Props<T, K extends React.Key> = TableProps<T> & {
  disabled?: boolean;
  id?: string;
  value: K[];
  onSelectedRowKeysChange: (value: K[]) => void;
};

function Index<T extends object, K extends React.Key = string>(props: Props<T, K>) {
  const { disabled = false, id, value = [], onSelectedRowKeysChange, rowSelection, rowKey, onRow, ...restProps } = props;

  return (
    <span id={id}>
      <Table<T>
        {...restProps}
        rowKey={rowKey}
        onRow={(record, index) => ({
          ...onRow?.(record, index),
          onClick: () => {
            if (disabled) {
              return;
            }
            const newSelectedRowKeys = [...value];
            const key = record[rowKey as keyof T] as K;
            const indexInSelectedRowKeys = newSelectedRowKeys.indexOf(key);
            if (indexInSelectedRowKeys >= 0) {
              newSelectedRowKeys.splice(indexInSelectedRowKeys, 1);
            } else {
              newSelectedRowKeys.push(key);
            }
            if (onSelectedRowKeysChange) {
              onSelectedRowKeysChange(newSelectedRowKeys);
            }
          },
        })}
        rowSelection={disabled ? {
          ...rowSelection,
          selectedRowKeys: value,
          onChange: (selectedRowKeys) => {
            if (onSelectedRowKeysChange) {
              onSelectedRowKeysChange(selectedRowKeys as K[]);
            }
          },
        } : undefined}
      />
    </span>
  );
}

export default Index;
