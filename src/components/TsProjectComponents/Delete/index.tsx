import React from 'react';
import type { PopconfirmProps } from 'antd';
import { useIntl } from '@umijs/max';
import { Popconfirm } from 'antd';
import { useMessage } from '@/hooks/Independent';
import type { ESignParams, Service } from '@/typings/project';
import type { Noop } from '@/typings/api';
import { eSign as openESign } from '@/components/TsProjectComponents';

type Props = React.PropsWithChildren<{
  service: Service;
  eSign?: ESignParams;
  containerProps?: PopconfirmProps;
  showMessage?: boolean;
  onOk?: Noop;
  onCancel?: Noop;
}>;

const Index: React.FC<Props> = (props) => {
  const { children, service, eSign, containerProps, showMessage, onOk, onCancel } = props;
  const { formatMessage } = useIntl();
  const messagePro = useMessage();

  const onConfirm = (params?: { signature: number }) =>
    service(params).then(({ success, data: responseData }) => {
      if (showMessage) {
        messagePro({
          success,
          errorText: responseData?.message,
          onSuccess: () => {
            if (onOk) {
              onOk();
            }
          },
        }).finally();
      } else if (success) {
        if (onOk) {
          onOk();
        }
      }
    });

  return (
    <Popconfirm
      title={formatMessage({ id: '删除提示' })}
      {...containerProps}
      onConfirm={() =>
        eSign
          ? openESign(eSign).then((signature) => onConfirm({ signature: signature! }))
          : onConfirm()
      }
      onCancel={() => {
        if (onCancel) {
          onCancel();
        }
      }}
    >
      {children}
    </Popconfirm>
  );
};

Index.displayName = 'Delete';

export default Index;
