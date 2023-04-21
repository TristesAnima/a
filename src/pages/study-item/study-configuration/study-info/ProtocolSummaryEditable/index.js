import React from 'react';
import { useIntl } from '@umijs/max';
import { ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components';
import { ProFormItems } from '@/components/Independent';

const Index = () => {
  const { formatMessage } = useIntl();

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
              <ProFormText
                label={formatMessage({ id: 'study-configuration.方案编号' })}
                name="protocolId"
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
                label={formatMessage({ id: 'study-configuration.方案名称' })}
                name="protocolName"
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
                label={formatMessage({ id: 'study-configuration.方案版本' })}
                name="protocolVersion"
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
              <ProFormText label={formatMessage({ id: 'study.申办方' })} name="sponsor" disabled />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study-configuration.研究产品' })}
                name="studyProduct"
                disabled
              />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study-configuration.适应症' })}
                name="indication"
                disabled
              />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study-configuration.研究目的' })}
                name="studyPurpose"
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
                disabled
              />
            ),
          },
          {
            colOption: {
              span: 24,
            },
            element: (
              <ProFormTextArea
                label={formatMessage({ id: 'study-configuration.入选标准' })}
                name="inclusionCriteria"
                rules={[
                  {
                    max: 500,
                  },
                ]}
              />
            ),
          },
          {
            colOption: {
              span: 24,
            },
            element: (
              <ProFormTextArea
                label={formatMessage({ id: 'study-configuration.排除标准' })}
                name="exclusionCriteria"
                rules={[
                  {
                    max: 500,
                  },
                ]}
              />
            ),
          },
          {
            colOption: {
              span: 24,
            },
            element: (
              <ProFormTextArea
                label={formatMessage({ id: 'study-configuration.退出标准' })}
                name="exitCriteria"
                rules={[
                  {
                    max: 500,
                  },
                ]}
              />
            ),
          },
          {
            colOption: {
              span: 24,
            },
            element: (
              <ProFormTextArea
                label={formatMessage({ id: 'study-configuration.研究终点' })}
                name="studyEndPoints"
                rules={[
                  {
                    max: 500,
                  },
                ]}
              />
            ),
          },
          {
            colOption: {
              span: 24,
            },
            element: (
              <ProFormUploadButton
                label={formatMessage({ id: '附件' })}
                name="studyFileList"
                fieldProps={{
                  multiple: true,
                }}
                title={formatMessage({ id: '上传' })}
                buttonProps={{
                  type: 'primary',
                }}
                listType='text'
              />
            ),
          },
        ],
      }}
    />
  );
};

export default Index;
