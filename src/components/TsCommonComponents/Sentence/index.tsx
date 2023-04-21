/**
 * @author zhangxu
 * @date 3/18/23 7:41 PM
 * @description 当一句话里有表单时，可以使用此组件，用法
 * @usage localKey：你好我的名字是<#>，我的年龄是<#>
 *        elements：[{ key: 'name', element: <Input /> }, { key: 'age', element: <InputNumber /> }]
 */
import React from 'react';
import { Space } from 'antd';
import type { SpaceProps } from 'antd';
import { useIntl } from '@umijs/max';
import { compact } from 'lodash';

interface Props {
  value: Record<string, any>;
  onChange?: (value: Record<string, any>) => void;
  // 国际化的key
  localeKey: string;
  // 表单数组
  elements: { key: string; element: React.ReactElement }[];
  id?: string;
  disabled?: boolean;
  wrapperProps?: SpaceProps;
}

const SEPARATE = '<#>';
const PLACEHOLDER = '<0>';

const Index: React.FC<Props> = (props) => {
  const { value = {}, onChange, id, localeKey, elements, disabled = false, wrapperProps } = props;
  const { formatMessage } = useIntl();
  const localeText = formatMessage({ id: localeKey }).replace(
    /<#>/g,
    `${SEPARATE}${PLACEHOLDER}${SEPARATE}`
  );
  const localeTextList = compact(localeText.split(SEPARATE));
  let elementsIndex = 0;

  return (
    <span id={id}>
      <Space size={2} {...wrapperProps}>
        {localeTextList.map((item, index) => {
          if (item === PLACEHOLDER) {
            const { key, element } = elements[elementsIndex];
            elementsIndex += 1;
            return React.cloneElement(element, {
              key: `${index + 1}`,
              value: value[key],
              disabled: element.props.disabled || disabled,
              onChange: (e: any) => {
                if (onChange) {
                  onChange({
                    ...value,
                    [key]: e?.target?.value || e,
                  });
                }
              },
            });
          }
          return <span key={`${index + 1}`}>{item}</span>;
        })}
      </Space>
    </span>
  );
};

Index.displayName = 'Sentence';

export default Index;
