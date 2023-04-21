import React from 'react';
import AntdIcon from './_components/AntdIcon';
import MainIcon from './_components/MainIcon';

export default ({ type, ...rest }) => {
  if (!type) {
    return null;
  }
  if (type.startsWith('icon-')) {
    return <MainIcon type={type} {...rest} />;
  }
  return <AntdIcon type={type} {...rest} />;
};
