import type { CurrentUser } from '@/typings/project';
import { getFiletype, OnlineViewer } from '@/zero-plus';
import { useIntl, useModel } from '@umijs/max';
import { useControllableValue, useSize } from 'ahooks';
import type { DrawerProps } from 'antd';
import { Drawer, Empty, Image } from 'antd';
import produce from 'immer';
import type { WritableDraft } from 'immer/dist/internal';
import type { ReactElement } from 'react';
import React, { cloneElement, useRef } from 'react';

const FILE_TYPE = [
  '.gif',
  '.jpg',
  '.JPG',
  '.jpeg',
  '.JPED',
  '.png',
  '.PNG',
  '.pdf',
  '.PDF',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.mp3',
  '.wav',
  '.wma',
  '.mpeg',
  '.ogg',
  '.xml',
];

type Props = {
  src: string;
  children?: ReactElement;
  visible?: boolean;
  drawerProps?: DrawerProps;
  unPreview?: any;
  onClose?: () => void;
};

const Index: React.FC<Props> = (props) => {
  const {
    children,
    src,
    visible: visibleProps,
    drawerProps = {},
    onClose: onCloseProps = () => {},
  } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser }: { currentUser: CurrentUser } = initialState;
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useControllableValue(
    produce({}, (draftState: WritableDraft<{ visible: boolean }>) => {
      if (typeof visibleProps !== 'undefined') {
        draftState.visible = visibleProps;
      }
    }),
    { valuePropName: 'visible', defaultValue: false }
  );
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const filetype = getFiletype(src);
  const isPreview = FILE_TYPE.some((item) => item === `.${filetype}`);

  const onClose = () => {
    setVisible(false);
    onCloseProps();
  };

  return (
    <>
      {children &&
        cloneElement(children, {
          onClick: () => setVisible(true),
          disabled: !isPreview,
        })}

      {['.jpg', '.JPG', '.jpeg', '.JPED', '.png', '.PNG'].includes(`.${filetype}`) ? (
        <Image
          style={{ display: 'none' }}
          preview={{
            visible,
            src: `${src}?username=${currentUser.name}`,
            onVisibleChange: setVisible,
          }}
        />
      ) : (
        <Drawer
          open={visible}
          title={formatMessage({ id: '预览' })}
          width={1000}
          destroyOnClose
          onClose={onClose}
          {...drawerProps}
        >
          <div id="file-preview" ref={ref} style={{ height: '100%' }}>
            {isPreview ? (
              <OnlineViewer
                src={`${src}?username=${currentUser.name}`}
                filetype={src}
                style={{ height: size?.height }}
              />
            ) : (
              <Empty
                image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                description={
                  <span style={{ color: '#BFBFBF', fontSize: 14 }}>
                    {formatMessage({ id: '附件无法预览提示' })}
                    <br />
                    {formatMessage(
                      { id: '支持附件类型提示' },
                      {
                        type: FILE_TYPE.join('、'),
                      }
                    )}
                  </span>
                }
                style={{
                  marginTop: '20%',
                }}
              />
            )}
          </div>
        </Drawer>
      )}
    </>
  );
};

export default Index;
