import React from 'react';
import { Modal } from 'antd';

const Index = (props) => {
  const {
    onCancel,
    onClose,

    ...rest
  } = props;

  return (
    <Modal
      destroyOnClose
      width={416}
      maskClosable={false}
      {...rest}
      onCancel={onCancel || onClose}
    />
  );
};

Object.keys(Modal).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Modal[item];
  }
});
export default Index;
