import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const Index: React.FC<
  React.PropsWithChildren<{ checked: boolean; onChange: (checked: boolean) => void }>
> = (props) => {
  const { children, checked, onChange } = props;

  return (
    <div
      className={classNames(styles['checked-list-item'], checked && styles.active)}
      onClick={() => {
        onChange(!checked);
      }}
    >
      {children}
    </div>
  );
};

export default Index;
