import React, { useRef } from 'react';
import { message, Table } from 'antd';
import { formatMessage } from '@umijs/max';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { immerLoop } from '../../../../../utils/loop';
import styles from './index.less';

const getLevelFromClassName = (className) => {
  if (className) {
    return className.match(/(?<=row-level-).*?(?=$|\s)/g)?.[0];
  }
  return null;
};

const SortableList = SortableContainer((props) => <tbody {...props} />);
const SortableItem = SortableElement((props) => <tr {...props} />);

export default (props) => {
  const {
    childrenColumnName,

    columns,
    dataSource,
    rowKey,
    onRow = () => {
      return {};
    },
    components,
    onSortChange = (newDataSource) => {
      console.log('onSortChange', newDataSource);
    },
    onError = () => {
      message.error({
        content: formatMessage({ id: '操作失败' }),
      });
    },
    ...rest
  } = props;

  const rowsRef = useRef([]);

  const ySortStartRef = useRef(0);

  return (
    <Table
      {...rest}
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      onRow={(record, index) => {
        return {
          className: styles.defaultCursor,
          ...onRow(record, index),
          record,
          index,
        };
      }}
      components={{
        ...components,
        body: {
          wrapper: (params) => {
            rowsRef.current = [];
            return (
              <SortableList
                {...params}
                helperClass={styles['row-dragging']}
                onSortStart={(_, e) => {
                  ySortStartRef.current = e.y;
                }}
                onSortEnd={({ oldIndex, newIndex }, e) => {
                  const rows = rowsRef.current;
                  const oldRow = rows[oldIndex];
                  const newRow = rows[newIndex];

                  if (oldRow.key !== newRow.key) {
                    const ySortStart = ySortStartRef.current;
                    const ySortEnd = e.y;

                    const position = ySortEnd > ySortStart ? '向下插入' : '向上插入';

                    let canMove = false;

                    const newDataSource = immerLoop({
                      array: dataSource,
                      callback: ({ item, array, index }) => {
                        if (rowKey(item) === oldRow.key) {
                          if (array.length > 1) {
                            array.splice(index, 1);
                            canMove = true;
                          } else {
                            onError();
                          }
                        }
                      },
                      childrenKey: childrenColumnName,
                    });

                    if (canMove) {
                      const finalDataSource = immerLoop({
                        array: newDataSource,
                        callback: ({ item, array, index }) => {
                          if (rowKey(item) === newRow.key) {
                            if (position === '向下插入') {
                              array.splice(index + 1, 0, oldRow.record);
                            } else {
                              array.splice(index, 0, oldRow.record);
                            }
                            return 'break';
                          }
                          return false;
                        },
                        childrenKey: childrenColumnName,
                      });

                      onSortChange(finalDataSource);
                    }
                  }
                }}
              />
            );
          },
          row: ({ record, index, ...params }) => {
            if (record) {
              const { className, 'data-row-key': key } = params;
              const level = getLevelFromClassName(className);
              rowsRef.current[index] = {
                level,
                key,
                record,
              };
              return <SortableItem {...params} index={index} collection={level} />;
            }
            return <tr {...params} />;
          },
        },
      }}
    />
  );
};
