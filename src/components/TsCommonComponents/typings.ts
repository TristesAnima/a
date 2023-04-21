import type React from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { FormItemsType } from '@/components/TsCommonComponents/ProFormItems';
import type { ButtonProps } from 'antd';

export interface PortalProps {
  children?: React.ReactElement;
  formItems: (form?: ProFormInstance) => FormItemsType;
  visible?: boolean;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  // 是否需要：检查所有项目是否填写，未填写时不允许点击保存
  checkFormEmpty?: boolean;
  // 表单之外额外渲染的内容
  extraNode?: React.ReactNode;
  // 是否需要显示保存按钮更改角标提示
  showChangedTip?: boolean;
  renderFooter?: (doms: React.ReactNode[]) => React.ReactNode;
  onShow?: (show: () => void, form: ProFormInstance | undefined) => void;
  onOk?: (
    values: Record<string, any>,
    close: () => void,
    form: ProFormInstance | undefined
  ) => void;
  onCancel?: () => void;
  onValidateError?: () => void;
}
