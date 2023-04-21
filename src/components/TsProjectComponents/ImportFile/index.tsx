import React, { useState } from 'react';
import type { ESignParams } from '@/typings/project';
import type { UploadFile } from 'antd';
import { Button, Form, Modal, Typography, Upload } from 'antd';
import { useIntl } from 'umi';
import { compact } from 'lodash';
import { useMessage } from '@/hooks/Independent';
import { MESSAGE_MODE } from '@/hooks/Independent/useMessage';
import type { ResponseType } from '@/typings/api';
import { eSign as openESign } from '@/components/TsProjectComponents';

const { Paragraph } = Typography;

type Props = {
  children: React.ReactElement;
  accept: string[];
  eSign?: ESignParams;
  downloadService: () => Promise<ResponseType>;
  importService: (params: { file: UploadFile; signature?: number }) => Promise<ResponseType>;
  onOk?: (params: ResponseType) => void;
  onCancel?: () => void;
  onDownload?: () => void;
};

const Index: React.FC<Props> = (props) => {
  const { children, accept, eSign, downloadService, importService, onOk, onCancel, onDownload } =
    props;
  const [visible, setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
  const { formatMessage } = useIntl();
  const [okBtnLoading, setOkBtnLoading] = useState(false);
  const messagePro = useMessage();

  const renderDownload = (): React.ReactNode => {
    const text = formatMessage({ id: 'import-file.导入说明2' });
    const reg = /<.+>/;
    const result = reg.exec(text);
    if (!result) {
      return null;
    }
    const { index } = result;
    const head = text.substring(0, index);
    const foot = text.substring(index + result[0].length, text.length);
    const downloadText = result[0].replace('<', '').replace('>', '');
    return (
      <>
        {head}
        <a
          onClick={() => {
            downloadService().then((response) =>
              messagePro({
                response,
                mode: MESSAGE_MODE.DOWNLOAD,
              })
            );
            if (onDownload) {
              onDownload();
            }
          }}
        >
          <b>{downloadText}</b>
        </a>
        {foot}
      </>
    );
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          setVisible(true);
        },
      })}
      <Modal
        open={visible}
        title={formatMessage({ id: 'import-file.导入数据' })}
        okButtonProps={{
          loading: okBtnLoading,
          disabled: !selectedFile,
        }}
        onOk={() => {
          if (!selectedFile) {
            return;
          }
          setOkBtnLoading(true);
          (eSign
            ? openESign(eSign).then((signature) => importService({ file: selectedFile, signature }))
            : importService({ file: selectedFile })
          )
            .then((response) =>
              messagePro({
                response,
                onSuccess: () => {
                  if (onOk) {
                    setSelectedFile(null);
                    onOk(response);
                  }
                },
              })
            )
            .finally(() => {
              setOkBtnLoading(false);
            });
        }}
        onCancel={() => {
          setVisible(false);
          setSelectedFile(null);
          if (onCancel) {
            onCancel();
          }
        }}
      >
        <Typography>
          <Paragraph>{formatMessage({ id: '说明' })}</Paragraph>
          <Paragraph>
            {formatMessage({ id: 'import-file.导入说明1' }, { accept: accept.join('、') })}
          </Paragraph>
          <Paragraph>{renderDownload()}</Paragraph>
          <Paragraph>{formatMessage({ id: 'import-file.导入说明注' })}</Paragraph>
        </Typography>
        <Form.Item label={formatMessage({ id: '选择文件' })} required>
          <Upload
            maxCount={1}
            accept={accept.toString()}
            fileList={compact([selectedFile])}
            onChange={(info) => {
              setSelectedFile(info.fileList[0]);
            }}
          >
            <Button type="primary">{formatMessage({ id: '选择文件' })}</Button>
          </Upload>
        </Form.Item>
      </Modal>
    </>
  );
};

Index.displayName = 'ImportFile';

export default Index;
