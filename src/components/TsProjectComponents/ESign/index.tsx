import React, { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from '@umijs/max';
import moment from 'moment';
import PubSub from 'pubsub-js';
import { isFunction } from 'lodash';
import { Form } from 'antd';
import { ProFormTextArea, ProFormText } from '@ant-design/pro-components';
import { ModalForm } from '@/components/TsCommonComponents';
import { useMessage } from '@/hooks/Independent';
import { checkESign } from '@/services/api';
import type { Authority, CurrentUser, ESignParams } from '@/typings/project';

const { Item: FormItem } = Form;

const defaultRowOption = {
  gutter: 8,
};

const defaultColOption = {
  span: 24,
};

const defaultCommonFormItemOption = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

enum E_SIGN_TYPE {
  CLOSE, // 关闭
  OPEN, // 开启
  FORCE_CLOSE, // 强制关闭
  FORCE_OPEN, // 强制开启
}

const messageKey = 'ESign';

const ESignPro: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser, authorities }: { currentUser: CurrentUser; authorities: Authority[] } =
    initialState;
  const [visible, setVisible] = useState(false);
  const [contentRequired, setContentRequired] = useState(false);
  const paramsRef = useRef<
    ESignParams & {
      functionalModuleId: number;
      resolve: (signature?: number) => void;
    }
  >();
  const { formatMessage } = useIntl();
  const message = useMessage();

  useEffect(() => {
    const token = PubSub.subscribe(
      messageKey,
      (msg, data: ESignParams & { resolve: (signature?: number) => void }) => {
        const { authorityId, onShow, resolve } = data;
        const eSignAuth = authorities.find((item) => item.id === authorityId);
        if (
          eSignAuth?.electronicSignatureIdentifier !== E_SIGN_TYPE.OPEN &&
          eSignAuth?.electronicSignatureIdentifier !== E_SIGN_TYPE.FORCE_OPEN
        ) {
          // 不需要电子签名
          resolve();
        } else {
          const show = () => {
            paramsRef.current = {
              ...data,
              functionalModuleId: eSignAuth.id,
            };
            setVisible(true);
            if (
              eSignAuth?.signatureRemarksIdentifier === E_SIGN_TYPE.OPEN ||
              eSignAuth?.signatureRemarksIdentifier === E_SIGN_TYPE.FORCE_OPEN
            ) {
              setContentRequired(true);
            } else {
              setContentRequired(false);
            }
          };

          if (isFunction(onShow)) {
            onShow(show);
          } else {
            show();
          }
        }
      }
    );

    return () => {
      PubSub.unsubscribe(token);
    };
  }, [authorities, setContentRequired]);

  return (
    <ModalForm
      modalProps={{
        zIndex: 1001,
      }}
      open={visible}
      title={formatMessage({ id: '电子签名' })}
      formItems={() => ({
        defaultRowOption,
        defaultColOption,
        defaultCommonFormItemOption,
        content: [
          {
            element: (
              <ProFormTextArea
                fieldProps={{
                  autoFocus: true,
                }}
                label={formatMessage({ id: '签名备注' })}
                name="content"
                rules={[
                  {
                    required: contentRequired,
                    message: formatMessage({ id: '此项为必填项' }),
                  },
                ]}
              />
            ),
          },
          {
            element: <FormItem label={formatMessage({ id: '姓名' })}>{currentUser.name}</FormItem>,
          },
          {
            element: (
              <FormItem label={formatMessage({ id: '账号' })}>{currentUser.username}</FormItem>
            ),
          },
          {
            element: (
              <ProFormText.Password
                label={formatMessage({ id: '密码' })}
                name="passWord"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: '此项为必填项' }),
                  },
                ]}
                fieldProps={{
                  type: 'new-password',
                }}
              />
            ),
          },
          {
            element: (
              <FormItem label={formatMessage({ id: '本地时间' })}>
                {moment().format('YYYY-MM-DD HH:mm:ss')}
              </FormItem>
            ),
          },
          {
            element: (
              <FormItem label={formatMessage({ id: '本地时区' })}>
                {`${Date()}`.slice(`${Date()}`.lastIndexOf('(') + 1, `${Date()}`.length - 1)}
              </FormItem>
            ),
          },
        ],
      })}
      width={600}
      onOk={(record: any, close) => {
        const { content, passWord } = record;
        const { resolve, ...rest } = paramsRef.current!;
        const newParams = {
          content,
          passWord,
          ...rest,
        };
        return checkESign(newParams).then(({ success, data }) => {
          if (!success) {
            message({
              response: { success, data: data as { message?: string } },
            });
          } else {
            close();
            setVisible(false);
            resolve((data as { id: number }).id);
            paramsRef.current = undefined;
          }
          return success;
        });
      }}
      onCancel={() => {
        if (paramsRef.current?.onCancel) {
          paramsRef.current.onCancel();
        }
        setVisible(false);
        paramsRef.current = undefined;
      }}
    />
  );
};

ESignPro.displayName = 'ESign';

export default ESignPro;

export function eSign(params: ESignParams): Promise<number | undefined> {
  return new Promise((resolve) => {
    PubSub.publish(messageKey, {
      ...params,
      resolve,
    });
  });
}
