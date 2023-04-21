import React from 'react';
import { Spin } from 'antd';

export default (props) => (
  <Spin size="large" style={{ display: 'inline-block', width: '100%' }} {...props} />
);
