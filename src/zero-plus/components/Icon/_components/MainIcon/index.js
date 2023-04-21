import { createFromIconfontCN } from '@ant-design/icons';
import React from 'react';

const Icon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_694023_7qe93i9txxc.js',
  ...process.env.ICON_FONT,
});

export default (props) => <Icon {...props} />;
