import React, { useRef, cloneElement, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useIntl } from '@umijs/max';
import { Form, Badge, Space } from 'antd';
import { isFunction } from 'lodash';
import { ModalForm } from '@ant-design/pro-components';
import { useControllableValue } from 'ahooks';
import { delayed } from '@/utils/Independent';
import ProFormItems from '../../ProFormItems';
import { hasTruth } from '../util';

const { Item: FormItem } = Form;

const defaultProps = {
  width: 400,
  title: null,
  children: null,
  initialValues: {},
  formProps: {},
  modalProps: {},
  okText: null,
  cancelText: null,
  okButtonProps: {},
  cancelButtonProps: {},
  checkFormEmpty: true,
  extraNode: null,
  showChangedTip: true,
  renderFooter: (doms) => <Space>{doms}</Space>,
  onShow: (show) => show(),
  onOk: (values, close) => close(),
  onCancel: () => {},
  onValidateError: () => {},
};

const Index = (props) => {
  const {
    width,
    title,
    formItems,
    initialValues,
    children,
    okText,
    cancelText,
    okButtonProps,
    cancelButtonProps,
    formProps,
    modalProps,
    checkFormEmpty,
    extraNode,
    showChangedTip,
    renderFooter,
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

  useEffect(() => {
    if (visible) {
      delayed(() => {
        if (props.hasOwnProperty('visible')) {
          onShow(formRef);
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
        formRef.current,
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
        layout="horizontal"
        width={width}
        title={title}
        formRef={formRef}
        open={visible}
        dateFormatter="YYYY-MM-DD HH:mm:ss"
        initialValues={initialValues}
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
        {...formProps}
      >
        <ProFormItems group={formItems(formRef)} />
        {extraNode}
      </ModalForm>
    </>
  );
};

const propTypes = {
  formItems: PropTypes.func.isRequired,
  title: PropTypes.node,
  width: PropTypes.number,
  initialValues: PropTypes.any,
  children: PropTypes.node,
  // eslint-disable-next-line react/require-default-props
  visible: PropTypes.bool,
  formProps: PropTypes.object,
  modalProps: PropTypes.object,
  okText: PropTypes.node,
  cancelText: PropTypes.node,
  okButtonProps: PropTypes.object,
  cancelButtonProps: PropTypes.object,
  checkFormEmpty: PropTypes.bool,
  extraNode: PropTypes.node,
  showChangedTip: PropTypes.bool,
  renderFooter: PropTypes.func,
  onShow: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onValidateError: PropTypes.func,
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'ModelForm';

export default Index;
