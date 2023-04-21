import React, { useState } from 'react';
import { notification } from 'antd';
import { formatMessage } from '@umijs/max';
import { LoadingOutlined, AlertOutlined, CheckOutlined } from '@ant-design/icons';
import CompatibleUpload from '../_components/CompatibleUpload';
import useBeforeUpload from './_hooks/useBeforeUpload';

export default (props) => {
  const {
    action,

    // eslint-disable-next-line
    onFileComplete = (file) => {},

    // eslint-disable-next-line
    onAllComplete = (files) => {},

    autoCloseNotification = true,
    renderNotification = ({ fileList, ...rest }) => {
      notification.open({
        key: 'KEY_UPLOAD',

        duration: 0,
        style: {
          width: 500,
          marginLeft: 384 - 500,
          maxHeight: 400,
          overflow: 'auto',
        },
        message: formatMessage({ id: '上传结果' }),
        description: fileList.map((item, index) => (
          <div style={{ marginBottom: 5 }} key={index}>
            {item.status === 'uploading' && (
              <>
                <LoadingOutlined title={formatMessage({ id: '正在上传' })} />
                &nbsp;&nbsp;{`${item.name} - ${parseInt(item.percent, 10)}%`}
              </>
            )}

            {item.status === 'done' && (
              <>
                <CheckOutlined
                  style={{ color: '#52c41a' }}
                  title={formatMessage({ id: '上传成功' })}
                />
                &nbsp;&nbsp;{item.name}
              </>
            )}

            {item.status === 'error' && (
              <>
                <AlertOutlined
                  style={{ color: '#f5222d' }}
                  title={formatMessage({ id: '上传失败' })}
                />
                &nbsp;&nbsp;{item.name}
                {(item.response?.message || item.response) && (
                  <>
                    &nbsp;-&nbsp;
                    <span style={{ color: '#f5222d' }}>
                      {item.response?.message || item.response}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        )),

        ...rest,
      });
    },

    onChange,

    ...rest
  } = useBeforeUpload(props);

  const [controlledFileList, setControlledFileList] = useState([]);

  return (
    <CompatibleUpload
      {...rest}
      action={action}
      fileList={controlledFileList}
      onChange={(info) => {
        const { file, fileList } = info;

        if (fileList.length && renderNotification) {
          renderNotification({
            fileList,
            onClose: () => {
              setControlledFileList([]);
            },
          });
        }

        if (file.status === 'done') {
          onFileComplete(file);
          if (fileList.every((item) => item.status !== 'uploading')) {
            onAllComplete(fileList.filter((item) => item.status === 'done'));
          }

          if (autoCloseNotification && fileList.every((item) => item.status === 'done')) {
            renderNotification({
              fileList,
              duration: 3.5,
              onClose: () => {
                setControlledFileList([]);
              },
            });
          }
        }

        setControlledFileList(fileList);

        if (onChange) {
          onChange(info);
        }
      }}
    />
  );
};
