import React from 'react';
import Tree from '../../../../Tree';

export default (props) => {
  const { value, onChange, ...rest } = props;
  return (
    <Tree
      {...rest}
      selectable
      checkable={false}
      selectedKeys={value}
      onSelect={(selectedKeys, e) => {
        if (onChange) {
          onChange(selectedKeys, e);
        }
      }}
    />
  );
};
