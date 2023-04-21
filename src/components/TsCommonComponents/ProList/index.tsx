import React from 'react';
import type { ProListProps } from '@ant-design/pro-components';
import { ProList } from '@ant-design/pro-components';
import { uniq } from 'lodash';
import { Space } from 'antd';

type Props = ProListProps & {
  value: React.Key[];
  disabled?: boolean;
  onChange: (value: React.Key[]) => void;
  renderSearcher?: (value: React.Key[], onChange: (value: React.Key[]) => void) => React.ReactNode;
};

function Index(props: Props) {
  const {
    value,
    onChange,
    disabled = false,
    rowSelection,
    renderSearcher,
    dataSource,
    rowKey,
    ...restProps
  } = props;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={8}>
      {renderSearcher?.(value, onChange)}
      <ProList
        {...restProps}
        size="small"
        split
        tableAlertRender={false}
        ghost
        rowSelection={
          !disabled && {
            ...rowSelection,
            selectedRowKeys: value,
            onChange: (newSelectedRowKeys) => {
              if (onChange) {
                onChange(uniq([...value, ...newSelectedRowKeys]));
              }
            },
          }
        }
        rowKey="id"
        onRow={(row) => ({
          onClick: () => {
            if (disabled || !rowKey || !rowSelection) {
              return;
            }
            const newRowKey = typeof rowKey === 'function' ? rowKey(row) : rowKey;
            const { getCheckboxProps = () => ({ disabled: false }) } = rowSelection;
            if (getCheckboxProps(row).disabled) {
              return;
            }
            onChange(uniq([...value, row[newRowKey]]));
          },
        })}
      />
    </Space>
  );
}

Index.displayName = 'ProList';

export default Index;
