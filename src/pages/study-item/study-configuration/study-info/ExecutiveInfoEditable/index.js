import React from 'react';
import { useIntl } from '@umijs/max';
import {
  ProFormTextArea,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDigit,
} from '@ant-design/pro-components';
import { parseInt } from 'lodash';
import { ProFormItems } from '@/components/Independent';
import { useProjectDict } from '@/hooks/Project';

const Index = () => {
  const { formatMessage } = useIntl();
  const { project_status: { list: projectStatusList = [] } = {} } = useProjectDict();

  return (
    <ProFormItems
      group={{
        defaultRowOption: {
          gutter: 16,
        },
        defaultColOption: {
          span: 8,
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
            element: (
              <ProFormSelect
                label={formatMessage({ id: 'study.项目状态' })}
                name="projectStatus"
                options={projectStatusList?.map((item) => ({
                  label: item.value,
                  value: parseInt(item.code),
                }))}
              />
            ),
          },
          {
            element: (
              <ProFormDatePicker
                label={formatMessage({ id: 'study-configuration.首次计划开始日期' })}
                name="firstPlannedStartDate"
                width="100%"
              />
            ),
          },
          {
            type: 'shouldUpdate',
            name: ['firstPlannedStartDate'],
            element: ({ firstPlannedStartDate }) => (
              <ProFormDatePicker
                label={formatMessage({ id: 'study-configuration.首次计划结束日期' })}
                name="firstPlannedEndDate"
                width="100%"
                fieldProps={{
                  disabledDate: (currentDate) =>
                    currentDate && +currentDate < +firstPlannedStartDate,
                }}
              />
            ),
          },
          {
            element: (
              <ProFormDigit
                label={formatMessage({ id: 'study-configuration.计划受试者数' })}
                name="plannedSubjects"
                rules={[
                  {
                    type: 'number',
                    min: 1,
                    max: 999999,
                  },
                ]}
                min={1}
                max={999999}
                fieldProps={{
                  precision: 0,
                }}
              />
            ),
          },
          {
            element: (
              <ProFormDigit
                label={formatMessage({ id: 'study-configuration.计划中心数' })}
                name="numberOfSites"
                rules={[
                  {
                    type: 'number',
                    min: 1,
                    max: 999999,
                  },
                ]}
                min={1}
                max={999999}
                fieldProps={{
                  precision: 0,
                }}
              />
            ),
          },
          {
            colOption: {
              span: 24,
            },
            element: (
              <ProFormTextArea
                label={formatMessage({ id: '备注' })}
                name="note"
                rules={[
                  {
                    max: 500,
                  },
                ]}
              />
            ),
          },
        ],
      }}
    />
  );
};

export default Index;
