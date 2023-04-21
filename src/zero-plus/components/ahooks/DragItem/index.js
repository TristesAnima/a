import React, { useRef, useState } from 'react';
import { useDrag } from 'ahooks';
import classNames from 'classnames';
import styles from './index.less';

export default (props) => {
  const {
    disabled = false,
    children,

    data,
    onDragStart,
    onDragEnd,

    className,
    draggingClassName = styles.dragging,

    ...rest
  } = props;

  if (disabled) {
    return children;
  }

  const dragRef = useRef();

  const [dragging, setDragging] = useState(false);

  useDrag(data, dragRef, {
    onDragStart: (e) => {
      setDragging(true);
      sessionStorage.setItem('6a4b0777_dragging', 'true');
      if (onDragStart) {
        onDragStart(e);
      }
    },
    onDragEnd: (e) => {
      setDragging(false);
      sessionStorage.removeItem('6a4b0777_dragging');
      if (onDragEnd) {
        onDragEnd(e);
      }
    },
  });

  return (
    <span
      {...rest}
      ref={dragRef}
      className={classNames(className, { [draggingClassName]: dragging })}
    >
      {children}
    </span>
  );
};
