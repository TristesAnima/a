import { ArrayTableDelete, DrawerFormily } from '@/components/Independent';
import { useMessage } from '@/hooks/Independent';
import { useProjectDict } from '@/hooks/Project';
import { saveSponsor, validateSponsor } from '@/services/sponsor';
import { ArrayTable, FormGrid, FormItem, FormLayout, Input, Select } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import { useIntl } from '@umijs/max';
import { noop } from 'lodash';
import * as PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

const defaultProps = {
  onOk: noop,
  onCancel: noop,
};

const SchemaFiled = createSchemaField({
  components: {
    Input,
    Select,
    FormLayout,
    FormGrid,
    FormItem,
    ArrayTable,
    ArrayTableDelete,
  },
});

const Index = (props) => {
  const { children, title, data, onOk, onCancel } = props;
  const { formatMessage } = useIntl();
  const messagePro = useMessage();
  const { country: { list: countryList = [] } = {} } = useProjectDict();

  const save = async (newData, form) => {
    const params = { id: 0, ...data, ...newData };
    const validateResult = await validateSponsor(params);
    if (!validateResult.success) {
      messagePro({
        success: false,
      });
      return Promise.reject();
    }
    if (validateResult.data?.labelName) {
      const filedConfig = {
        412: {
          name: 'name',
          label: formatMessage({ id: 'sponsor.公司名称' }),
        },
        413: {
          name: 'nameEn',
          label: `${formatMessage({ id: 'sponsor.公司名称' })}（EN）`,
        },
      };
      const {
        [validateResult.data.labelName]: { name, label },
      } = filedConfig;
      form
        .query(name)
        .take(0)
        .setSelfErrors(formatMessage({ id: '不允许重复提示' }, { text: label }));
      return Promise.reject();
    }
    const saveResult = await saveSponsor(params);
    messagePro({
      response: saveResult,
      mode: 'save',
      onSuccess: () => {
        onOk();
      },
    });
    return Promise.resolve();
  };

  return (
    <DrawerFormily
      id={data.id || 'add'}
      title={title}
      width={800}
      initialValues={data}
      okText={formatMessage({ id: '保存' })}
      onOk={(...args) => save(...args)}
      onCancel={onCancel}
      renderFormContent={(form) => (
        <SchemaFiled
          schema={{
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  layout: 'vertical',
                  colon: false,
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-component-props': {
                      maxColumns: 2,
                    },
                    properties: {
                      name: {
                        type: 'string',
                        title: formatMessage({ id: 'sponsor.公司名称' }),
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请输入' }),
                        },
                        'x-validator': [
                          {
                            required: true,
                            message: formatMessage({ id: '此项为必填项' }),
                          },
                          {
                            max: 120,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 120 }),
                          },
                        ],
                      },
                      nameEn: {
                        type: 'string',
                        title: `${formatMessage({ id: 'sponsor.公司名称' })}（EN）`,
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请输入' }),
                        },
                        'x-validator': [
                          {
                            required: true,
                            message: formatMessage({ id: '此项为必填项' }),
                          },
                          {
                            max: 120,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 120 }),
                          },
                        ],
                      },
                      representNameSpeel: {
                        type: 'string',
                        title: formatMessage({ id: 'sponsor.申办方拼音' }),
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请输入' }),
                        },
                        'x-validator': [
                          {
                            required: true,
                            message: formatMessage({ id: '此项为必填项' }),
                          },
                          {
                            max: 60,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 60 }),
                          },
                        ],
                      },
                      address1: {
                        type: 'string',
                        title: formatMessage({ id: 'site.所在地１' }),
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请输入' }),
                        },
                        'x-validator': [
                          {
                            max: 120,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 120 }),
                          },
                        ],
                      },
                      addressEn1: {
                        type: 'string',
                        title: `${formatMessage({ id: 'site.所在地１' })}（EN）`,
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请输入' }),
                        },
                        'x-validator': [
                          {
                            max: 120,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 120 }),
                          },
                        ],
                      },
                      address2: {
                        type: 'string',
                        title: formatMessage({ id: 'site.所在地2' }),
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请输入' }),
                        },
                        'x-validator': [
                          {
                            max: 120,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 120 }),
                          },
                        ],
                      },
                      addressEn2: {
                        type: 'string',
                        title: `${formatMessage({ id: 'site.所在地2' })}（EN）`,
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请输入' }),
                        },
                        'x-validator': [
                          {
                            max: 120,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 120 }),
                          },
                        ],
                      },
                      telephoneNumber: {
                        type: 'string',
                        title: formatMessage({ id: '电话' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请输入' }),
                        },
                        'x-validator': [
                          {
                            max: 15,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 15 }),
                          },
                        ],
                      },
                      country: {
                        type: 'string',
                        title: formatMessage({ id: '国家' }),
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: countryList.map((item) => ({
                          label: item.value,
                          value: item.code,
                        })),
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请选择' }),
                          showSearch: true,
                          optionFilterProp: 'label',
                        },
                      },
                      sponsorAffiliationList: {
                        type: 'array',
                        title: formatMessage({ id: 'sponsor.所属' }),
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'ArrayTable',
                        'x-component-props': {
                          bordered: false,
                        },
                        'x-validator': [
                          {
                            required: true,
                            message: formatMessage({ id: '此项为必填项' }),
                          },
                        ],
                        items: {
                          type: 'object',
                          properties: {
                            column1: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                title: formatMessage({ id: '名称' }),
                              },
                              properties: {
                                affiliationName: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                  'x-component-props': {
                                    placeholder: formatMessage({ id: '请输入' }),
                                  },
                                  'x-validator': [
                                    {
                                      required: true,
                                      message: formatMessage({ id: '此项为必填项' }),
                                    },
                                    {
                                      max: 120,
                                      message: formatMessage(
                                        { id: '文字内容限制提示语' },
                                        { num: 120 }
                                      ),
                                    },
                                    (value, rule, ctx) => {
                                      let flag = true;
                                      form
                                        .query('sponsorAffiliationList.*.affiliationName')
                                        .forEach((field, address) => {
                                          if (
                                            !ctx.field.address.match(address.entire) &&
                                            ctx.field.value === field.value
                                          ) {
                                            flag = formatMessage(
                                              { id: '不允许重复提示' },
                                              { text: formatMessage({ id: '名称' }) }
                                            );
                                          }
                                        });
                                      return flag;
                                    },
                                  ],
                                },
                              },
                            },
                            column2: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                title: `${formatMessage({ id: '名称' })}（EN）`,
                              },
                              properties: {
                                affiliationNameEn: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                  'x-component-props': {
                                    placeholder: formatMessage({ id: '请输入' }),
                                  },
                                  'x-validator': [
                                    {
                                      required: true,
                                      message: formatMessage({ id: '此项为必填项' }),
                                    },
                                    {
                                      max: 120,
                                      message: formatMessage(
                                        { id: '文字内容限制提示语' },
                                        { num: 120 }
                                      ),
                                    },
                                    (value, rule, ctx) => {
                                      let flag = true;
                                      form
                                        .query('sponsorAffiliationList.*.affiliationNameEn')
                                        .forEach((field, address) => {
                                          if (
                                            !ctx.field.address.match(address.entire) &&
                                            ctx.field.value === field.value
                                          ) {
                                            flag = formatMessage(
                                              { id: '不允许重复提示' },
                                              { text: `${formatMessage({ id: '名称' })}（EN）` }
                                            );
                                          }
                                        });
                                      return flag;
                                    },
                                  ],
                                },
                              },
                            },
                            column3: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                title: formatMessage({ id: '操作' }),
                                dataIndex: 'action',
                                width: 80,
                              },
                              properties: {
                                remove: {
                                  'x-component': 'ArrayTableDelete',
                                  'x-decorator': 'FormItem',
                                },
                              },
                            },
                          },
                        },
                        properties: {
                          addition: {
                            type: 'void',
                            'x-component': 'ArrayTable.Addition',
                            'x-component-props': {
                              title: formatMessage({ id: '新增' }),
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          }}
        />
      )}
    >
      {children}
    </DrawerFormily>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'Edit';

export default Index;
