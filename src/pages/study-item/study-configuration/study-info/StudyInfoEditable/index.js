import React from 'react';
import { useIntl } from '@umijs/max';
import { ProFormText, ProFormRadio, ProFormSelect } from '@ant-design/pro-components';
import { ProFormItems } from '@/components/Independent';
import { useProjectDict } from '@/hooks/Project';

const { Group: ProFormRadioGroup } = ProFormRadio;

const Index = () => {
  const { formatMessage } = useIntl();
  const {
    study_phase: { list: studyPhaseList = [] } = {},
    yes_or_no: { list: yesOrNoList = [] } = {},
  } = useProjectDict();

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
            colOption: {
              span: 24,
            },
            element: (
              <ProFormSelect
                label={formatMessage({ id: 'study.试验阶段' })}
                name="studyPhase"
                disabled
                options={studyPhaseList?.map((item) => ({
                  label: item.value,
                  value: item.code,
                }))}
              />
            ),
          },
          {
            colOption: {
              span: 24,
            },
            element: (
              <ProFormText
                label={formatMessage({ id: 'study-configuration.研究产品' })}
                name="studyProduct"
                rules={[
                  {
                    max: 50,
                  },
                ]}
              />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study-configuration.对照产品' })}
                name="controlProduct"
                rules={[
                  {
                    max: 50,
                  },
                ]}
              />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study-configuration.适应症' })}
                name="indications"
                rules={[
                  {
                    max: 200,
                  },
                ]}
              />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study-configuration.研究设计' })}
                name="studyDesign"
                rules={[
                  {
                    max: 200,
                  },
                ]}
              />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study-configuration.研究人群' })}
                name="studyPopulation"
                rules={[
                  {
                    max: 20,
                  },
                ]}
              />
            ),
          },
          {
            element: (
              <ProFormRadioGroup
                label={formatMessage({ id: 'study-configuration.是否未成年参与？' })}
                name="underageParticipants"
                options={yesOrNoList?.map((item) => ({
                  label: item.value,
                  value: item.code,
                }))}
              />
            ),
          },
          {
            element: (
              <ProFormRadioGroup
                label={formatMessage({ id: 'study-configuration.是否基因学检查' })}
                name="geneticsCheck"
                options={yesOrNoList?.map((item) => ({
                  label: item.value,
                  value: item.code,
                }))}
              />
            ),
          },
        ],
      }}
    />
  );
};

export default Index;
