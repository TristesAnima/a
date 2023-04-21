import React from 'react';
import { formatMessage } from '@umijs/max';
import { Upload, Button } from 'antd';
import classNames from 'classnames';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { getToken } from '../../../../../../utils/storage';
import styles from './index.less';

const { Dragger } = Upload;

export default (props) => {
  const {
    children,
    renderChildren = ({ type, disabled, accept, uploadText }) => {
      if (type === 'Dragger') {
        return (
          <div
            className={classNames(styles.draggerWrapper, { [styles.disabled]: disabled })}
            style={{ marginBottom: 12 }}
            title={accept}
          >
            <p className={styles.icon}>
              <InboxOutlined />
            </p>
            <p>{uploadText}</p>
          </div>
        );
      }
      return (
        <Button type="primary" style={{ marginBottom: 12 }} title={accept} disabled={disabled}>
          <UploadOutlined />
          {uploadText}
        </Button>
      );
    },
    type = 'Upload',
    disabled = false,
    accept = 'text/plain, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .rtf, .csv, .xml, .xlf, .zip, .rar, .png, .gif, .jpeg, .jpg, .svg',
    uploadText = formatMessage({ id: '上传文件' }),

    headers,
    ...rest
  } = props;

  const Element = type === 'Dragger' ? Dragger : Upload;

  return (
    <Element
      name="file"
      multiple
      {...rest}
      disabled={disabled}
      accept={accept}
      headers={{
        Authorization: getToken(),
        ...headers,
      }}
      showUploadList={false}
    >
      {children ||
        renderChildren({
          type,
          disabled,
          accept,
          uploadText,
        })}
    </Element>
  );
};
