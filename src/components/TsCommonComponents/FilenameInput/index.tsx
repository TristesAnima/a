import React, { useMemo } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import { useIntl } from '@umijs/max';

type Props = InputProps & {
  value: string | undefined;
  onChange?: (value: string | undefined) => void;
};

const Index: React.FC<Props> = (props) => {
  const { value, onChange, ...rest } = props;
  const { formatMessage } = useIntl();

  const fileName = useMemo(() => {
    if (!value) {
      return undefined;
    }
    return value.substring(0, value.lastIndexOf('.'));
  }, [value]);

  const ext = useMemo(() => {
    if (!value) {
      return undefined;
    }
    return value.substring(value.lastIndexOf('.'), value.length);
  }, [value]);

  return (
    <Input
      value={fileName}
      placeholder={formatMessage({ id: '请输入' })}
      allowClear
      onChange={(e) => {
        if (onChange) {
          const v = e.target.value;
          if (typeof v !== 'string') {
            onChange(v);
            return;
          }
          onChange(v + ext);
        }
      }}
      addonAfter={ext}
      {...rest}
    />
  );
};

Index.displayName = 'FilenameInput';

export default Index;
