/**
 * @author zhangxu
 * @date 3/18/23 6:01 PM
 * @description onChange可以返回指定option的属性
 */
import React from 'react';
import type { AutoCompleteProps } from 'antd';
import { AutoComplete } from 'antd';

interface Props extends AutoCompleteProps {
  // onChange时返回所选项目的属性
  optionLabelProp?: 'label' | 'value';
}

const Index: React.FC<Props> = (props) => {
  const { optionLabelProp = 'value', options, onChange, onSelect, ...rest } = props;

  return (
    <AutoComplete
      onChange={onChange}
      onSelect={(...args) => {
        const [value, option] = args;
        if (onChange && options) {
          onChange(options.find((item) => item.value === value)?.[optionLabelProp], option);
        }
        if (onSelect) {
          onSelect(...args);
        }
      }}
      {...rest}
    />
  );
};

Index.displayName = 'AutoComplete';

export default Index;
