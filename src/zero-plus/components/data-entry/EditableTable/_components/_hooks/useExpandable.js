import { useState, useMemo } from 'react';

export default (props) => {
  const {
    expandable = {},
    value,

    afterAppend,

    ...rest
  } = props;

  const { defaultExpandAllRows = false } = expandable;

  const memoizedValue = useMemo(() => {
    if (defaultExpandAllRows) {
      return {
        key: `key_${Date.now()}`,
      };
    }
    return null;
  }, [value]);

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  return {
    ...memoizedValue,
    ...rest,

    expandable: {
      expandedRowKeys,
      onExpandedRowsChange: (newExpandedRowKeys) => {
        setExpandedRowKeys(newExpandedRowKeys);
      },
      ...expandable,
      defaultExpandAllRows,
    },
    value,

    afterAppend: ({ record }) => {
      if (!expandedRowKeys.includes(record.key)) {
        setExpandedRowKeys([...expandedRowKeys, record.key]);
      }

      if (afterAppend) {
        afterAppend({
          record,
        });
      }
    },
  };
};
