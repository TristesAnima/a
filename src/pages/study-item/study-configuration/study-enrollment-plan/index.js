import { useMessage } from '@/hooks/Independent';
import {
  getProjectEnrollmentPlan,
  saveProjectEnrollmentPlan,
} from '@/services/study-configuration';
import { parseJson } from '@/utils/Independent';
import { getSessionStorageItem } from '@/zero-plus';
import {
  EditableProTable,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Col, Form, InputNumber, Row, Spin } from 'antd';
import { fill, omit, pickBy, sum, values } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FooterToolbar } from '../_components';

function setData(data) {
  const { planEnrollmentStartDate, planEnrollmentEndDate, enrollmentPeriod, planData } = data;
  return {
    ...data,
    planData: parseJson(planData) || [],
    enrollmentPeriod: enrollmentPeriod || 'Q',
    planEnrollmentDate:
      planEnrollmentStartDate && planEnrollmentEndDate
        ? [moment(planEnrollmentStartDate), moment(planEnrollmentEndDate)]
        : null,
  };
}

function getData(data) {
  const { planEnrollmentDate, planData, enrollmentPeriod } = data;
  const [planEnrollmentStartDate, planEnrollmentEndDate] = planEnrollmentDate;
  return {
    ...data,
    planEnrollmentStartDate: planEnrollmentStartDate && +planEnrollmentStartDate,
    planEnrollmentEndDate: planEnrollmentEndDate && +planEnrollmentEndDate,
    planData: JSON.stringify(
      planData.map((item) =>
        pickBy(
          item,
          (_value, key) =>
            ['id', 'year'].includes(key) || key.startsWith(enrollmentPeriod.toLowerCase())
        )
      )
    ),
  };
}

const Index = () => {
  const { formatMessage } = useIntl();
  const messagePro = useMessage();
  const [form] = Form.useForm();
  const [editableKeys, setEditableKeys] = useState([]);
  const {
    data: projectEnrollmentPlan = {},
    loading,
    refresh,
  } = useRequest(
    async (params) => {
      const { success, data } = await getProjectEnrollmentPlan(params);
      return success ? setData(data) : {};
    },
    {
      defaultParams: [{ studyId: getSessionStorageItem('studyId') }],
      onSuccess: (data) => {
        const { planData } = data;
        setEditableKeys(planData.map((item) => item.id));
      },
    }
  );

  const { runAsync: runSaveProjectEnrollmentPlan, loading: saveLoading } = useRequest(
    saveProjectEnrollmentPlan,
    {
      manual: true,
    }
  );

  useEffect(() => {
    form.resetFields();
  }, [projectEnrollmentPlan]);

  const getColumns = (planEnrollmentDate, enrollmentPeriod) => {
    const [startDate, endDate] = planEnrollmentDate || [];
    if (!startDate || !endDate) {
      return [];
    }
    const commonColumn = {
      formItemProps: (_form, { dataIndex, entry }) => ({
        hasFeedback: false,
        rules: [
          {
            required: true,
            validator: (rule, value) => {
              if (!value) {
                return Promise.resolve();
              }
              const totalPlan = form.getFieldValue('totalPlan');
              const total = sum([...values(omit(entry, ['id', 'year', dataIndex])), value]);
              if (total > totalPlan) {
                return Promise.reject(
                  new Error(
                    formatMessage({ id: 'study-configuration.当前年份入组总和不能大于总数' })
                  )
                );
              }
              return Promise.resolve();
            },
          },
        ],
      }),
      renderFormItem: () => <InputNumber min={0} placeholder={formatMessage({ id: '请输入' })} />,
    };

    if (enrollmentPeriod === 'Q') {
      return fill(Array(4), '').map((_item, index) => ({
        dataIndex: `q${index + 1}`,
        title: formatMessage({ id: 'X季度' }, { num: index + 1 }),
        ...commonColumn,
        editable: (_, row) =>
          moment(`${row.year}-${index + 1}`, 'YYYY-Q').isBetween(
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD'),
            'quarter',
            '[]'
          ),
      }));
    }
    if (enrollmentPeriod === 'M') {
      return fill(Array(12), '').map((_item, index) => ({
        dataIndex: `m${index + 1}`,
        title: formatMessage({ id: 'X月' }, { num: index + 1 }),
        ...commonColumn,
        editable: (_, row) =>
          moment(`${row.year}-${index + 1}`, 'YYYY-MM').isBetween(
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD'),
            'month',
            '[]'
          ),
      }));
    }
    if (enrollmentPeriod === 'W') {
      return fill(Array(52), '').map((_item, index) => ({
        dataIndex: `w${index + 1}`,
        title: formatMessage({ id: 'X周' }, { num: index + 1 }),
        ...commonColumn,
        editable: (_, row) =>
          moment(`${row.year}-${index + 1}`, 'YYYY-w').isBetween(
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD'),
            'week',
            '[]'
          ),
      }));
    }
    return [];
  };

  /**
   * 快速填写
   */
  const quickFill = () => {
    const planEnrollmentDate = form.getFieldValue('planEnrollmentDate') || [];
    const enrollmentPeriod = form.getFieldValue('enrollmentPeriod');
    const columns = getColumns(planEnrollmentDate, enrollmentPeriod);
    if (!columns.length) {
      return;
    }
    const planData = form.getFieldValue('planData');
    let totalPlan = form.getFieldValue('totalPlan');
    const arr = [];
    let editableNum = 0;
    planData.forEach((item) => {
      const { year, id, ...rest } = item;
      Object.keys(rest).forEach((key) => {
        const { editable } = columns.find((column) => column.dataIndex === key) || {};
        const num = item[key];
        if (!num) {
          if (editable?.(null, item)) {
            rest[key] = true;
            editableNum += 1;
          }
        } else {
          totalPlan -= num;
        }
      });
      arr.push({
        year,
        id,
        ...rest,
      });
    });
    const average = Math.ceil(totalPlan / editableNum); // 平均数
    form.setFieldValue(
      'planData',
      arr.map((item) => {
        const { year, id, ...rest } = item;
        Object.entries(rest).forEach(([key, value]) => {
          if (value === true) {
            rest[key] = editableNum === 1 ? totalPlan : average;
            editableNum -= 1;
            totalPlan -= average;
          }
        });
        return {
          year,
          id,
          ...rest,
        };
      })
    );
  };

  const setPlanData = (planEnrollmentDate, enrollmentPeriod) => {
    const columns = getColumns(planEnrollmentDate, enrollmentPeriod);
    if (!columns.length) {
      return;
    }
    const [startDate, endDate] = planEnrollmentDate;
    const startYear = startDate.year();
    const endYear = endDate.year();
    const planData = [];
    for (let i = startYear; i <= endYear; i += 1) {
      const yearData = columns.reduce((previousValue, currentValue) => {
        previousValue[currentValue.dataIndex] = null;
        return previousValue;
      }, {});
      yearData.year = i;
      yearData.id = i;
      planData.push(yearData);
    }
    form.setFieldValue('planData', planData);
    setEditableKeys(planData.map((item) => item.id));
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        initialValues={projectEnrollmentPlan}
        onFinish={(newData) => {
          runSaveProjectEnrollmentPlan(
            getData({
              ...projectEnrollmentPlan,
              ...newData,
            })
          ).then((response) => {
            messagePro({
              response,
              onSuccess: () => {
                refresh();
              },
            });
          });
        }}
      >
        <Row gutter={8}>
          <Col>
            <ProFormDateRangePicker
              rules={[{ required: true }]}
              name="planEnrollmentDate"
              label={formatMessage({ id: 'study-configuration.计划入组日期' })}
              allowClear={false}
              fieldProps={{
                onChange: (v) => {
                  setPlanData(v, form.getFieldValue('enrollmentPeriod'));
                },
              }}
            />
          </Col>
          <Col>
            <ProFormRadio.Group
              label={formatMessage({ id: 'study-configuration.入组周期' })}
              name="enrollmentPeriod"
              options={[
                {
                  label: formatMessage({ id: '季度' }),
                  value: 'Q',
                },
                {
                  label: formatMessage({ id: '月' }),
                  value: 'M',
                },
                {
                  label: formatMessage({ id: '周' }),
                  value: 'W',
                },
              ]}
              fieldProps={{
                onChange: (e) => {
                  setPlanData(form.getFieldValue('planEnrollmentDate'), e.target.value);
                },
              }}
            />
          </Col>
          <Col>
            <ProFormDigit
              name="totalPlan"
              label={formatMessage({ id: 'study-configuration.计划入组总数' })}
              min={0}
              max={999999}
            />
          </Col>
        </Row>
        <ProFormDependency name={['planEnrollmentDate', 'enrollmentPeriod']}>
          {({ planEnrollmentDate, enrollmentPeriod }) => (
            <EditableProTable
              rowKey="id"
              name="planData"
              recordCreatorProps={false}
              toolBarRender={() => [
                <ProFormDependency key="quick-fill" name={['planData', 'totalPlan']}>
                  {({ planData, totalPlan }) => (
                    <Button
                      type="primary"
                      disabled={!planData?.length || !totalPlan}
                      onClick={quickFill}
                    >
                      {formatMessage({ id: 'study-configuration.快速填写' })}
                    </Button>
                  )}
                </ProFormDependency>,
              ]}
              ghost
              size="default"
              scroll={{
                x: 'max-content',
              }}
              editable={{
                type: 'multiple',
                editableKeys,
              }}
              columns={[
                {
                  dataIndex: 'year',
                  fixed: 'left',
                  title: formatMessage({ id: '年' }),
                  editable: false,
                  width: 80,
                },
                ...getColumns(planEnrollmentDate, enrollmentPeriod),
              ]}
            />
          )}
        </ProFormDependency>
        <FooterToolbar
          prevActions={
            <Button htmlType="submit" type="primary" loading={saveLoading}>
              {formatMessage({ id: '保存' })}
            </Button>
          }
          onPrev={(prev) => {
            prev();
          }}
          onNext={(next) => {
            next();
          }}
        />
      </Form>
    </Spin>
  );
};

export default Index;
