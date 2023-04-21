import React from 'react';
import Tree from '../../../../Tree';

export default (props) => {
  const { value, onChange, ...rest } = props;

  return (
    <Tree
      {...rest}
      checkable
      selectable={false}
      checkedKeys={value}
      onCheck={(checkedKeys, e) => {
        if (onChange) {
          onChange(checkedKeys, e);
        }
      }}
    />
  );
};
