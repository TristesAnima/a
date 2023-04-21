import React from 'react';
import styles from './index.less';

export default (props) => {
  const { className = styles.wrapper, ...rest } = props;

  return <div className={className} {...rest} />;
};
