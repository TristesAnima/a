import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import RangePicker from './_components/RangePicker';

const Index = (props) => {
  if (!props.hasOwnProperty('value')) {
    throw new Error('错误用法');
  }

  const { value, onChange, ...rest } = props;

  return (
    <DatePicker
      {...rest}
      value={value && moment(value)}
      onChange={(date, dateString) => {
        if (onChange) {
          onChange(dateString || null);
        }
      }}
    />
  );
};

Index.RangePicker = RangePicker;

Object.keys(DatePicker).forEach((item) => {
  if (!['defaultProps', 'RangePicker', 'contextType'].includes(item)) {
    Index[item] = DatePicker[item];
  }
});
export default Index;
