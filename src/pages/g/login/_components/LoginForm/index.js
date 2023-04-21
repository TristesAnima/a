import React from 'react';
import { formatMessage } from '@umijs/max';
import { Alert, Button } from 'antd';
import { LockOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Form, Tabs } from '@/zero-plus';
import CaptchaFetcher from './_components/CaptchaFetcher';
import useEagerLoading from './_hooks/useEagerLoading';
import styles from './index.less';

export default (props) => {
  const {
    loading,

    account = {},
    mobile,
    onSubmit = (newValue) => {
      console.log('Submit:', newValue);
    },
  } = useEagerLoading(props);

  const renderAccountForm = () => {
    const {
      errorMessage,

      usernameProps,
      passwordProps,

      extraContent,
      ...rest
    } = account;

    const ACCOUNT_LOGIN_TYPE = 'account';

    return (
      <div className={styles.login}>
        <Form
          {...rest}
          renderFooter={({ submit }) => {
            return (
              <>
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  style={{ fontWeight: 'bold', width: '100%', marginTop: 24 }}
                  onClick={() => {
                    submit();
                  }}
                >
                  {formatMessage({ id: '登录' })}
                </Button>
              </>
            );
          }}
          onSubmit={(newRecord) => {
            onSubmit({ ...newRecord, LOGIN_TYPE: ACCOUNT_LOGIN_TYPE });
          }}
        >
          <Form.Item noStyle shouldUpdate>
            {(form) => {
              const onPressEnter = () => {
                form.validateFields().then((newRecord) => {
                  onSubmit({ ...newRecord, LOGIN_TYPE: ACCOUNT_LOGIN_TYPE });
                });
              };

              return (
                <>
                  {errorMessage && (
                    <Alert
                      style={{ marginBottom: 24 }}
                      type="error"
                      showIcon
                      message={errorMessage}
                    />
                  )}

                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({ id: '请输入账号' }),
                      },
                    ]}
                    {...usernameProps}
                  >
                    <Input
                      placeholder={formatMessage({ id: '账号@租户标识' })}
                      size="large"
                      prefix={<UserOutlined className={styles.prefixIcon} />}
                      onPressEnter={onPressEnter}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({ id: '请输入密码' }),
                      },
                    ]}
                    {...passwordProps}
                  >
                    <Input.Password
                      placeholder={formatMessage({ id: '密码' })}
                      size="large"
                      prefix={<LockOutlined className={styles.prefixIcon} />}
                      onPressEnter={onPressEnter}
                    />
                  </Form.Item>

                  {typeof extraContent === 'function' ? extraContent({ form }) : extraContent}
                </>
              );
            }}
          </Form.Item>
        </Form>
      </div>
    );
  };

  const renderMobileForm = () => {
    const {
      errorMessage,

      mobileProps,
      captchaProps,

      onGetCaptcha,

      extraContent,
      ...rest
    } = mobile;

    const MOBILE_LOGIN_TYPE = 'mobile';

    return (
      <div className={styles.login}>
        <Form
          {...rest}
          renderFooter={({ submit }) => {
            return (
              <>
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  style={{ fontWeight: 'bold', width: '100%', marginTop: 24 }}
                  onClick={() => {
                    submit();
                  }}
                >
                  {formatMessage({ id: '登录' })}
                </Button>
              </>
            );
          }}
          onSubmit={(newRecord) => {
            onSubmit({ ...newRecord, LOGIN_TYPE: MOBILE_LOGIN_TYPE });
          }}
        >
          <Form.Item noStyle shouldUpdate>
            {(form) => (
              <>
                {errorMessage && (
                  <Alert
                    style={{ marginBottom: 24 }}
                    type="error"
                    showIcon
                    message={errorMessage}
                  />
                )}

                <Form.Item
                  name="mobile"
                  rules={[
                    {
                      required: true,
                      message: formatMessage({
                        id: '请输入手机号',
                      }),
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: formatMessage({
                        id: '手机号格式错误',
                      }),
                    },
                  ]}
                  {...mobileProps}
                >
                  <Input
                    placeholder={formatMessage({ id: '手机号' })}
                    size="large"
                    prefix={<MobileOutlined className={styles.prefixIcon} />}
                  />
                </Form.Item>

                <Form.Item
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: formatMessage({
                        id: '请输入验证码',
                      }),
                    },
                  ]}
                  {...captchaProps}
                >
                  <Input
                    placeholder={formatMessage({
                      id: '验证码',
                    })}
                    size="large"
                    prefix={<MailOutlined className={styles.prefixIcon} />}
                    addonAfter={
                      <CaptchaFetcher
                        countDown={120}
                        getCaptchaButtonText={formatMessage({ id: '获取验证码' })}
                        getCaptchaSecondText={formatMessage({ id: '秒' })}
                        onGetCaptcha={() => {
                          return new Promise((resolve, reject) => {
                            form
                              .validateFields()
                              .then((finalRecord) => {
                                if (onGetCaptcha) {
                                  onGetCaptcha(finalRecord, { resolve, reject });
                                }
                                resolve();
                              })
                              .catch(() => {
                                reject();
                              });
                          });
                        }}
                      />
                    }
                  />
                </Form.Item>

                {typeof extraContent === 'function' ? extraContent({ form }) : extraContent}
              </>
            )}
          </Form.Item>
        </Form>
      </div>
    );
  };

  if (account && mobile) {
    return (
      <Tabs
        className={styles.tabs}
        tabBarGutter={0}
        tabPanes={[
          {
            key: '1',
            tab: formatMessage({ id: '账号密码登录' }),
            children: renderAccountForm(),
          },
          {
            key: '2',
            tab: formatMessage({ id: '手机号码登录' }),
            children: renderMobileForm(),
          },
        ]}
      />
    );
  }

  if (mobile) {
    return renderMobileForm();
  }

  if (account) {
    return renderAccountForm();
  }

  return <></>;
};
