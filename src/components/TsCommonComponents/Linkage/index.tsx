import React from 'react';
import type { ColProps, RadioGroupProps } from 'antd';
import { Radio, Checkbox, Row, Col, Space } from 'antd';
import { isArray } from 'lodash';

type Props = RadioGroupProps & {
  name: string;
  linkedElements: { key: string; element: React.ReactElement; fulfillValue: any }[];
  colOption?: ColProps;
  disabled?: boolean;
  type?: 'Checkbox' | 'Radio';
  value: Record<string, any>;
  onChange: (value: Record<string, any> | undefined) => void;
};

const Index: React.FC<Props> = (props) => {
  const {
    name,
    linkedElements,
    disabled = false,
    type = 'Radio',
    value = {},
    onChange,
    options = [],
    colOption = {},
    ...rest
  } = props;
  const Element = type === 'Checkbox' ? Checkbox : Radio;
  const elementValue = value[name];

  return (
    <Element.Group
      {...rest}
      value={elementValue}
      disabled={disabled}
      onChange={(e) => {
        if (isArray(e)) {
          onChange({
            ...value,
            [name]: e,
          });
        } else {
          onChange({
            ...value,
            [name]: e.target.value,
          });
        }
      }}
    >
      <Row justify="start" align="middle" gutter={4}>
        {options.map((option) => {
          if (typeof option !== 'object') {
            return null;
          }
          const { label, value: optionValue } = option;
          const fulfillElement = linkedElements.find((linkedElement) => {
            if (!elementValue) {
              return false;
            }
            if (optionValue !== linkedElement.fulfillValue) {
              return false;
            }
            return isArray(elementValue)
              ? elementValue.includes(linkedElement.fulfillValue)
              : elementValue === linkedElement.fulfillValue;
          });
          return (
            <Col key={`${optionValue}`} {...colOption}>
              <Space size={0} align='center'>
                <Element value={optionValue}>{label}</Element>
                {fulfillElement &&
                  React.cloneElement(fulfillElement.element, {
                    value: value[fulfillElement.key],
                    onChange: (e: any) => {
                      if (e?.target) {
                        onChange({
                          ...value,
                          [fulfillElement.key]: e.target.value,
                        });
                      } else {
                        onChange(e);
                      }
                    },
                  })}
              </Space>
            </Col>
          );
        })}
      </Row>
    </Element.Group>
  );
};

Index.displayName = 'Linkage';

export default Index;
