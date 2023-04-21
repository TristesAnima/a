/**
 * @author zhangxu
 * @date 3/18/23 7:17 PM
 * @description 方便表单布局的组件
 */
import React, { cloneElement } from 'react';
import type { RowProps, ColProps, FormItemProps, TabsProps, CardProps, CollapseProps } from 'antd';
import type { ProFormDependencyProps, ProFormInstance } from '@ant-design/pro-components';
import { Card, Col, Collapse, Form, Row, Tabs } from 'antd';
import { ProFormDependency } from '@ant-design/pro-components';

type NamePath = string | number | (string | number)[];

type ContentItem = {
  // 渲染类型
  type?:
    | 'element'
    | 'elements'
    | 'addition'
    | 'empty'
    | 'card'
    | 'collapse'
    | 'normal-tab'
    | 'shouldUpdate';
  // 单独的Col属性
  colOption?: ColProps;
  element: React.ReactNode | ((values: any, form: ProFormInstance) => React.ReactNode);
  cardProps?: CardProps;
  tabProps?: TabsProps;
  collapseProps?: CollapseProps;
  tabItems?: { key: string; title: React.ReactNode; group: FormItemsType }[];
  hidden?: {
    name: NamePath[];
    get: ProFormDependencyProps['children'];
    ignoreFormListField?: ProFormDependencyProps['ignoreFormListField'];
  };
  name?: NamePath[];
  label?: React.ReactNode;
  group?: FormItemsType | ((values: any, form: ProFormInstance) => FormItemsType);
};

export interface FormItemsType {
  // 公用Row属性
  defaultRowOption?: RowProps;
  // 公用Col属性
  defaultColOption?: ColProps;
  // 公用FormItem属性
  defaultCommonFormItemOption?: Pick<
    FormItemProps,
    'labelCol' | 'wrapperCol' | 'colon' | 'preserve' | 'labelAlign'
  >;
  content: ContentItem[];
}

interface Props {
  group: FormItemsType;
}

const { Item: FormItem } = Form;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const renderFormItem = (option: FormItemProps & { element: React.ReactNode }) => {
  const { element, ...rest } = option;

  return React.isValidElement(element) ? cloneElement(element, rest) : element;
};

const renderGroup = (group: FormItemsType, index: number = 0) => {
  const {
    defaultRowOption = {},
    defaultColOption = {},
    defaultCommonFormItemOption = {},
    content = [],
  } = group || {};

  return (
    <Row {...defaultRowOption} key={`${index + 1}`}>
      {content.map((item, itemIndex) => {
        const {
          type = 'element',
          colOption,
          element,
          tabItems,
          tabProps,
          cardProps,
          collapseProps,
          hidden,
          name,
          label,
        } = item;
        const colKey = `${itemIndex + 1}`;
        const colOptionPlus = { ...defaultColOption, ...colOption };
        const formItemOptionPlus = {
          ...defaultCommonFormItemOption,
          element: element as React.ReactNode,
        };

        const col = (
          <Col key={colKey} {...colOptionPlus}>
            {(() => {
              switch (type) {
                case 'elements':
                  return renderGroup(item.group as FormItemsType, itemIndex);
                case 'element':
                  return renderFormItem(formItemOptionPlus);
                case 'addition':
                  return element as React.ReactNode;
                case 'empty':
                  return null;
                case 'card':
                  return (
                    <FormItem>
                      <Card title={<b>{label}</b>} size="small" type="inner" {...cardProps}>
                        {renderGroup(item.group as FormItemsType, itemIndex)}
                      </Card>
                    </FormItem>
                  );
                case 'collapse':
                  return (
                    <FormItem>
                      <Collapse defaultActiveKey={['1']} {...collapseProps}>
                        <Panel header={label} key="1">
                          {renderGroup(item.group as FormItemsType, itemIndex)}
                        </Panel>
                      </Collapse>
                    </FormItem>
                  );
                case 'normal-tab':
                  return (
                    <Tabs {...tabProps}>
                      {tabItems!.map((tab) => {
                        const { key, title, group: tabGroup } = tab;
                        return (
                          <TabPane key={key} tab={title}>
                            {renderGroup(tabGroup, itemIndex)}
                          </TabPane>
                        );
                      })}
                    </Tabs>
                  );
                case 'shouldUpdate':
                  return name ? (
                    <ProFormDependency name={name}>
                      {(...args) => {
                        if (typeof element === 'function') {
                          return renderFormItem({
                            ...formItemOptionPlus,
                            element: element(...args),
                          });
                        }
                        if (typeof item?.group === 'function') {
                          return renderGroup(item.group(...args), itemIndex);
                        }
                        return null;
                      }}
                    </ProFormDependency>
                  ) : null;
                default:
                  return null;
              }
            })()}
          </Col>
        );

        if (!hidden) {
          return col;
        }

        if (!hidden.name) {
          return col;
        }

        return (
          <ProFormDependency<Record<string, any>>
            name={hidden.name}
            key={colKey}
            ignoreFormListField={hidden.ignoreFormListField}
          >
            {(...args) =>
              hidden.get(...args)
                ? cloneElement(col, {
                    xxl: 0,
                    xl: 0,
                    lg: 0,
                    md: 0,
                    sm: 0,
                    xs: 0,
                  })
                : col
            }
          </ProFormDependency>
        );
      })}
    </Row>
  );
};

const Index: React.FC<Props> = (props) => {
  const { group } = props;
  return renderGroup(group, 0);
};

Index.displayName = 'ProFormItems';

export default Index;
