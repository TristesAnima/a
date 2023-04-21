import React from 'react';
import { Checkbox, Skeleton } from 'antd';
import CheckboxGroup from './_components/CheckboxGroup';
import CheckboxSolo from './_components/CheckboxSolo';
import useOptions from '../_hooks/useOptions';

const Index = (props) => {
  if (!props.hasOwnProperty('value') || props.hasOwnProperty('children')) {
    throw new Error('错误用法');
  }

  const { loading, type = 'group', ...rest } = useOptions(props); // eslint-disable-line

  if (loading) {
    return <Skeleton.Button block />;
  }

  return type === 'solo' ? <CheckboxSolo {...rest} /> : <CheckboxGroup {...rest} />;
};

Index.Option = Checkbox;

Object.keys(Checkbox).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Checkbox[item];
  }
});
export default Index;
