import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { formatMessage, useModel } from '@umijs/max';
import PubSub from 'pubsub-js';
import { useRequest } from 'ahooks';
import { DMForm, Form, getToken, request } from '@/zero-plus';
import LoginForm from './_components/LoginForm';
import styles from './index.less';

const updatePassword = (params) => {
  return request(`/sso/api/users/expiredupdatepassword/${params.userId}`, {
    method: 'put',
    body: {
      ...params,
      tenantIdentification: getToken().slice(32),
    },
  });
};

export default () => {
  const { initialState } = useModel('@@initialState');
  const { login } = initialState;

  const { loading: loading_login, runAsync: runAsync_login } = useRequest(login, {
    manual: true,
  });

  const { loading: loading_updatePassword, runAsync: runAsync_updatePassword } = useRequest(
    updatePassword,
    {
      manual: true,
    },
  );

  const [errorMessage, setErrorMessage] = useState('');

  const [currentUser, setCurrentUser] = useState({});

  return (
    <>
      <div className={styles.main}>
        <div className={styles.left}>
          <div style={{ marginTop: '30vh' }}>
            <p
              style={{
                fontFamily: 'PingFangSC-Regular',
                fontSize: '40px',
                color: ' #FFFFFF',
                textAlign: 'center',
                marginBottom: '0',
              }}
            >
              Welcome to
            </p>
            <p
              style={{
                fontFamily: 'Arial-BoldMT',
                fontSize: '52px',
                color: '#FFFFFF',
                textAlign: 'center',
                marginTop: '16px',
                marginBottom: '0',
              }}
            >
              {formatMessage({ id: 'project.long-name' })}
            </p>
            <p
              style={{
                fontFamily: 'PingFangSC-Regular',
                fontSize: '24px',
                color: '#FFFFFF',
                textAlign: 'center',
                marginTop: '24px',
              }}
            >
              Login to access your account
            </p>
          </div>
        </div>

        <div className={styles.right}>
          <img
            alt="logo"
            src="/images/logo.png"
            style={{
              marginTop: '6vh',
              marginLeft: '44vw',
            }}
          />
          <div style={{ marginTop: '10vh' }}>
            <p
              style={{
                fontFamily: 'PingFangSC-Regular',
                fontSize: '40px',
                fontWeight: 'bold',
                color: '#000000',
                textAlign: 'center',
                marginBottom: 15,
              }}
            >
              {formatMessage({ id: 'project.long-name' })}
            </p>
            <p
              style={{
                fontFamily: 'PingFangSC-Regular',
                fontSize: '24px',
                color: '#888B8D',
                textAlign: 'center',
                lineHeight: '30px',
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              &nbsp;
            </p>

            <div style={{ width: '22vw', margin: '0 auto' }}>
              <LoginForm
                loading={loading_login}
                account={{
                  errorMessage,
                }}
                // mobile={{
                //   errorMessage,
                // }}
                onSubmit={(newRecord) => {
                  runAsync_login(newRecord).then(({ success, data }) => {
                    if (success) {
                      const { firstLogin, isPasswordExpire } = data;
                      const newPasswordExpired = !!firstLogin || !!isPasswordExpire;
                      if (newPasswordExpired) {
                        setCurrentUser(data);
                        PubSub.publish('form_修改密码.run()', { visible: true });
                      } else {
                        window.location.href = '/';
                      }
                    } else {
                      setErrorMessage(data);
                    }
                  });
                }}
              />
            </div>
          </div>

          <DMForm
            type="Drawer"
            name="form_修改密码"
            labelCol={{ span: 6 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>{formatMessage({ id: '密码已失效' })}</span>
              </div>
            }
            width={600}
            renderFooter={({ submit }) => (
              <>
                <Button
                  type="primary"
                  loading={loading_updatePassword}
                  style={{
                    minWidth: 75,
                  }}
                  onClick={() => {
                    submit();
                  }}
                >
                  {formatMessage({ id: '保存' })}
                </Button>
              </>
            )}
            onSubmit={(newRecord, { success, error }) => {
              runAsync_updatePassword({
                ...currentUser,
                ...newRecord,
              }).then((response) => {
                if (response.success) {
                  success();
                  window.location.href = '/';
                } else {
                  error(response.data?.message || response.data);
                }
              });
            }}
          >
            <Form.Item shouldUpdate noStyle>
              {(form) => (
                <>
                  <Form.Item
                    label={formatMessage({ id: '密码' })}
                    name="oldpwd"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: '请输入密码',
                        }),
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    label={<span>{formatMessage({ id: '新密码' })}</span>}
                    name="newpwd"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: '请输入新密码',
                        }),
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    label={<span>{formatMessage({ id: '确认密码' })}</span>}
                    name="rePassword"
                    dependencies={['newpwd']}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: '请输入确认密码',
                        }),
                      },
                      {
                        validator: (rule, value, callback) => {
                          if (value !== form.getFieldValue('newpwd')) {
                            callback(formatMessage({ id: '两次输入的密码不匹配' }));
                          } else {
                            callback();
                          }
                        },
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </>
              )}
            </Form.Item>
          </DMForm>
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          color: '#675e5e',
          zIndex: 0,
          textAlign: 'center',
          width: '100%',
          bottom: 17,
          fontSize: 12,
        }}
      >
        {`© 2019-${new Date().getFullYear()} Deep Intelligent Pharma 版权所有`}
        &nbsp;
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
          京ICP备18033733号
        </a>
      </div>
    </>
  );
};
