import React from 'react';
import { ConfigProvider } from 'antd';
import { formatMessage } from '@umijs/max';

export default ({ children }) => {
  return (
    <ConfigProvider
      renderEmpty={() => (
        <div style={{ textAlign: 'center' }}>{formatMessage({ id: '暂无数据' })}</div>
      )}
    >
      {children}
    </ConfigProvider>
  );
};
