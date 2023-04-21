import React from 'react';
import { Form } from 'antd';
import type { FormListFieldData, FormListOperation, TabsProps, TabPaneProps } from 'antd';
import Tabs from './Tabs';

const { List: FormList } = Form;

export type Props = TabsProps & {
  children: React.ReactElement<{ fields: FormListFieldData[]; field: FormListFieldData }>;
  // key
  entity: string | number | (string | number)[];
  // 最少有几个
  least?: number;
  // 是否使用复制功能（右键复制）
  isCopy?: boolean;
  // 是否支持拖拽排序
  isSort?: boolean;
  // 是否只读
  readonly?: boolean;
  // 受控的activeKey
  changeKey?: string;
  // 缓存key，应对form.resetFields
  cacheKey?: string;
  // 自定义tab右上角内容
  tabBarExtraContent?: (
    fields: FormListFieldData[],
    add: FormListOperation['add']
  ) => React.ReactNode;
  // 新增时默认值
  initialRecord?: ((fields: FormListFieldData[]) => Record<string, any>) | Record<string, any>;
  // 自定义删除，返回null时用原生删除
  renderDelete?: (
    deleteFn: () => void,
    fields: FormListFieldData[],
    field: FormListFieldData,
    deleteComponent: React.ReactNode
  ) => React.ReactNode | null;
  // 自定义添加，返回null时用原生添加
  renderAdd?: (
    addFn: (record?: Record<string, any>) => void,
    fields: FormListFieldData[]
  ) => React.ReactNode | null;
  // 删除拦截器
  interceptDelete?: (
    fields: FormListFieldData[],
    field: FormListFieldData,
    deleteFn: () => void
  ) => void;
  // 自定义删除提示
  delText?: (field: FormListFieldData) => React.ReactNode;
  // 自定义Tab文字
  renderTab: (field: FormListFieldData) => React.ReactNode;
  tabPaneProps?: TabPaneProps;
  // 删除回调
  onDelete?: (field: FormListFieldData) => void;
  // 添加回调
  onAdd?: () => void;
  // 复制回调
  onCopy?: () => void;
  // activeKey变化回调
  onActiveKeyChange?: (activeKey: string, event: 'add' | 'remove' | 'changeKey' | 'manual') => void;
  // 过滤复制数据
  filterCopyData?: (
    copyRecord: Record<string, any>,
    values: Record<string, any>[]
  ) => Record<string, any>;
};

function Index(props: Props) {
  const { entity } = props;

  return (
    <FormList name={entity}>
      {(fields, action) => <Tabs fields={fields} action={action} {...props} />}
    </FormList>
  );
}

Index.displayName = 'TabsForm';

export default Index;
