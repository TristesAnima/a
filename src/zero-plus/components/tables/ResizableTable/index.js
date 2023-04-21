import { Table } from 'antd';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { Resizable } from 'react-resizable';
import ConfigProvider from '../_components/ConfigProvider';
import useNormalizedProps from '../_hooks/useNormalizedProps';
import styles from './index.less';

const ResizableCell = (props) => {
  const { resizable = true, minWidth = 80, width, onResize, onClick, ...rest } = props;

  const resizingRef = useRef(false);

  if (resizable && width) {
    return (
      <Resizable
        width={width}
        height={0}
        onResize={onResize}
        resizeHandles={['e']}
        minConstraints={[minWidth, minWidth]}
        onResizeStart={() => {
          resizingRef.current = true;
        }}
        onResizeStop={() => {
          setTimeout(() => {
            resizingRef.current = false;
          }, 100);
        }}
      >
        <th
          {...rest}
          onClick={(...args) => {
            if (!resizingRef.current && onClick) {
              onClick(...args);
            }
          }}
        />
      </Resizable>
    );
  }

  return <th {...rest} />;
};

export default (props) => {
  const { header, columns, components, className, ...rest } = useNormalizedProps(props);

  const [columnWidthStorage, setColumnWidthStorage] = useState({});

  const newColumns = columns.map((column, index) => {
    return {
      ...column,
      width: columnWidthStorage[index] || column.width,
      onHeaderCell: (item) => ({
        resizable: item.resizable,
        minWidth: item.minWidth,

        width: item.width,
        onResize: (e, { size }) => {
          setColumnWidthStorage({
            ...columnWidthStorage,
            [index]: size.width,
          });
        },
      }),
    };
  });

  return (
    <ConfigProvider>
      <div style={{ textAlign: 'right' }}>{header}</div>
      <Table
        className={classNames(styles.main, className)}
        columns={newColumns}
        components={{
          ...components,
          header: {
            cell: ResizableCell,
          },
        }}
        {...rest}
      />
    </ConfigProvider>
  );
};
