import React, { useRef, cloneElement, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useIntl } from '@umijs/max';
import { Form, Badge, message } from 'antd';
import { isFunction, noop } from 'lodash';
import { DrawerForm } from '@ant-design/pro-components';
import { useControllableValue } from 'ahooks';
import { delayed } from '@/utils/Independent';
import ProFormItems from '../../ProFormItems';
import { hasTruth } from '../util';

const propTypes = {
  formItems: PropTypes.func.isRequired,
  title: PropTypes.node,
  width: PropTypes.number,
  children: PropTypes.node,
  // eslint-disable-next-line react/require-default-props
  visible: PropTypes.bool,
  formProps: PropTypes.object,
  drawerProps: PropTypes.object,
  okText: PropTypes.node,
  cancelText: PropTypes.node,
  okButtonProps: PropTypes.object,
  cancelButtonProps: PropTypes.object,
  checkFormEmpty: PropTypes.bool,
  onShow: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onValidateError: PropTypes.func,
};

const { Item: FormItem } = Form;

const defaultProps = {
  title: null,
  width: 600,
  children: null,
  initialValues: {},
  formProps: {},
  drawerProps: {},
  okText: null,
  cancelText: null,
  okButtonProps: {},
  cancelButtonProps: {},
  checkFormEmpty: true,
  onShow: (show) => show(),
  onOk: (values, close) => close(),
  onCancel: () => {},
  onValidateError: () => {},
};

const Index = (props) => {
  const {
    title,
    width,
    formItems,
    initialValues,
    children,
    okText,
    cancelText,
    okButtonProps,
    cancelButtonProps,
    formProps,
    drawerProps,
    checkFormEmpty,
    onShow,
    onOk,
    onCancel,
    onValidateError,
  } = props;
  const { formatMessage } = useIntl();
  const formRef = useRef();
  const [visible, setVisible] = useControllableValue(props, {
    defaultValue: false,
    valuePropName: 'visible',
  });
  const timeout = useRef(-1);
  const timeUp = useRef(false);

  useEffect(() => {
    if (visible) {
      delayed(() => {
        if ('visible' in props) {
          onShow(noop, formRef);
        }
        formRef.current.resetFields();
      });
    }
  }, [visible, formRef]);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const onOkPro = (values) =>
    new Promise((resolve) => {
      onOk(
        values,
        () => {
          close();
          resolve();
        },
        () => {
          resolve();
        },
        formRef.current
      );
    });

  const onCancelPro = (e) => {
    if (formRef.current?.isFieldsTouched() && e?.target.nodeName === 'DIV' && !timeUp.current) {
      // 点击阴影触发
      message.info(formatMessage({ id: '再次点击关闭' }), 1.5);
      timeUp.current = true;
      timeout.current = setTimeout(() => {
        timeUp.current = false;
      }, 1500);
      return;
    }
    clearTimeout(timeout.current);
    timeUp.current = false;
    message.destroy();
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
      <DrawerForm
        formRef={formRef}
        title={title}
        open={visible}
        width={width}
        initialValues={initialValues}
        dateFormatter="number"
        submitter={{
          searchConfig: {
            submitText: okText || formatMessage({ id: '确定' }),
            resetText: cancelText || formatMessage({ id: '取消' }),
          },
          submitButtonProps: okButtonProps,
          resetButtonProps: cancelButtonProps,
          onReset: onCancelPro,
          render: (submitProps, doms) => [
            doms[0],
            <FormItem noStyle shouldUpdate key="submit">
              {({ getFieldsValue, isFieldsTouched }) => (
                <Badge dot count={isFieldsTouched() ? 1 : 0} status="warning">
                  {cloneElement(doms[1], {
                    disabled: checkFormEmpty ? !hasTruth(getFieldsValue()) : false,
                  })}
                </Badge>
              )}
            </FormItem>,
          ],
        }}
        drawerProps={{
          destroyOnClose: true,
          onClose: onCancelPro,
          ...drawerProps,
        }}
        omitNil={false}
        onFinish={onOkPro}
        onFinishFailed={onValidateError}
        {...formProps}
      >
        <ProFormItems group={formItems(formRef)} />
      </DrawerForm>
    </>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'DrawerForm';

export default Index;
