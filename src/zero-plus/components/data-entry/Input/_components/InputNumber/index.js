import React from 'react';
import { Input } from 'antd';

export default (props) => {
  const { value, onChange, ...rest } = props;

  const newValue = typeof value === 'number' ? `${value}` : value || '';

  return (
    <Input
      title={newValue}
      {...rest}
      value={newValue}
      onChange={(e) => {
        if (/^-?\d+(\.\d*[1-9]+)?$/.test(e.target.value)) {
          onChange(Number(e.target.value));
        } else {
          onChange(e.target.value);
        }
      }}
    />
  );
};
