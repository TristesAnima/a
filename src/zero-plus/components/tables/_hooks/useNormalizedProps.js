import { formatMessage } from '@umijs/max';
import React from 'react';

export default (props) => {
  const {
    expandable,

    rowKey = 'id',

    columns,
    dataSource,
    pagination,

    title,
    footer,

    ...rest
  } = props;

  const childrenColumnName = expandable?.childrenColumnName || 'children';

  return {
    style: { marginTop: 5 },
    tableLayout: 'fixed',

    ...rest,

    childrenColumnName,

    rowKey: (item) => item.key || `${item[rowKey]}`,

    columns: columns || [],
    dataSource: dataSource || [],
    pagination:
      pagination !== false
        ? {
            showSizeChanger: true,
            showQuickJumper: true,
            size: 'small',
            showTotal: (total, range) => (
              <div style={{ position: 'absolute', left: 0, padding: 0 }}>
                {formatMessage(
                  { id: '数据总量', defaultMessage: `共 ${total} 条` },
                  { total, range },
                )}
              </div>
            ),
            ...pagination,
          }
        : false,
    title: title === undefined || typeof title === 'function' ? title : () => title,
    footer: footer === undefined || typeof footer === 'function' ? footer : () => footer,
  };
};
