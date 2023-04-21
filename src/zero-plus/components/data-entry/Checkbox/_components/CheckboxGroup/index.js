import React from 'react';
import { Checkbox } from 'antd';
import { formatMessage } from '@umijs/max';

export default (props) => {
  const {
    showCheckallAction = false,
    renderCheckallAction = ({ config, disabled }) => {
      if (disabled) {
        return null;
      }
      return (
        <div
          style={{
            marginBottom: 7,
            paddingBottom: 7,
            borderBottom: '1px solid #e9e9e9',
          }}
        >
          <Checkbox {...config}>{formatMessage({ id: '全选' })}</Checkbox>
        </div>
      );
    },
    renderOptions = (options) => {
      return options.map(({ value: itemValue, label: itemLabel, ...rest }) => (
        <Checkbox {...rest} key={itemValue} value={itemValue}>
          {itemLabel}
        </Checkbox>
      ));
    },
    options,

    disabled = false,
    separator,
    value,
    // eslint-disable-next-line
    beforeChange = ({ resolve, reject, checkedValue }) => {
      resolve();
    },
    onChange,

    ...rest
  } = props;

  const newValue = (separator ? value?.split(separator)?.filter((item) => item) : value) || [];

  const newOnChange = (checkedValue) => {
    new Promise((resolve, reject) => {
      beforeChange({ resolve, reject, checkedValue });
    }).then(() => {
      onChange(separator ? checkedValue?.join(separator) : checkedValue);
    });
  };

  return (
    <>
      {showCheckallAction &&
        renderCheckallAction({
          config: {
            checked: newValue.length === options.length,
            indeterminate: newValue.length > 0 && newValue.length < options.length,
            onChange: (e) => {
              const checkedValue = e.target.checked ? options.map((item) => item.value) : [];
              newOnChange(checkedValue);
            },
          },

          options,
          disabled,
          value: newValue,
          onChange: newOnChange,
        })}

      <Checkbox.Group
        {...rest}
        disabled={disabled}
        value={newValue}
        onChange={(checkedValue) => {
          newOnChange(checkedValue);
        }}
      >
        {renderOptions(options)}
      </Checkbox.Group>
    </>
  );
};
