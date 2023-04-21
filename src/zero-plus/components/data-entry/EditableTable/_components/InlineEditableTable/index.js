import React from 'react';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';
import { formatMessage } from '@umijs/max';
import Table from '../../../../tables/Table';
import Icon from '../../../../Icon';
import Form from '../../../../forms/Form';
import useExpandable from '../_hooks/useExpandable';
import useNormalizedProps from '../_hooks/useNormalizedProps';
import { immerLoop } from '../../../../../utils/loop';
import styles from './index.less';

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

    renderCreateAction = ({ config }) => (
      <Button {...config} style={{ width: '100%' }} type="dashed" icon={<PlusOutlined />}>
        {formatMessage({ id: '新增' })}
      </Button>
    ),
    renderAppendAction = ({ config, record }) => {
      if (record.data_status === 'close') {
        return (
          <a>
            <PlusOutlined style={{ color: '#00000040' }} />
          </a>
        );
      }
      if (record.data_status === 'editing') {
        return null;
      }
      return (
        <a {...config}>
          <PlusOutlined />
        </a>
      );
    },
    renderUpdateAction = ({ config, record }) => {
      if (record.data_status === 'close') {
        return (
          <a>
            <Icon type="icon-xiugai07" style={{ color: '#00000040' }} />
          </a>
        );
      }
      if (record.data_status === 'editing') {
        return (
          <a {...config}>
            <Icon type="icon-baocun" />
          </a>
        );
      }
      return (
        <a {...config}>
          <Icon type="icon-xiugai07" />
        </a>
      );
    },
    renderDeleteAction = ({ config, record }) => {
      if (record.data_status === 'close') {
        return (
          <a>
            <Icon type="icon-shanchu2" style={{ color: '#00000040' }} />
          </a>
        );
      }
      if (record.data_status === 'editing') {
        return (
          <a {...config}>
            <RollbackOutlined />
          </a>
        );
      }
      return (
        <Popconfirm {...config}>
          <a>
            <Icon type="icon-shanchu2" />
          </a>
        </Popconfirm>
      );
    },

    initialData,

    renderProps = () => {
      return {};
    },

    logicalDeletion = false,

    ...rest
  } = useExpandable(useNormalizedProps(props));

  const getIsEditing = (items) => {
    if (items?.length) {
      return items.some(
        (item) => item.data_status === 'editing' || getIsEditing(item[childrenColumnName]),
      );
    }
    return false;
  };
  const isEditing = getIsEditing(value);

  return (
    <div className={styles.wrapper}>
      <Form
        component={false}
        renderChildren={({ form, submit }) => (
          <Table
            {...renderHeaderAndFooter({
              value,
              onChange,

              disabled,
              isEditing,
              actions: [
                renderCreateAction({
                  config: {
                    disabled: isEditing,

                    onClick: () => {
                      onChange(
                        immerLoop({
                          array: value,
                          callback: ({ item }) => {
                            item.data_status = 'close';
                          },
                          childrenKey: childrenColumnName,
                        }).concat({
                          key: `key_${Date.now()}`,
                          data_status: 'editing',
                          data_unsaved: true,
                        }),
                      );

                      if (initialData) {
                        form.setInitialValues(initialData);
                      } else {
                        form.resetFields();
                      }
                    },
                  },

                  value,
                }),
              ],
            })}
            {...rest}
            columns={renderColumns({
              value,
              onChange,

              disabled,
              isEditing,
              columns,
              getActions: (record) => {
                return [
                  renderAppendAction({
                    config: {
                      onClick: () => {
                        const finalRecord = {
                          key: `key_${Date.now()}`,
                          parentKey: record.key,
                        };

                        onChange(
                          immerLoop({
                            array: value,
                            callback: ({ item }) => {
                              if (item.key === record.key) {
                                item.data_status = 'close';

                                if (item[childrenColumnName]) {
                                  item[childrenColumnName].push(finalRecord);
                                } else {
                                  item[childrenColumnName] = [finalRecord];
                                }
                              } else if (item.key === finalRecord.key) {
                                item.data_status = 'editing';
                                item.data_unsaved = true;
                              } else {
                                item.data_status = 'close';
                              }
                            },
                            childrenKey: childrenColumnName,
                          }),
                        );

                        if (afterAppend) {
                          afterAppend({
                            record,
                          });
                        }

                        if (initialData) {
                          form.setInitialValues(initialData);
                        } else {
                          form.resetFields();
                        }
                      },
                    },

                    record,
                    value,
                  }),
                  renderUpdateAction({
                    config:
                      record.data_status === 'editing'
                        ? {
                            onClick: () => {
                              submit({
                                record,
                              });
                            },
                          }
                        : {
                            onClick: () => {
                              onChange(
                                immerLoop({
                                  array: value,
                                  callback: ({ item }) => {
                                    if (item.key === record.key) {
                                      item.data_status = 'editing';
                                    } else {
                                      item.data_status = 'close';
                                    }
                                  },
                                  childrenKey: childrenColumnName,
                                }),
                              );

                              form.setInitialValues(record);
                            },
                          },

                    record,
                    value,
                  }),
                  renderDeleteAction({
                    config:
                      record.data_status === 'editing'
                        ? {
                            onClick: () => {
                              if (record.data_unsaved) {
                                onChange(
                                  immerLoop({
                                    array: value,
                                    callback: ({ item, array, index }) => {
                                      if (item.key === record.key) {
                                        array.splice(index, 1);
                                        return 'continue';
                                      }
                                      item.data_status = 'open';
                                      return false;
                                    },
                                    childrenKey: childrenColumnName,
                                  }),
                                );
                              } else {
                                onChange(
                                  immerLoop({
                                    array: value,
                                    callback: ({ item }) => {
                                      item.data_status = 'open';
                                    },
                                    childrenKey: childrenColumnName,
                                  }),
                                );
                              }
                            },
                          }
                        : {
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
          />
        )}
        onSubmit={(newRecord, { success }, { record }) => {
          const finalRecord = {
            ...record,
            ...newRecord,
          };

          if (finalRecord.data_unsaved) {
            new Promise((resolve, reject) => {
              beforeCreate({ resolve, reject, record: finalRecord, value });
            }).then(() => {
              onChange(
                immerLoop({
                  array: value,
                  callback: ({ item, array, index }) => {
                    if (item.key === finalRecord.key) {
                      array[index] = {
                        ...item,
                        ...newRecord,
                        data_status: 'open',
                        data_unsaved: false,
                      };
                    } else {
                      item.data_status = 'open';
                    }
                  },
                  childrenKey: childrenColumnName,
                }),
              );
              success();
            });
          } else {
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
                        data_status: 'open',
                        data_unsaved: false,
                      };
                    } else {
                      item.data_status = 'open';
                    }
                  },
                  childrenKey: childrenColumnName,
                }),
              );
              success();
            });
          }
        }}
        {...renderProps({ value, onChange })}
      />
    </div>
  );
};
