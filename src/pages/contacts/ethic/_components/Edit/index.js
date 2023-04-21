import { DrawerFormily } from '@/components/Independent';
import { useMessage } from '@/hooks/Independent';
import { useProjectDict } from '@/hooks/Project';
import { getEthicsPro } from '@/services/ethic';
import { saveEthicContacts, isUserRelation } from '@/services/contacts';
import { FormGrid, FormItem, FormLayout, Input, Select, Radio } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import { onFormMount } from '@formily/core';
import { useIntl } from '@umijs/max';
import { noop } from 'lodash';
import * as PropTypes from 'prop-types';
import { getNameWithLanguage } from '@/utils/Project';
import { ContactsSync } from '@/components/TsProjectComponents';

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
    ContactsSync,
    Radio,
  },
});

const Index = (props) => {
  const { children, title, data, onOk, onCancel } = props;
  const { formatMessage } = useIntl();
  const messagePro = useMessage();
  const { member: { list: memberList = [] } = {} } = useProjectDict();
  const isEdit = !!data.id;

  const save = async (newData) => {
    const params = { id: 0, ...data, ...newData };
    if (!isEdit && params.userId) {
      const relationResult = await isUserRelation({ ...params, type: 2 });
      if (!relationResult.success) {
        messagePro({
          response: relationResult,
        });
        return Promise.reject();
      }
      if (relationResult.data) {
        messagePro({
          success: false,
          errorText: formatMessage({ id: 'contacts.已关联提示' }),
        });
        return Promise.reject();
      }
    }
    const saveResult = await saveEthicContacts(params);
    messagePro({
      response: saveResult,
      mode: 'save',
      onSuccess: () => {
        onOk();
      },
    });
    return Promise.resolve();
  };

  const onUserIdOnChange = (user, form) => {
    if (!user) {
      return;
    }
    const { name, phone, email } = user;
    form.setValues({
      nameChar: name,
      email,
      phone,
    });
  };

  return (
    <DrawerFormily
      id={data.id || 'add'}
      title={title}
      width={600}
      initialValues={data}
      formProps={{
        effects: () => {
          onFormMount((form) => {
            form.query('userId').take().setComponentProps({
              visible: true,
              currentData: data,
            });
          });
          onFormMount((form) => {
            form.setFieldState('examinationCommitteeId', {
              loading: true,
              disabled: isEdit,
            });
            getEthicsPro().then((response) => {
              if (response.success) {
                form.setFieldState('examinationCommitteeId', {
                  dataSource: response.data.map((item) => ({
                    label: getNameWithLanguage(item.name, item.nameEn),
                    value: item.id,
                  })),
                  loading: false,
                });
              }
            });
          });
        },
      }}
      okText={formatMessage({ id: '保存' })}
      onOk={(...args) => save(...args)}
      onCancel={onCancel}
      renderFormContent={() => (
        <SchemaFiled
          scope={{
            onUserIdOnChange,
          }}
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
                      userId: {
                        type: 'number',
                        title: formatMessage({ id: 'contacts.账号' }),
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'ContactsSync',
                        'x-component-props': {
                          visible: false,
                          currentData: {},
                          onChange: '{{(_userId, user) => onUserIdOnChange(user, $form)}}',
                        },
                      },
                      namePinyin: {
                        type: 'string',
                        title: formatMessage({ id: 'contacts.姓名（拼音）' }),
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
                            max: 200,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 200 }),
                          },
                        ],
                      },
                      nameChar: {
                        type: 'string',
                        title: formatMessage({ id: 'contacts.氏名（漢字）' }),
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
                            max: 50,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 50 }),
                          },
                        ],
                      },
                      nameEn: {
                        type: 'string',
                        title: formatMessage({ id: 'contacts.氏名（英文）' }),
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
                            max: 50,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 50 }),
                          },
                        ],
                      },
                      email: {
                        type: 'string',
                        title: formatMessage({ id: '邮箱' }),
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
                      phone: {
                        type: 'string',
                        title: formatMessage({ id: '联系方式' }),
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
                      examinationCommitteeId: {
                        type: 'string',
                        title: formatMessage({ id: 'ethic.审查委员会' }),
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'Select',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请选择' }),
                          showSearch: true,
                          optionFilterProp: 'label',
                        },
                        'x-validator': [
                          {
                            required: true,
                            message: formatMessage({ id: '此项为必填项' }),
                          },
                        ],
                      },
                      jobTitle: {
                        type: 'string',
                        title: formatMessage({ id: 'contacts.职业' }),
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
                            max: 100,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 100 }),
                          },
                        ],
                      },
                      qualification: {
                        type: 'string',
                        title: formatMessage({ id: 'contacts.资质' }),
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
                            max: 100,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 100 }),
                          },
                        ],
                      },
                      member: {
                        type: 'string',
                        title: formatMessage({ id: 'contacts.委员分类' }),
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          gridSpan: 2,
                        },
                        'x-component': 'Select',
                        'x-component-props': {
                          placeholder: formatMessage({ id: '请选择' }),
                        },
                        enum: memberList.map((item) => ({
                          label: item.value,
                          value: item.code,
                        })),
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
