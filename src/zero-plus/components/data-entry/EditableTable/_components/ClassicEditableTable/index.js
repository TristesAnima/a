import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Form } from 'antd';
import { formatMessage } from '@umijs/max';
import Table from '../../../../tables/Table';
import Icon from '../../../../Icon';
import DMForm from '../../../../forms/DMForm';
import useExpandable from '../_hooks/useExpandable';
import useNormalizedProps from '../_hooks/useNormalizedProps';
import { immerLoop } from '../../../../../utils/loop';

const renderDMForm = ({ config }) => (
  <DMForm {...config}>
    <Form.Item label="姓名" name="name">
      <Input />
    </Form.Item>
  </DMForm>
);

export default (props) => {
  const {
    renderHeaderAndFooter = ({ disabled, actions }) => {
      if (disabled) {
        return {
          header: undefined,
          footer: undefined,
        };
      }
      return {
        header: undefined,
        footer: actions[0],
      };
    },
    renderColumns = ({ disabled, columns, getActions }) => {
      if (disabled) {
        return columns;
      }

      return columns.concat({
        title: formatMessage({ id: '操作' }),
        render: (record) => {
          const actions = getActions(record);

          return (
            <Space>
              {actions[1]}
              {actions[2]}
            </Space>
          );
        },
      });
    },

    // eslint-disable-next-line
    beforeCreate = ({ resolve, reject, record, value }) => {
      resolve();
    },
    // eslint-disable-next-line
    beforeUpdate = ({ resolve, reject, record, value }) => {
      resolve();
    },
    // eslint-disable-next-line
    beforeDelete = ({ resolve, reject, record, value }) => {
      resolve();
    },

    afterAppend,

    disabled = false,

    childrenColumnName,

    columns,
    value,
    onChange,

    onTableChange,

    renderCreateAction = renderDMForm,
    renderAppendAction = renderDMForm,
    renderUpdateAction = renderDMForm,
    renderDeleteAction = ({ config }) => (
      <Popconfirm {...config}>
        <a>
          <Icon type="icon-shanchu2" />
        </a>
      </Popconfirm>
    ),

    renderProps = () => {
      return {};
    },

    logicalDeletion = false,

    ...rest
  } = useExpandable(useNormalizedProps(props));

  return (
    <Table
      {...renderHeaderAndFooter({
        value,
        onChange,

        disabled,
        actions: [
          renderCreateAction({
            config: {
              component: false,
              type: 'Drawer',
              title: formatMessage({ id: '新增' }),
              trigger: (
                <Button style={{ width: '100%' }} type="dashed" icon={<PlusOutlined />}>
                  {formatMessage({ id: '新增' })}
                </Button>
              ),
              onSubmit: (newRecord, { success }) => {
                const finalRecord = {
                  key: `key_${Date.now()}`,
                  ...newRecord,
                };

                new Promise((resolve, reject) => {
                  beforeCreate({ resolve, reject, record: finalRecord, value });
                }).then(() => {
                  onChange(value.concat(finalRecord));
                  success();
                });
              },
            },

            type: 'Create',

            value,
          }),
        ],
      })}
      {...rest}
      columns={renderColumns({
        value,
        onChange,

        disabled,
        columns,
        getActions: (record) => {
          return [
            renderAppendAction({
              config: {
                component: false,
                type: 'Drawer',
                title: formatMessage({ id: '新增' }),
                trigger: (
                  <a>
                    <PlusOutlined />
                  </a>
                ),
                onSubmit: (newRecord, { success }) => {
                  const finalRecord = {
                    key: `key_${Date.now()}`,
                    parentKey: record.key,
                    ...newRecord,
                  };

                  new Promise((resolve, reject) => {
                    beforeCreate({
                      resolve,
                      reject,
                      record: finalRecord,
                      value,
                    });
                  }).then(() => {
                    onChange(
                      immerLoop({
                        array: value,
                        callback: ({ item }) => {
                          if (item.key === record.key) {
                            if (item[childrenColumnName]) {
                              item[childrenColumnName].push(finalRecord);
                            } else {
                              item[childrenColumnName] = [finalRecord];
                            }
                            return 'break';
                          }
                          return false;
                        },
                        childrenKey: childrenColumnName,
                      }),
                    );

                    if (afterAppend) {
                      afterAppend({
                        record,
                      });
                    }

                    success();
                  });
                },
              },

              record,
              value,
            }),
            renderUpdateAction({
              config: {
                component: false,
                type: 'Drawer',
                title: formatMessage({ id: '修改' }),
                trigger: (
                  <a>
                    <Icon type="icon-xiugai07" />
                  </a>
                ),
                requestInitialValues: ({ resolve }) => {
                  resolve(record);
                },
                onSubmit: (newRecord, { success }) => {
                  const finalRecord = {
                    ...record,
                    ...newRecord,
                  };

                  new Promise((resolve, reject) => {
                    beforeUpdate({
                      resolve,
                      reject,
                      record: finalRecord,
                      value,
                    });
                  }).then(() => {
                    onChange(
                      immerLoop({
                        array: value,
                        callback: ({ item, array, index }) => {
                          if (item.key === finalRecord.key) {
                            array[index] = {
                              ...item,
                              ...newRecord,
                            };
                            return 'break';
                          }
                          return false;
                        },
                        childrenKey: childrenColumnName,
                      }),
                    );
                    success();
                  });
                },
              },

              record,
              value,
            }),
            renderDeleteAction({
              config: {
                title: formatMessage({ id: '删除提示' }),
                onConfirm: () => {
                  new Promise((resolve, reject) => {
                    beforeDelete({ resolve, reject, record, value });
                  }).then(() => {
                    onChange(
                      immerLoop({
                        array: value,
                        callback: ({ item, array, index }) => {
                          if (item.key === record.key) {
                            if (logicalDeletion) {
                              array[index] = {
                                ...item,
                                data_deleted: true,
                              };
                            } else {
                              array.splice(index, 1);
                            }
                            return 'break';
                          }
                          return false;
                        },
                        childrenKey: childrenColumnName,
                      }),
                    );
                  });
                },
              },

              record,
              value,
            }),
          ];
        },
      })}
      onChange={onTableChange}
      {...renderProps({ value, onChange })}
    />
  );
};
