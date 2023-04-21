import { useMessage } from '@/hooks/Independent';
import { saveProjectMilestone } from '@/services/study-configuration';
import { getSessionStorageItem } from '@/zero-plus';
import {
  DatePicker,
  FormButtonGroup,
  FormDrawer,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Reset,
  Submit,
} from '@formily/antd';
import { createSchemaField } from '@formily/react';
import { onFormMount } from '@formily/core';
import { TreeSelect } from '@/components/TsCommonComponents';
import { useIntl } from '@umijs/max';
import { compact, noop } from 'lodash';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import { cloneElement } from 'react';

const propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
  portalId: PropTypes.any.isRequired,
  dataSource: PropTypes.array.isRequired,
  sumWeight: PropTypes.number.isRequired,
  onShow: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

const defaultProps = {
  onOk: noop,
  onCancel: noop,
  onShow: (show) => show(),
};

const SchemaField = createSchemaField({
  components: {
    DatePicker,
    NumberPicker,
    Input,
    FormItem,
    FormLayout,
    FormGrid,
    TreeSelect,
  },
});

function setData(data) {
  const { planStartDate, planFinishDate, actualStartDate, actualFinishDate } = data;
  return {
    ...data,
    planDate: compact([
      planStartDate && moment(planStartDate),
      planFinishDate && moment(planFinishDate),
    ]),
    actualDate: compact([
      actualStartDate && moment(actualStartDate),
      actualFinishDate && moment(actualFinishDate),
    ]),
  };
}

function getData(data) {
  const { planDate, actualDate, ...rest } = data;
  const [planStartDate, planFinishDate] = planDate || [];
  const [actualStartDate, actualFinishDate] = actualDate || [];
  return {
    ...rest,
    planStartDate: planStartDate && +moment(planStartDate),
    planFinishDate: planFinishDate && +moment(planFinishDate),
    actualStartDate: actualStartDate && +moment(actualStartDate),
    actualFinishDate: actualFinishDate && +moment(actualFinishDate),
  };
}

const Index = (props) => {
  const { children, data, sumWeight, portalId, dataSource, onShow, onOk, onCancel } = props;
  const { formatMessage } = useIntl();
  const isEdit = !!data.id;
  const messagePro = useMessage();

  const show = () => {
    FormDrawer(
      {
        title: isEdit ? formatMessage({ id: '编辑' }) : formatMessage({ id: '新增' }),
        width: 600,
        onClose: onCancel,
      },
      portalId,
      () => (
        <>
          <SchemaField
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
                        maxColumns: 1,
                      },
                      properties: {
                        parentId: {
                          type: 'string',
                          title: formatMessage({ id: 'study-configuration.父级' }),
                          'x-decorator': 'FormItem',
                          'x-component': 'TreeSelect',
                          'x-read-pretty': true,
                          'x-component-props': {
                            treeDataSource: [],
                          },
                        },
                        name: {
                          type: 'string',
                          title: formatMessage({ id: 'study-configuration.计划名称' }),
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
                          ],
                        },
                        planDate: {
                          type: 'string',
                          title: formatMessage({ id: 'study-configuration.首次计划开始/结束日期' }),
                          'x-decorator': 'FormItem',
                          'x-component': 'DatePicker.RangePicker',
                          'x-validator': [
                            {
                              required: true,
                              message: formatMessage({ id: '此项为必填项' }),
                            },
                          ],
                        },
                        actualDate: {
                          type: 'string',
                          title: formatMessage({ id: 'study-configuration.实际计划开始/结束日期' }),
                          'x-decorator': 'FormItem',
                          'x-component': 'DatePicker.RangePicker',
                        },
                        weight: {
                          type: 'number',
                          title: formatMessage({ id: '权重' }),
                          'x-decorator': 'FormItem',
                          'x-component': 'NumberPicker',
                          'x-component-props': {
                            placeholder: formatMessage({ id: '请输入' }),
                            addonAfter: '%',
                            max: 100,
                            min: 0,
                          },
                          'x-validator': [
                            {
                              required: true,
                              message: formatMessage({ id: '此项为必填项' }),
                            },
                          ],
                        },
                        note: {
                          type: 'string',
                          title: formatMessage({ id: '备注' }),
                          'x-decorator': 'FormItem',
                          'x-component': 'Input.TextArea',
                          'x-component-props': {
                            rows: 5,
                            placeholder: formatMessage({ id: '请输入' }),
                          },
                          'x-validator': [
                            {
                              max: 200,
                              message: formatMessage({ id: '文字内容限制提示语' }, { num: 200 }),
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            }}
          />
          <FormDrawer.Footer>
            <FormButtonGroup align="right">
              <Reset>{formatMessage({ id: '重置' })}</Reset>
              <Submit
                onSubmit={(values) =>
                  new Promise((resolve, reject) => {
                    saveProjectMilestone(
                      getData({
                        ...data,
                        ...values,
                        studyId: getSessionStorageItem('studyId'),
                      })
                    ).then((response) => {
                      messagePro({
                        response,
                        onSuccess: () => {
                          resolve();
                          onOk();
                        },
                        onError: () => {
                          reject();
                        },
                      });
                    });
                  })
                }
              >
                {formatMessage({ id: '保存' })}
              </Submit>
            </FormButtonGroup>
          </FormDrawer.Footer>
        </>
      )
    )
      .open({
        initialValues: setData(data),
        effects: () => {
          onFormMount((form) => {
            const parentIdField = form.query('parentId').take();
            parentIdField.setComponentProps({
              treeDataSource: dataSource,
              treeNodeKey: 'uuid',
              titleKey: 'name',
            });
            parentIdField.setState({
              hidden: !data.parentId,
            });
            const weightField = form.query('weight').take();
            weightField.setTitle(
              `${formatMessage({ id: '权重' })}（${formatMessage({
                id: '剩余',
              })}${100 - sumWeight}%）`
            );
            weightField.setComponentProps({
              max: 100 - sumWeight,
            });
          });
        },
      })
      .finally();
  };

  return (
    <FormDrawer.Portal id={portalId}>
      {cloneElement(children, {
        onClick: () => {
          onShow(show);
        },
      })}
    </FormDrawer.Portal>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'Edit';

export default Index;
