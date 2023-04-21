import React, { useMemo } from 'react';
import { useIntl, getLocale } from '@umijs/max';
import { ConfigProvider } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

const Index = (props) => {
  const { children, ...rest } = props;
  const { formatMessage } = useIntl();
  const locale = getLocale();

  const validateMessagesLocaleConfig = useMemo(() => {
    const config = {
      'zh-CN': {
        string: {
          // eslint-disable-next-line no-template-curly-in-string
          max: '内容限制在${max}字以内',
        },
        number: {
          // eslint-disable-next-line no-template-curly-in-string
          range: '数字必须在${min}-${max}之间',
        },
      },
      'ja-JP': {
        string: {
          // eslint-disable-next-line no-template-curly-in-string
          max: '内容の長さは${max}文字以内にしてください。',
        },
        number: {
          // eslint-disable-next-line no-template-curly-in-string
          range: '${min}-${max}の数字を入力してください。',
        },
      },
      'en-US': {
        string: {
          // eslint-disable-next-line no-template-curly-in-string
          max: 'Content shall be limited up to ${max} characters',
        },
        number: {
          // eslint-disable-next-line no-template-curly-in-string
          range: 'Please enter a positive integer of ${min}-${max}!',
        },
      },
    };

    return config[locale];
  }, [locale]);

  return (
    <ConfigProvider
      form={{
        validateMessages: {
          required: formatMessage({ id: '此项为必填项' }),
          types: {
            email: formatMessage(
              { id: '请输入正确的提示' },
              { text: formatMessage({ id: '邮箱' }) }
            ),
          },
          ...validateMessagesLocaleConfig,
        },
      }}
    >
      <PageContainer pageHeaderRender={false} {...rest}>
        {children}
      </PageContainer>
    </ConfigProvider>
  );
};

export default Index;
