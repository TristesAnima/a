import React from 'react';
import { useIntl, useModel } from "@umijs/max";
import { Descriptions, List } from 'antd';
import { DownloadOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { downloadStudyFile } from '@/services/study';
import { useMessage } from '@/hooks/Independent';
import { FilePreview } from '@/components/TsProjectComponents';

const { Item: DescriptionsItem } = Descriptions;
const { Item: ListItem } = List;

const Index = () => {
  const { formatMessage } = useIntl();
  const { study } = useModel('study-item.model');
  const {
    runAsync: runDownloadStudyFile,
    loading: downloadStudyFileLoading,
    params: downloadStudyFileParams = [],
  } = useRequest(downloadStudyFile, {
    manual: true,
  });
  const messagePro = useMessage();

  return (
    <Descriptions bordered>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.方案编号' })}>
        {study.protocolId}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.方案名称' })}>
        {study.protocolName}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.方案版本' })}>
        {study.protocolVersion}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study.申办方' })}>
        {study.sponsor}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.研究产品' })}>
        {study.studyProduct}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.适应症' })}>
        {study.indication}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.研究目的' })}>
        {study.studyPurpose}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.研究设计' })}>
        {study.studyDesign}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.入选标准' })}>
        {study.inclusionCriteria}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.排除标准' })}>
        {study.exclusionCriteria}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.退出标准' })}>
        {study.exitCriteria}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.研究终点' })}>
        {study.studyEndPoints}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: '附件' })} span={3}>
        <List
          size="small"
          dataSource={study.studyFileList || []}
          renderItem={(item) => (
            <ListItem
              actions={[
                <FilePreview
                  key="preview"
                  src={`${window.location.origin}/ctms/api/studyfiles/view/${item.id}/${item.fileName}`}
                >
                  <a title={formatMessage({ id: '预览' })} style={{ fontSize: 16 }}>
                    <EyeOutlined />
                  </a>
                </FilePreview>,
                <a
                  key="download"
                  title={formatMessage({ id: '下载' })}
                  style={{ fontSize: 16 }}
                  onClick={() => {
                    runDownloadStudyFile(item).then((response) => {
                      messagePro({
                        response,
                        mode: 'download',
                      });
                    });
                  }}
                >
                  {downloadStudyFileLoading && downloadStudyFileParams[0]?.id === item.id ? (
                    <LoadingOutlined />
                  ) : (
                    <DownloadOutlined />
                  )}
                </a>,
              ]}
            >
              {item.name}
            </ListItem>
          )}
        />
      </DescriptionsItem>
    </Descriptions>
  );
};

export default Index;
