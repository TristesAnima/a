import React from 'react';
import { Table } from 'antd';
import NormalTable from '../NormalTable';
import ResizableTable from '../ResizableTable';
import SortableTable from '../SortableTable';

const Index = (props) => {
  const { applyPlugin, ...rest } = props;

  if (applyPlugin === 'SortableTable') {
    return <SortableTable {...rest} />;
  }

  if (applyPlugin === 'ResizableTable') {
    return <ResizableTable {...rest} />;
  }

  return <NormalTable {...rest} />;
};

Object.keys(Table).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Table[item];
  }
});
export default Index;
