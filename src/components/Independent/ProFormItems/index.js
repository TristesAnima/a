import React, { cloneElement } from 'react';
import * as PropTypes from 'prop-types';
import { Row, Col, Form, Tabs, Card, Collapse } from 'antd';
import { ProFormDependency } from '@ant-design/pro-components';

const { Item: FormItem } = Form;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const defaultProps = {};

const renderFormItem = (option) => {
  const { element, ...rest } = option;

  return cloneElement(element, rest);
};

const renderGroup = (group, index = 0) => {
  const {
    defaultRowOption = {},
    defaultColOption = {},
    defaultCommonFormItemOption = {},
    content = [],
  } = group;

  return (
    <Row {...defaultRowOption} key={`${index + 1}`}>
      {content.map((item, itemIndex) => {
        const {
          type = 'element',
          colOption = {},
          element,
          tabItems = [],
          tabProps = {},
          cardProps = {},
          collapseProps = {},
          hidden = {},
          name,
          ...rest
        } = item;
        const colKey = `${itemIndex + 1}`;
        const colOptionPlus = { ...defaultColOption, ...colOption };
        const formItemOptionPlus = {
          ...defaultCommonFormItemOption,
          element,
          ...rest,
        };
        const col = (
          <Col key={colKey} {...colOptionPlus}>
            {type === 'elements' && renderGroup(item.group, itemIndex)}
            {type === 'element' && renderFormItem(formItemOptionPlus)}
            {type === 'addition' && element}
            {type === 'empty' && null}
            {type === 'card' && (
              <FormItem>
                <Card title={<b>{rest.label}</b>} size="small" type="inner" {...cardProps}>
                  {renderGroup(item.group, itemIndex)}
                </Card>
              </FormItem>
            )}
            {type === 'collapse' && (
              <FormItem>
                <Collapse defaultActiveKey={['1']} {...collapseProps}>
                  <Panel header={rest.label} key="1">
                    {renderGroup(item.group, itemIndex)}
                  </Panel>
                </Collapse>
              </FormItem>
            )}
            {type === 'normal-tab' && (
              <Tabs {...tabProps}>
                {tabItems.map((tab) => {
                  const { key, title, group: tabGroup } = tab;
                  return (
                    <TabPane key={key} tab={title}>
                      {renderGroup(tabGroup, itemIndex)}
                    </TabPane>
                  );
                })}
              </Tabs>
            )}
            {type === 'shouldUpdate' && (
              <ProFormDependency name={name}>
                {(...args) =>
                  element
                    ? renderFormItem({
                        ...formItemOptionPlus,
                        element: element(...args),
                      })
                    : renderGroup(item.group(...args), itemIndex)
                }
              </ProFormDependency>
            )}
          </Col>
        );

        if (!hidden.name) {
          return col;
        }
        return (
          <ProFormDependency
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

const Index = (props) => {
  const { group } = props;
  return renderGroup(group, 0);
};

const propTypes = {
  group: PropTypes.object.isRequired,
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'ProFormItems';

export default Index;
