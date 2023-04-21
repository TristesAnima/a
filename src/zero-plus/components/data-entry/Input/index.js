import React from 'react';
import { Input } from 'antd';
import InputString from './_components/InputString';
import InputNumber from './_components/InputNumber';

const Index = (props) => {
  if (!props.hasOwnProperty('value')) {
    throw new Error('错误用法');
  }

  const { type = 'string', ...rest } = props;

  return type === 'number' ? <InputNumber {...rest} /> : <InputString {...rest} />;
};

Object.keys(Input).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Input[item];
  }
});
export default Index;
