/**
 * @author zhangxu
 * @date 8/28/22 6:50 PM
 * @description 替代antd的Modal的Confirm，因为antd的会读取不到外部的state的最新值
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import type { ModalProps } from 'antd';
import { useIntl } from '@@/exports';
import { useBoolean, useRequest } from 'ahooks';
import { Button, Modal, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type Props = ModalProps & {
  onOk?: () => Promise<undefined>;
};

const Index: React.ForwardRefRenderFunction<
  { open: () => void; close: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void },
  Props
> = (props, ref) => {
  const { title, onOk = () => Promise.resolve(), onCancel, ...rest } = props;

  const { formatMessage } = useIntl();
  const [visible, { setTrue: open, setFalse: close }] = useBoolean(false);
  const { run: runOnOk, loading: onOkLoading } = useRequest(onOk, {
    manual: true,
  });

  const openPro = () => {
    open();
  };

  const closePro = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    close();
    if (onCancel) {
      onCancel(e);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      open: openPro,
      close: closePro,
    }),
    []
  );

  return (
    <Modal
      {...rest}
      title={null}
      width={416}
      open={visible}
      footer={null}
      closable={false}
      bodyStyle={{
        padding: '32px 32px 24px',
      }}
      onCancel={closePro}
    >
      <Space size={16} align="start">
        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 22 }} />
        <b style={{ fontSize: 16 }}>{title}</b>
      </Space>
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button onClick={closePro}>{formatMessage({ id: '取消' })}</Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          loading={onOkLoading}
          onClick={() => runOnOk()}
        >
          {formatMessage({ id: '确定' })}
        </Button>
      </div>
    </Modal>
  );
};

const newIndex = forwardRef(Index);

newIndex.displayName = 'ModalConfirm';

export default newIndex;
