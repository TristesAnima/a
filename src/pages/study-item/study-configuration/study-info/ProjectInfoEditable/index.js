import { ProFormItems } from '@/components/Independent';
import { useProjectDict } from '@/hooks/Project';
import { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';

const Index = () => {
  const { formatMessage } = useIntl();
  const { country: { list: countryList = [] } = {} } = useProjectDict();

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
              <ProFormTextArea
                label={formatMessage({ id: 'study.研究名称' })}
                name="studyName"
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
                label={formatMessage({ id: 'study.研究名称（英文）' })}
                name="studyNameEn"
                disabled
              />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study.研究编号' })}
                name="studyId"
                disabled
              />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study-configuration.方案号' })}
                name="protocolNo"
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
              <ProFormSelect
                label={formatMessage({ id: '国家' })}
                name="country"
                showSearch
                options={countryList?.map((item) => ({
                  label: item.value,
                  value: item.code,
                }))}
                mode="multiple"
                fieldProps={{
                  optionFilterProp: 'label',
                }}
              />
            ),
          },
          {
            element: (
              <ProFormText
                label={formatMessage({ id: 'study.申办方' })}
                name="sponsor"
                rules={[{ required: true }]}
              />
            ),
          },
          {
            element: (
              <ProFormText label={formatMessage({ id: 'study.项目经理' })} name="projectManager" />
            ),
          },
        ],
      }}
    />
  );
};

export default Index;
