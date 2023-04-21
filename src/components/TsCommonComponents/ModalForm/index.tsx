import React, { cloneElement, useEffect, useRef } from 'react';
import { Badge, Space, Form } from 'antd';
import type { ModalFormProps, ProFormInstance } from '@ant-design/pro-components';
import { useIntl } from '@@/exports';
import { useControllableValue } from 'ahooks';
import { delayed } from '@/utils/Independent';
import { hasTruth } from '@/utils/Project';
import { isFunction } from 'lodash';
import { ModalForm } from '@ant-design/pro-components';
import ProFormItems from '../ProFormItems';
import type { PortalProps } from '../typings';

const { Item: FormItem } = Form;

type Props = Omit<ModalFormProps, 'children' | 'visible'> & PortalProps;

const Index: React.FC<Props> = (props) => {
  const {
    children,
    visible: v,
    formItems,
    okText,
    cancelText,
    okButtonProps,
    cancelButtonProps,
    checkFormEmpty = true,
    extraNode,
    showChangedTip = true,
    renderFooter = (doms) => <Space>{doms}</Space>,
    modalProps,
    onShow = (show) => show(),
    onOk = (values, close) => close(),
    onCancel = () => {},
    onValidateError = () => {},
    ...rest
  } = props;

  const { formatMessage } = useIntl();
  const formRef = useRef<ProFormInstance>();
  const [visible, setVisible] = useControllableValue(props, {
    defaultValue: false,
    valuePropName: 'visible',
  });

  useEffect(() => {
    if (visible) {
      delayed(() => {
        if ('visible' in props) {
          onShow(() => {}, formRef.current);
        }
        if (formRef.current) {
          formRef.current.resetFields();
        }
      });
    }
  }, [visible, formRef]);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const onOkPro = (values: Record<string, any>) =>
    new Promise<boolean>((resolve) => {
      resolve(false);
      onOk(
        values,
        () => {
          close();
        },
        formRef.current
      );
    });

  const onCancelPro = () => {
    close();
    onCancel();
  };

  return (
    <>
      {children &&
        cloneElement(children, {
          onClick: () => {
            if (isFunction(onShow)) {
              onShow(() => open(), formRef.current);
            } else {
              open();
            }
          },
        })}
      <ModalForm
        formRef={formRef}
        open={visible}
        dateFormatter="number"
        submitter={{
          searchConfig: {
            submitText: okText || formatMessage({ id: '确定' }),
            resetText: cancelText || formatMessage({ id: '取消' }),
          },
          submitButtonProps: okButtonProps,
          resetButtonProps: cancelButtonProps,
          onReset: () => {
            onCancelPro();
          },
          render: (submitProps, doms) =>
            renderFooter([
              doms[0],
              <FormItem noStyle shouldUpdate key="submit">
                {({ getFieldsValue, isFieldsTouched }) => {
                  const primaryBtn = cloneElement(doms[1], {
                    disabled: checkFormEmpty ? !hasTruth(getFieldsValue()) : false,
                  });
                  return showChangedTip ? (
                    <Badge dot count={isFieldsTouched() ? 1 : 0} status="warning">
                      {cloneElement(doms[1], {
                        disabled: checkFormEmpty ? !hasTruth(getFieldsValue()) : false,
                      })}
                    </Badge>
                  ) : (
                    primaryBtn
                  );
                }}
              </FormItem>,
            ]),
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: onCancelPro,
          ...modalProps,
        }}
        omitNil={false}
        onFinish={onOkPro}
        onFinishFailed={onValidateError}
        {...rest}
      >
        <ProFormItems group={formItems(formRef.current)} />
        {extraNode}
      </ModalForm>
    </>
  );
};

Index.displayName = 'ModalForm';

export default Index;
