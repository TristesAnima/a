import React from 'react';
import { Table } from 'antd';
import ConfigProvider from '../_components/ConfigProvider';
import useNormalizedProps from '../_hooks/useNormalizedProps';

export default (props) => {
  const { header, ...rest } = useNormalizedProps(props);

  return (
    <ConfigProvider>
      <div style={{ textAlign: 'right' }}>{header}</div>
      <Table {...rest} />
    </ConfigProvider>
  );
};
