import React from 'react';
import { TreeSelect } from 'antd';
import { formatMessage } from '@umijs/max';
import useTreeData from './_hooks/useTreeData';

const Index = (props) => {
  const {
    treeData,

    normalizeValue = ({ multiple, value }) => {
      const newValue = multiple
        ? value?.map((item) => item && `${item}`)?.filter((item) => item)
        : value && `${value}`;

      return newValue;
    },

    multiple = false,
    value,
    ...rest
  } = useTreeData(props);

  const newValue = normalizeValue({
    multiple,
    value,
  });

  return (
    <TreeSelect
      placeholder={formatMessage({ id: '请选择' })}
      showSearch
      allowClear
      filterTreeNode={(inputValue, treeNode) => {
        return new RegExp(inputValue, 'gi').test(treeNode.title);
      }}
      {...rest}
      treeData={treeData}
      multiple={multiple}
      value={newValue}
    />
  );
};

Object.keys(TreeSelect).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = TreeSelect[item];
  }
});
export default Index;
