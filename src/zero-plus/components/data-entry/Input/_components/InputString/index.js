import React from 'react';
import { Input } from 'antd';

export default (props) => {
  const {
    trim = true,

    value,
    onChange,
    onBlur,
    ...rest
  } = props;

  const newValue = value || '';

  return (
    <Input
      title={newValue}
      {...rest}
      value={newValue}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      onBlur={(e) => {
        if (trim && /(^\s)|(\s$)/.test(e.target.value)) {
          onChange(e.target.value?.trim());
        }
        if (onBlur) {
          onBlur(e);
        }
      }}
    />
  );
};
