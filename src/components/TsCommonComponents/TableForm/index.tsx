import React, { useMemo, useState } from 'react';
import type { TableProps, TableColumnProps } from 'antd';
import type { FormItemsType } from '@/components/TsCommonComponents/ProFormItems';
import type { DrawerFormProps, ModalFormProps, ProFormInstance } from '@ant-design/pro-components';
import type { Noop } from '@/typings/api';
import { compact, forEach, isFunction, omit } from 'lodash';
import { arrayMoveImmutable, isTruth } from '@/utils/Independent';
import { useIntl } from '@umijs/max';
import moment from 'moment';
import { Button, Col, ConfigProvider, Popconfirm, Space, Table, Row, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import type { ColumnsType } from 'antd/es/table';
import DrawerForm from '../DrawerForm';
import ModalForm from '../ModalForm';
import styles from './index.less';

const { Text } = Typography;

type OnChangeType<T> = (value: T[]) => void;

type Props<T> = Omit<TableProps<T>, 'rowKey'> & {
  rowKey: string;
  id?: string;
  value: T[];
  onChange: OnChangeType<T>;
  formItems: (row: T, form: ProFormInstance | undefined, index: number) => FormItemsType;
  editElementType?: 'Drawer' | 'Modal';
  natureSave?: boolean;
  disabled?: boolean;
  editElementProps?: DrawerFormProps | ModalFormProps;
  // 是否支持排序，如果是表格为嵌套数组，则需要把value进行setDataLevel转换
  isSort?: boolean;
  sortColumnProps?: TableColumnProps<T>;
  isAdd?: boolean;
  isAddChild?: boolean | ((row: T, index: number) => boolean);
  isEdit?: boolean | ((row: T, index: number) => boolean);
  isDelete?: boolean | ((row: T, index: number) => boolean);
  interceptDelete: (value: T[], row: T, onChange: OnChangeType<T>, index: number) => void;
  initialValue?: ((value: T[]) => T) | T;
  initialChildValue?: ((value: T[], row: T) => T) | T;
  toolBarRender?: (add: (row: T) => void) => React.ReactNode[];
  deleteWrapper?: (deleteFN: () => void, row: T, index: number) => React.ReactNode;
  addWrapper?: (add: (row: T) => void, value: T[], onChange: OnChangeType<T>) => React.ReactNode;
  optionProps?: TableColumnProps<T>;
  optionsExt?: (row: T, value: T[], onChange: OnChangeType<T>) => React.ReactElement[];
  onAdd?: Noop;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onSort?: (newValue: T[]) => void;
  onOk?: (newRow: T, row: T, close: () => void, form: ProFormInstance | undefined) => void;
  onCancel?: (row: T, value: T[]) => void;
};

const actionStyle = {
  fontSize: 16,
};

function findIndexInTable(
  value: any[] = [],
  rowKey: string,
  key: string
): { index: number; level: number } {
  let index = -1;
  let level = 0;
  forEach(value, (item, i) => {
    const { [rowKey]: itemKey, children, level: l } = item;
    if (itemKey === key) {
      index = i;
      level = l;
      return false;
    }
    if (!children) {
      return true;
    }
    const { index: childrenIndex, level: childrenLevel } = findIndexInTable(children, rowKey, key);
    if (childrenIndex > -1) {
      index = childrenIndex;
      level = childrenLevel;
      return false;
    }
    return true;
  });
  return {
    index,
    level,
  };
}

function getSortData<T extends { level: number; children: T[] }>(
  dataSource: T[] = [],
  { oldIndex, newIndex, collection }: Pick<SortEnd, 'oldIndex' | 'newIndex' | 'collection'>
): T[] {
  const isCurrent = dataSource.some((item) => item.level === collection);
  if (isCurrent) {
    return arrayMoveImmutable([...dataSource], oldIndex, newIndex).filter((el) => !!el);
  }
  return dataSource.map((item) => {
    const { children } = item;
    if (!children) {
      return item;
    }
    return {
      ...item,
      children: getSortData<T>(children, { oldIndex, newIndex, collection }),
    };
  });
}

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

function Index<T extends Record<string, any> = Record<string, any>>(props: Props<T>) {
  const {
    id,
    value,
    formItems,
    natureSave = false,
    editElementType = 'Drawer',
    disabled = false,
    editElementProps = {},
    rowKey,
    onChange,
    columns = [],
    dataSource,
    isSort = false,
    sortColumnProps = {},
    isAdd = true,
    isAddChild = false,
    isEdit = true,
    isDelete = true,
    interceptDelete,
    initialValue = {},
    initialChildValue,
    toolBarRender,
    deleteWrapper,
    addWrapper,
    optionProps = {},
    optionsExt,
    onAdd,
    onEdit,
    onSort,
    onDelete,
    onOk,
    onCancel,
    ...extTableProps
  } = props;
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<T>({} as T);

  const onOkPro = (newRecord: any, close: () => void, form: ProFormInstance | undefined) => {
    if (!onOk) {
      return;
    }
    onOk(
      { ...editRecord, ...(newRecord as T) },
      editRecord,
      () => {
        setVisible(false);
        close();
        const { [rowKey]: key } = editRecord || ({} as T);
        setEditRecord({} as T);
        if (!natureSave) {
          return;
        }
        if (isTruth(key) && value?.some((item) => item[rowKey] === key)) {
          // 修改
          onChange(
            value?.map((item) => {
              if (item[rowKey] === key) {
                return { ...item, ...newRecord };
              }
              return item;
            })
          );
        } else {
          // 添加
          onChange([...(value || []), { [rowKey]: -+moment(), ...editRecord, ...newRecord }]);
        }
      },
      form
    );
  };

  const onCancelPro = () => {
    setVisible(false);
    setEditRecord({} as T);
    if (onCancel) {
      onCancel(editRecord, value);
    }
  };

  const addRecord = (newRecord: T = {} as T) => {
    setVisible(true);
    setEditRecord({
      ...(isFunction(initialValue) ? initialValue(value) : initialValue),
      ...newRecord,
    });
    if (onAdd) {
      onAdd();
    }
  };

  const toolBar = useMemo(() => toolBarRender?.(addRecord) || [], [toolBarRender]);

  const deleteRecord = (record: T, index: number) => {
    if (natureSave) {
      if (interceptDelete) {
        interceptDelete(value, record, onChange, index);
      } else {
        onChange(value?.filter((item) => item[rowKey] !== record[rowKey]));
      }
    }
    if (onDelete) {
      onDelete(record);
    }
  };

  const onSortEndPro = ({ oldIndex, newIndex, collection }: SortEnd) => {
    if (!onSort) {
      return;
    }
    if (oldIndex !== newIndex) {
      // @ts-ignore
      const newData = getSortData<T>(value, {
        oldIndex,
        newIndex,
        collection,
      });
      if (onChange) {
        onChange([...newData]);
      }
      if (onSort) {
        onSort([...newData]);
      }
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
    const { index, level } = findIndexInTable(value, 'id', rest['data-row-key']);
    return <SortableItem index={index} {...rest} collection={level} />;
  };

  const columnsPlus: ColumnsType<any> = disabled
    ? columns
    : compact([
        isSort && {
          dataIndex: 'sort',
          width: 60,
          className: styles['drag-visible'],
          align: 'center',
          render: () => <DragHandle />,
          ...sortColumnProps,
        },
        ...columns,
        {
          title: formatMessage({ id: '操作' }),
          dataIndex: 'operation',
          width: 80,
          render: (_text, record, index) => {
            const isEditPlus = typeof isEdit === 'function' ? isEdit(record, index) : isEdit;
            const isDeletePlus =
              typeof isDelete === 'function' ? isDelete(record, index) : isDelete;
            const isAddChildPlus =
              typeof isAddChild === 'function' ? isAddChild(record, index) : isAddChild;
            return (
              <>
                <Space>
                  {isEditPlus && (
                    <a
                      title={formatMessage({ id: '编辑' })}
                      style={actionStyle}
                      onClick={() => {
                        if (editRecord?.[rowKey] !== record[rowKey]) {
                          setEditRecord(record);
                          setVisible(true);
                          if (onEdit) {
                            onEdit(record);
                          }
                        }
                      }}
                    >
                      <EditOutlined />
                    </a>
                  )}
                  {isAddChildPlus && (
                    <a
                      title={formatMessage({ id: '添加' })}
                      style={actionStyle}
                      onClick={() => {
                        addRecord(
                          isFunction(initialChildValue)
                            ? initialChildValue(value, record)
                            : initialChildValue
                        );
                      }}
                    >
                      <PlusOutlined />
                    </a>
                  )}
                  {isDeletePlus &&
                    (deleteWrapper?.(() => deleteRecord(record, index), record, index) || (
                      <Popconfirm
                        title={formatMessage({ id: '删除提示' })}
                        onConfirm={() => deleteRecord(record, index)}
                      >
                        <a title={formatMessage({ id: '删除' })} style={actionStyle}>
                          <DeleteOutlined />
                        </a>
                      </Popconfirm>
                    ))}
                  {optionsExt?.(record, value, onChange).map((item, i) =>
                    React.cloneElement(item, {
                      key: `${-i - 1}`,
                    })
                  )}
                </Space>
              </>
            );
          },
          ...optionProps,
        },
      ]);

  const getEditComponent = () => {
    const index = value?.findIndex((item) => item[rowKey] === editRecord?.[rowKey]);
    if (editElementType === 'Drawer') {
      return (
        <DrawerForm
          {...omit(editElementProps, ['children'])}
          title={
            editRecord?.[rowKey] ? formatMessage({ id: '编辑' }) : formatMessage({ id: '新增' })
          }
          visible={visible}
          formItems={(form) => formItems(editRecord, form, index)}
          initialValues={editRecord}
          okText={formatMessage({ id: '保存' })}
          onOk={onOkPro}
          onCancel={onCancelPro}
        />
      );
    }
    if (editElementType === 'Modal') {
      return (
        <ModalForm
          {...omit(editElementProps, ['children'])}
          title={
            editRecord?.[rowKey] ? formatMessage({ id: '编辑' }) : formatMessage({ id: '新增' })
          }
          okText={formatMessage({ id: '保存' })}
          visible={visible}
          formItems={(form) => formItems(editRecord, form, index)}
          initialValues={editRecord}
          onOk={onOkPro}
          onCancel={onCancelPro}
        />
      );
    }
    return null;
  };

  const getEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <Text disabled>{formatMessage({ id: '暂无数据' })}</Text>
    </div>
  );

  const sortProps = {
    components: {
      body: {
        wrapper: DraggableContainer,
        row: DraggableBodyRow,
      },
    },
  };

  return (
    <>
      {getEditComponent()}
      <ConfigProvider renderEmpty={() => getEmpty()}>
        <Row id={id} gutter={[8, 16]}>
          <Col span={toolBar.length ? 24 : 0}>
            <Row justify="end">
              <Col>
                <Space>{toolBar.map((item) => item)}</Space>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              rowKey={rowKey}
              columns={columnsPlus}
              dataSource={value}
              pagination={false}
              size="small"
              {...(isSort ? sortProps : {})}
              {...extTableProps}
            />
          </Col>
          <Col span={24}>
            {!disabled &&
              isAdd &&
              (addWrapper?.(addRecord, value, onChange) || (
                <Button
                  block
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    addRecord();
                  }}
                >
                  {formatMessage({ id: '添加一行数据' })}
                </Button>
              ))}
          </Col>
        </Row>
      </ConfigProvider>
    </>
  );
}

// Index.displayName = 'TableForm';

export default Index;
