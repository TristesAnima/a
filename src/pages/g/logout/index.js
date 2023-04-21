import React, { useEffect } from 'react';
import { Result } from 'antd';
import { formatMessage } from '@umijs/max';
import { removeToken, getLocalStorageItem } from '@/zero-plus';

export default () => {
  useEffect(() => {
    removeToken();

    if (getLocalStorageItem('type') === '单点登录') {
      window.close();
    } else {
      window.location.href = '/g/login';
    }
  }, []);

  return <Result status="success" title={formatMessage({ id: '您已成功退出系统' })} />;
};
