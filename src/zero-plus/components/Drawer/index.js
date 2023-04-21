import React from 'react';
import { Drawer } from 'antd';
import styles from './index.less';

const Index = (props) => {
  const {
    onCancel,
    onClose,

    afterVisibleChange,
    afterClose,
    children,
    footer = null,

    ...rest
  } = props;

  return (
    <Drawer
      destroyOnClose
      width={416}
      maskClosable
      {...rest}
      onClose={onCancel || onClose}
      afterVisibleChange={(currentVisible) => {
        if (afterVisibleChange) {
          afterVisibleChange(currentVisible);
        }
        if (!currentVisible && afterClose) {
          afterClose();
        }
      }}
    >
      {children}

      {footer !== null && <div className={styles.footer}>{footer}</div>}
    </Drawer>
  );
};

Object.keys(Drawer).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Drawer[item];
  }
});
export default Index;
