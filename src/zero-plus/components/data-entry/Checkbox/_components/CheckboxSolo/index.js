import React from 'react';
import { Checkbox } from 'antd';

export default (props) => {
  const {
    options,

    value,
    // eslint-disable-next-line
    beforeChange = ({ resolve, reject, checkedValue }) => {
      resolve();
    },
    onChange,

    ...rest
  } = props;

  if (options.length !== 2) {
    throw new Error('错误用法');
  }

  return (
    <Checkbox
      {...rest}
      checked={value === options[0].value}
      onChange={(e) => {
        const checkedValue = e.target.checked ? options[0].value : options[1].value;
        new Promise((resolve, reject) => {
          beforeChange({ resolve, reject, checkedValue });
        }).then(() => {
          onChange(checkedValue);
        });
      }}
    >
      {options[0].label}
    </Checkbox>
  );
};
