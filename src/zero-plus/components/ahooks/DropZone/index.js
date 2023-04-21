import React, { useRef, useState } from 'react';
import { useDrop } from 'ahooks';
import styles from './index.less';

export default (props) => {
  const {
    renderHoveringChildren = (children) => {
      return (
        <div style={{ position: 'relative', width: '100%', backgroundColor: '#cfe8fc' }}>
          {children}
        </div>
      );
    },

    disabled = false,
    children,

    data,
    onChange = ({ dropZone, dragItem }) => {
      console.log('onChange', dropZone, dragItem);
    },

    ...rest
  } = props;

  if (disabled) {
    return children;
  }

  const dropRef = useRef();

  const [hovering, setHovering] = useState(false);

  useDrop(dropRef, {
    onDom: (dragItem) => {
      setHovering(false);
      onChange({
        dropZone: data,
        dragItem,
      });
    },
    onDragEnter: () => {
      setHovering(true);
    },
    onDragLeave: () => {
      setHovering(false);
    },
  });

  return (
    <span className={styles.wrapper} {...rest} ref={dropRef}>
      {sessionStorage.getItem('6a4b0777_dragging') && hovering
        ? renderHoveringChildren(children)
        : children}
    </span>
  );
};
