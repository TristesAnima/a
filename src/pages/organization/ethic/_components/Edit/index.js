import { ArrayTableDelete, DrawerFormily } from '@/components/Independent';
import { useMessage } from '@/hooks/Independent';
import { useProjectDict } from '@/hooks/Project';
import { saveEthic, validateEthic } from '@/services/ethic';
import { getSitesPro } from '@/services/site';
import { ArrayTable, FormGrid, FormItem, FormLayout, Input, Select } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import { onFormMount } from '@formily/core';
import { useIntl, useModel } from '@umijs/max';
import { noop } from 'lodash';
import * as PropTypes from 'prop-types';
import { getNameWithLanguage } from '@/utils/Project';

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
  const {
    initialState: { currentUser },
  } = useModel('@@initialState');

  const save = async (newData, form) => {
    const params = { id: 0, ...data, ...newData };
    const validateResult = await validateEthic(params);
    if (!validateResult.success) {
      messagePro({
        success: false,
      });
      return Promise.reject();
    }
    if (validateResult.data?.laberName) {
      const filedConfig = {
        412: {
          name: 'name',
          label: formatMessage({ id: 'ethic.审查委员会名称' }),
        },
        413: {
          name: 'nameEn',
          label: `${formatMessage({ id: 'ethic.审查委员会名称' })}（EN）`,
        },
      };
      const {
        [validateResult.data.laberName]: { name, label },
      } = filedConfig;
      form
        .query(name)
        .take(0)
        .setSelfErrors(formatMessage({ id: '不允许重复提示' }, { text: label }));
      return Promise.reject();
    }
    const saveResult = await saveEthic(params);
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
      width={600}
      initialValues={data}
      formProps={{
        effects: () => {
          onFormMount((form) => {
            form.setFieldState('siteId', {
              loading: true,
            });
            getSitesPro({
              dataScope: currentUser.identity,
            }).then((response) => {
              if (response.success) {
                form.setFieldState('siteId', {
                  dataSource: response.data
                    .filter(
                      (item) =>
                        item.examinationCommitteeId === data.id || !item.examinationCommitteeId
                    )
                    .map((item) => ({
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
      onOk={save}
      onCancel={onCancel}
      renderFormContent={() => (
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
                        title: formatMessage({ id: 'ethic.审查委员会名称' }),
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
                      nameEn: {
                        type: 'string',
                        title: `${formatMessage({ id: 'ethic.审查委员会名称' })}（EN）`,
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
                      address: {
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
                      phoneNumber: {
                        type: 'string',
                        title: formatMessage({ id: '电话' }),
                        'x-decorator': 'FormItem',
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
                      corporationName: {
                        type: 'string',
                        title: formatMessage({ id: 'ethic.法人名' }),
                        'x-decorator': 'FormItem',
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
                      corporationDesignation: {
                        type: 'string',
                        title: formatMessage({ id: 'ethic.法人番号' }),
                        'x-decorator': 'FormItem',
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
                      siteId: {
                        type: 'string',
                        title: formatMessage({ id: 'site.中心' }),
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
