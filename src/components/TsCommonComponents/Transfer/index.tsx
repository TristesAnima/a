import React from 'react';
import { useIntl } from '@umijs/max';
import { Spin, Transfer } from 'antd';
import type { TransferProps } from 'antd';

interface Props extends Omit<TransferProps<Record<string, any>>, 'targetKeys'> {
  id?: string;
  loading?: boolean;
  value: string[];
  onChange: (keys: string[]) => void;
}

const Index: React.FC<Props> = (props) => {
  const { id, loading = false, value, onChange, ...rest } = props;
  const { formatMessage } = useIntl();
  return (
    <Spin spinning={loading}>
      <span id={id}>
        <Transfer
          {...rest}
          locale={{
            ...rest.locale,
            searchPlaceholder: formatMessage({ id: '树搜索placeholder' }),
          }}
          listStyle={{
            width: '50%',
            height: 400,
          }}
          targetKeys={value}
          render={(item) => item.title}
          onChange={(e) => onChange(e)}
        />
      </span>
    </Spin>
  );
};

Index.displayName = 'Transfer';

export default Index;
