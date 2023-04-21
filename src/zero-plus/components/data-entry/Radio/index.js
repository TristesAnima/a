import React from 'react';
import { Radio, Skeleton } from 'antd';
import useOptions from '../_hooks/useOptions';

const Index = (props) => {
  if (!props.hasOwnProperty('value') || props.hasOwnProperty('children')) {
    throw new Error('错误用法');
  }

  const {
    renderOptions = (options) => {
      return options.map(({ value: itemValue, label: itemLabel, ...rest }) => (
        <Radio {...rest} key={itemValue} value={itemValue}>
          {itemLabel}
        </Radio>
      ));
    },

    loading,
    options,

    value,
    // eslint-disable-next-line
    beforeChange = ({ resolve, reject, checkedValue }) => {
      resolve();
    },
    onChange,

    ...rest
  } = useOptions(props); // eslint-disable-line

  if (loading) {
    return <Skeleton.Button block />;
  }

  const newOnChange = (checkedValue) => {
    new Promise((resolve, reject) => {
      beforeChange({ resolve, reject, checkedValue });
    }).then(() => {
      onChange(checkedValue);
    });
  };

  return (
    <Radio.Group
      {...rest}
      value={value}
      onChange={(e) => {
        newOnChange(e.target.value);
      }}
    >
      {renderOptions(options)}
    </Radio.Group>
  );
};

Index.Option = Radio;

Object.keys(Radio).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Radio[item];
  }
});
export default Index;
