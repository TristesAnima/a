/**
 * @author zhangxu
 * @date 3/18/23 7:55 PM
 * @description 接收和返回时间戳的DatePicker
 */
import React from 'react';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import moment from 'moment';

type Props = DatePickerProps & {
  value: number;
};

const Index: React.FC<Props> = (props) => {
  const { value } = props;
  return <DatePicker {...props} value={moment(value)} />;
};

Index.displayName = 'DatePicker';

export default Index;
