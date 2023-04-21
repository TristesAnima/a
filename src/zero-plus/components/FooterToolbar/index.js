import React from 'react';
import { FooterToolbar } from '@ant-design/pro-layout';

export default ({ style = {}, ...rest }) => (
  <FooterToolbar style={{ boxShadow: 'none', lineHeight: '43px', ...style }} {...rest} />
);
