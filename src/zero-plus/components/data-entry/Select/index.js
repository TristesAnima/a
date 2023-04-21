import React from 'react';
import { Select, Skeleton } from 'antd';
import { formatMessage } from '@umijs/max';
import useOptions from '../_hooks/useOptions';

const normalizeValue = ({ mode, separator, value }) => {
  if (['multiple', 'tags'].includes(mode)) {
    if (separator) {
      return value?.split(separator)?.filter((item) => item) || [];
    }
    return value || [];
  }
  return value;
};

const Index = (props) => {
  if (!props.hasOwnProperty('value') || props.hasOwnProperty('children')) {
    throw new Error('错误用法');
  }

  const {
    renderOptions = (options) => {
      return options.map(({ value: itemValue, label: itemLabel, ...rest }) => (
        <Select.Option {...rest} key={itemValue} value={itemValue}>
          {itemLabel}
        </Select.Option>
      ));
    },

    loading,
    options,

    mode,
    separator,
    value,
    onChange,
    ...rest
  } = useOptions(props); // eslint-disable-line

  if (loading) {
    return <Skeleton.Button block />;
  }

  const newValue = normalizeValue({
    mode,
    separator,
    value,
  });

  return (
    <Select
      placeholder={formatMessage({ id: '请选择' })}
      allowClear
      showSearch={true}
      filterOption={(inputValue, option) => {
        return new RegExp(inputValue, 'gi').test(option.children);
      }}
      style={{ width: '100%' }}
      {...rest}
      mode={mode}
      value={newValue}
      onChange={(selectedValue) => {
        if (onChange) {
          onChange(separator ? selectedValue?.join(separator) : selectedValue);
        }
      }}
    >
      {renderOptions(options)}
    </Select>
  );
};

Object.keys(Select).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Select[item];
  }
});
export default Index;
