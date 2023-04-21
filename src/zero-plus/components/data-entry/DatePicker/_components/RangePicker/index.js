import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { formatMessage } from '@umijs/max';

const Index = (props) => {
  if (!props.hasOwnProperty('value')) {
    throw new Error('错误用法');
  }

  const {
    value,
    onChange,

    ...rest
  } = props;

  return (
    <DatePicker.RangePicker
      {...rest}
      value={value && value[0] && value[1] && [moment(value[0]), moment(value[1])]}
      onChange={(dates, dateStrings) => {
        if (onChange) {
          onChange(dateStrings.map((item) => item || null));
        }
      }}
    />
  );
};

Index.getRanges = (type) => {
  switch (type) {
    case '01':
      return {
        [formatMessage({ id: '第1季度' })]: [
          moment().quarter(1).startOf('quarter'),
          moment().quarter(1).endOf('quarter'),
        ],
        [formatMessage({ id: '第2季度' })]: [
          moment().quarter(2).startOf('quarter'),
          moment().quarter(2).endOf('quarter'),
        ],
        [formatMessage({ id: '第3季度' })]: [
          moment().quarter(3).startOf('quarter'),
          moment().quarter(3).endOf('quarter'),
        ],
        [formatMessage({ id: '第4季度' })]: [
          moment().quarter(4).startOf('quarter'),
          moment().quarter(4).endOf('quarter'),
        ],
      };
    case '02':
      return {
        [formatMessage({ id: '今年' })]: [moment().startOf('year'), moment().endOf('year')],
        [formatMessage({ id: '本季' })]: [moment().startOf('quarter'), moment().endOf('quarter')],
        [formatMessage({ id: '本月' })]: [moment().startOf('month'), moment().endOf('month')],
        [formatMessage({ id: '本周' })]: [moment().startOf('week'), moment().endOf('week')],
        [formatMessage({ id: '今日' })]: [moment().startOf('day'), moment().endOf('day')],
        [formatMessage({ id: '去年' })]: [
          moment().subtract(1, 'years').startOf('year'),
          moment().subtract(1, 'years').endOf('year'),
        ],
        [formatMessage({ id: '前年' })]: [
          moment().subtract(2, 'years').startOf('year'),
          moment().subtract(2, 'years').endOf('year'),
        ],
      };
    case '03':
      return {
        [formatMessage({ id: '今年' })]: [moment(), moment().endOf('year')],
        [formatMessage({ id: '本季' })]: [moment(), moment().endOf('quarter')],
        [formatMessage({ id: '本月' })]: [moment(), moment().endOf('month')],
        [formatMessage({ id: '本周' })]: [moment(), moment().endOf('week')],
        [formatMessage({ id: '今日' })]: [moment(), moment().endOf('day')],
      };
    case '04':
      return {
        [formatMessage({ id: '30天' })]: [moment(), moment().add(30, 'days')],
        [formatMessage({ id: '60天' })]: [moment(), moment().add(60, 'days')],
        [formatMessage({ id: '90天' })]: [moment(), moment().add(90, 'days')],
        [formatMessage({ id: '180天' })]: [moment(), moment().add(180, 'days')],
        [formatMessage({ id: '1年' })]: [moment(), moment().add(1, 'years')],
        [formatMessage({ id: '2年' })]: [moment(), moment().add(2, 'years')],
        [formatMessage({ id: '3年' })]: [moment(), moment().add(3, 'years')],
        [formatMessage({ id: '5年' })]: [moment(), moment().add(5, 'years')],
      };
    case '05':
      return {
        [formatMessage({ id: '近30天' })]: [moment().subtract(30, 'days'), moment()],
        [formatMessage({ id: '近60天' })]: [moment().subtract(60, 'days'), moment()],
        [formatMessage({ id: '近90天' })]: [moment().subtract(90, 'days'), moment()],
        [formatMessage({ id: '近180天' })]: [moment().subtract(180, 'days'), moment()],
        [formatMessage({ id: '近1年' })]: [moment().subtract(1, 'years'), moment()],
        [formatMessage({ id: '近2年' })]: [moment().subtract(2, 'years'), moment()],
        [formatMessage({ id: '近3年' })]: [moment().subtract(3, 'years'), moment()],
        [formatMessage({ id: '近5年' })]: [moment().subtract(5, 'years'), moment()],
      };
  }
  return {};
};

export default Index;
