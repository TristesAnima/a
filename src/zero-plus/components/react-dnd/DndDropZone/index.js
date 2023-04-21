import React from 'react';
import { useDrop } from 'react-dnd';

export default (props) => {
  const {
    renderChildren = ({ dropTargetRef, dropData }) => {
      return (
        <div ref={dropTargetRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
          {JSON.stringify(dropData)}
        </div>
      );
    },

    accept = ['默认'],
    data = {},
    deps = [],

    drop,

    ...rest
  } = props;

  const [collectedProps, dropTargetRef] = useDrop(() => {
    return {
      accept,
      drop: (item, monitor) => {
        if (drop) {
          drop(item, monitor);
        }
        return data;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
      ...rest,
    };
  }, deps.concat(accept));

  return renderChildren({
    dropTargetRef,
    dropCollectedProps: collectedProps,
    dropData: data,
  });
};
