import React, { cloneElement, useRef } from 'react';
import * as PropTypes from 'prop-types';
import { Drawer, Empty, Image } from 'antd';
import { useIntl, useModel } from '@umijs/max';
import produce from 'immer';
import { useControllableValue, useSize } from 'ahooks';
import { OnlineViewer, getFiletype } from '@/zero-plus';

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

const defaultProps = {
  children: null,
  unPreview: null,
  drawerProps: {},
  visible: undefined,
  onClose: () => {},
};

const Index = (props) => {
  const {
    children,
    visible: visibleProps,
    src,
    unPreview,
    drawerProps,
    onClose: onCloseProps,
  } = props;
  const ref = useRef();
  const size = useSize(ref);
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useControllableValue(
    produce({}, (draftState) => {
      if (typeof visibleProps !== 'undefined') {
        draftState.visible = visibleProps;
      }
    }),
    { valuePropName: 'visible', defaultValue: false },
  );
  const filetype = getFiletype(src);
  const isPreview = FILE_TYPE.some((item) => item === `.${filetype}`);
  const {
    initialState: { currentUser },
  } = useModel('@@initialState');

  if (!isPreview && unPreview) {
    return unPreview;
  }

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
                      },
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

Index.defaultProps = defaultProps;

Index.propTypes = {
  src: PropTypes.string.isRequired,
  children: PropTypes.node,
  visible: PropTypes.bool,
  drawerProps: PropTypes.object,
  unPreview: PropTypes.any,
  onClose: PropTypes.func,
};

export default Index;
