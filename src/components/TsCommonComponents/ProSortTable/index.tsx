import React, { useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import type { SortableContainerProps } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import type { ProTableProps } from '@ant-design/pro-components';
import { arrayMoveImmutable } from '@/utils/Independent';
import styles from './index.less';

const DragHandle = SortableHandle(() => (
  <div style={{ cursor: 'grab', color: '#999' }}>
    <MenuOutlined />
  </div>
));

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortContainer = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

type Props = ProTableProps<any, any> & {
  onSortEnd: ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => void;
};

function Index(props: Props) {
  const { rowKey, columns = [], dataSource: rawDataSource = [], onSortEnd, ...restProps } = props;
  const [dataSource, setDataSource] = useState(rawDataSource);

  useEffect(() => {
    setDataSource(rawDataSource);
  }, [rawDataSource]);

  const onSortEndPro = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable([...dataSource], oldIndex, newIndex).filter((el) => !!el);
      setDataSource([...newData]);
      onSortEnd({ oldIndex, newIndex });
    }
  };

  const DraggableContainer = (p: SortableContainerProps) => (
    <SortContainer
      useDragHandle
      disableAutoscroll
      helperClass={styles['row-dragging']}
      onSortEnd={onSortEndPro}
      {...p}
    />
  );

  const DraggableBodyRow = (p: any) => {
    const { className, style, ...rest } = p;
    const index = dataSource.findIndex((x) => {
      if (!rowKey) {
        return false;
      }
      return (typeof rowKey === 'function' ? x[rowKey(x)] : x[rowKey]) === rest['data-row-key'];
    });
    return <SortableItem index={index} {...rest} />;
  };

  return (
    <ProTable
      columns={[
        {
          dataIndex: 'sort',
          width: 60,
          className: 'drag-visible',
          hideInSearch: true,
          align: 'center',
          render: () => <DragHandle />,
        },
        ...columns,
      ]}
      rowKey={rowKey}
      pagination={false}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
      dataSource={dataSource}
      {...restProps}
    />
  );
}

Index.displayName = 'ProSortTable';

export default Index;
