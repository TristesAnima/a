import { DrawerForm, TreeSelect } from '@/components/TsCommonComponents';
import { useMessage } from '@/hooks/Independent';
import { saveSiteMilestone } from '@/services/study-configuration';
import {
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { compact, noop } from 'lodash';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { useMemo } from 'react';
import { Form } from 'antd';
import { getSessionStorageItem } from '@/zero-plus';

const { Item: FormItem } = Form;

const propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  dataSource: PropTypes.array.isRequired,
  sumWeight: PropTypes.number.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

const defaultProps = {
  onOk: noop,
  onCancel: noop,
};

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
  const [planStartDate, planFinishDate] = planDate;
  const [actualStartDate, actualFinishDate] = actualDate || [];
  return {
    ...rest,
    planStartDate,
    planFinishDate,
    actualStartDate,
    actualFinishDate,
  };
}

const Index = (props) => {
  const { children, dataSource, sumWeight, title, data, onOk, onCancel } = props;
  const { formatMessage } = useIntl();
  const messagePro = useMessage();

  async function save(newData, reset, onError) {
    const params = getData({ ...data, ...newData, studyId: getSessionStorageItem('studyId') });
    const saveResult = await saveSiteMilestone(params);
    messagePro({
      response: saveResult,
      mode: 'save',
      onSuccess: () => {
        reset();
        onOk();
      },
      onError,
    });
    return saveResult.success;
  }

  const initialValues = useMemo(() => setData(data), [data]);

  return (
    <DrawerForm
      title={title}
      initialValues={initialValues}
      okText={formatMessage({ id: '保存' })}
      onShow={(show) => {
        show();
      }}
      onOk={(...args) => save(...args)}
      onCancel={onCancel}
      formItems={() => ({
        defaultRowOption: {
          gutter: 32,
        },
        defaultColOption: {
          span: 24,
        },
        defaultCommonFormItemOption: {
          labelCol: {
            span: 24,
          },
          wrapperCol: {
            span: 24,
          },
        },
        content: [
          {
            colOption: {
              span: data.parentId ? 24 : 0,
            },
            element: (
              <FormItem name="parentId" label={formatMessage({ id: 'study-configuration.父级' })}>
                <TreeSelect
                  treeDataSource={dataSource}
                  titleKey="name"
                  treeNodeKey="uuid"
                  disabled
                />
              </FormItem>
            ),
          },
          {
            element: (
              <ProFormText
                name="name"
                label={formatMessage({ id: 'study-configuration.计划名称' })}
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
            ),
          },
          {
            element: (
              <ProFormDateRangePicker
                name="planDate"
                label={formatMessage({ id: 'study-configuration.首次计划开始/结束日期' })}
                width="100%"
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
            ),
          },
          {
            element: (
              <ProFormDateRangePicker
                width="100%"
                name="actualDate"
                label={formatMessage({ id: 'study-configuration.实际计划开始/结束日期' })}
              />
            ),
          },
          {
            element: (
              <ProFormDigit
                name="weight"
                label={`${formatMessage({ id: '权重' })}（${formatMessage({
                  id: '剩余',
                })}${100 - sumWeight}%）`}
                fieldProps={{ addonAfter: '%', max: 100 - sumWeight, min: 0 }}
                width="50%"
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
            ),
          },
          {
            element: (
              <ProFormTextArea
                name="note"
                label={formatMessage({ id: '备注' })}
                fieldProps={{ rows: 5 }}
              />
            ),
          },
        ],
      })}
    >
      {children}
    </DrawerForm>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'Edit';

export default Index;
