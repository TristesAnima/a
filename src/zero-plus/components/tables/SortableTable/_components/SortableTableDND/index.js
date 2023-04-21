import React, { useRef } from 'react';
import { message, Table } from 'antd';
import { formatMessage } from '@umijs/max';
import classNames from 'classnames';
import DndProvider from '../../../../react-dnd/DndProvider';
import DndDragItem from '../../../../react-dnd/DndDragItem';
import DndDropZone from '../../../../react-dnd/DndDropZone';
import { immerLoop } from '../../../../../utils/loop';
import styles from './index.less';

const getLevelFromClassName = (className) => {
  if (className) {
    return className.match(/(?<=row-level-).*?(?=$|\s)/g)?.[0];
  }
  return null;
};

const SortableItem = (props) => {
  const { index: currentIndex, collection, className, onSortEnd, ...rest } = props;

  const ref = useRef();

  return (
    <DndDropZone
      accept={[`表格行拖拽-${collection}`]}
      collect={(monitor) => {
        const { dragIndex } = monitor.getItem() || {};
        if (dragIndex === currentIndex) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          positionClassName:
            currentIndex > dragIndex ? styles['drop-over-downward'] : styles['drop-over-upward'],
        };
      }}
      drop={(item) => {
        if (onSortEnd) {
          onSortEnd({
            dragItemIndex: item.dragIndex,
            dropZoneIndex: currentIndex,
          });
        }
      }}
      renderChildren={({ dropTargetRef, dropCollectedProps }) => {
        return (
          <DndDragItem
            type={`表格行拖拽-${collection}`}
            data={{ dragIndex: currentIndex }}
            renderChildren={({ dragSourceRef }) => {
              dropTargetRef(dragSourceRef(ref));

              return (
                <tr
                  ref={ref}
                  className={classNames(className, {
                    [dropCollectedProps.positionClassName]: dropCollectedProps.isOver,
                  })}
                  {...rest}
                />
              );
            }}
          />
        );
      }}
    />
  );
};

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

  return (
    <DndProvider>
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
            row: ({ record, index, ...params }) => {
              if (record) {
                const { className, 'data-row-key': key } = params;
                const level = getLevelFromClassName(className);
                rowsRef.current[index] = {
                  level,
                  key,
                  record,
                };

                return (
                  <SortableItem
                    {...params}
                    index={index}
                    collection={level}
                    onSortEnd={({ dragItemIndex, dropZoneIndex }) => {
                      const rows = rowsRef.current;
                      const dragItem = rows[dragItemIndex];
                      const dropZone = rows[dropZoneIndex];

                      if (dragItem.key !== dropZone.key) {
                        const position = dropZoneIndex > dragItemIndex ? '向下插入' : '向上插入';

                        let canMove = false;

                        const newDataSource = immerLoop({
                          array: dataSource,
                          callback: ({ item, array, index: itemIndex }) => {
                            if (rowKey(item) === dragItem.key) {
                              if (array.length > 1) {
                                array.splice(itemIndex, 1);
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
                            callback: ({ item, array, index: itemIndex }) => {
                              if (rowKey(item) === dropZone.key) {
                                if (position === '向下插入') {
                                  array.splice(itemIndex + 1, 0, dragItem.record);
                                } else {
                                  array.splice(itemIndex, 0, dragItem.record);
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
              }
              return <tr {...params} />;
            },
          },
        }}
      />
    </DndProvider>
  );
};
