import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';

export default (props) => {
  const {
    renderChildren = ({ dragSourceRef, dragCollectedProps, dragData }) => {
      if (dragCollectedProps.isDragging) {
        return <div ref={dragSourceRef} />;
      }
      return (
        <div ref={dragSourceRef} style={{ border: '1px dashed darkred' }}>
          {JSON.stringify(dragData)}
        </div>
      );
    },

    type = '默认',
    data = {},
    deps = [],

    onLoad,

    ...rest
  } = props;

  const [collectedProps, dragSourceRef, dragPreviewRef] = useDrag(() => {
    return {
      type,
      item: data,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      ...rest,
    };
  }, deps.concat(type));

  useEffect(() => {
    if (onLoad) {
      onLoad({
        dragSourceRef,
        dragPreviewRef,
      });
    }
  }, []);

  return renderChildren({
    dragSourceRef,
    dragPreviewRef,
    dragCollectedProps: collectedProps,
    dragData: data,
  });
};
