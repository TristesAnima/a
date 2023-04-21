import { CloseOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import React, { useState } from 'react';
import type { MyEditableProTableProps } from './index.d';

/**
 * 复杂数据结构根据`id`进行删除 复杂简单都适用
 */
const filterById = (arr: readonly any[], id: number) => {
  return arr.filter((item) => {
    if (item.id === id) {
      return false;
    } else if (Array.isArray(item.children)) {
      const filterArray = filterById(item.children, id);
      item.children = filterArray.length ? filterArray : null;
    }
    return true;
  });
};

function Index<T extends Record<string, any>, U extends object>(
  props: MyEditableProTableProps<T, U>
) {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const {
    disabled = false,
    isEdit = true,
    isDelete = true,
    value = [],
    columns = [],
    editable = {},
    optionsColumnConfig = {},
    recordCreatorProps = {},
    optionsColumnExt = () => [],
    onChange,
    ...rest
  } = props;

  return (
    <>
      <EditableProTable<T, U>
        rowKey="id"
        columnEmptyText={false}
        value={value}
        onChange={onChange}
        columns={
          disabled
            ? columns
            : [
                ...columns,
                {
                  title: '操作',
                  valueType: 'option',
                  width: 60,
                  ...optionsColumnConfig,
                  render: (text, record, index, action) => [
                    isEdit && (
                      <a
                        key="edit"
                        onClick={() => {
                          action?.startEditable?.(record.id);
                        }}
                      >
                        <EditOutlined />
                      </a>
                    ),
                    isDelete && (
                      <Popconfirm
                        key="deleteTip"
                        title="删除提示"
                        placement="topRight"
                        onConfirm={() => {
                          onChange!(filterById(value, record.id));
                        }}
                      >
                        <a key="delete">
                          <DeleteOutlined />
                        </a>
                      </Popconfirm>
                    ),
                    ...optionsColumnExt(text, record, index, action),
                  ],
                },
              ]
        }
        recordCreatorProps={
          !!recordCreatorProps && {
            record: () => ({ id: Date.now() } as unknown as T),
            ...recordCreatorProps,
          }
        }
        editable={{
          type: 'single',
          editableKeys: editableKeys,
          onChange: setEditableRowKeys,
          saveText: <SaveOutlined />,
          cancelText: <CloseOutlined />,
          actionRender: (row, config, { save, cancel }) => [save, cancel],
          ...editable,
        }}
        {...rest}
      />
    </>
  );
}

export default Index;
