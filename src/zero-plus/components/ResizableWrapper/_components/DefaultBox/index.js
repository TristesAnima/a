import React from 'react';
import { ResizableBox } from 'react-resizable';

export default (props) => {
  const { width, ...rest } = props;

  return <ResizableBox width={width} height={0} resizeHandles={['e']} {...rest} />;
};
