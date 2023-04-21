import React from 'react';
import { Result } from 'antd';
import { formatMessage } from '@umijs/max';

export default () => (
  <Result status="404" title="404" subTitle={formatMessage({ id: '404提示' })} />
);
