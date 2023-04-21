import React from 'react';
import { useIntl, useModel } from '@umijs/max';
import { Descriptions } from 'antd';
import { compact } from 'lodash';
import { useProjectDict } from '@/hooks/Project';

const { Item: DescriptionsItem } = Descriptions;

const Index = () => {
  const { formatMessage } = useIntl();
  const { study } = useModel('study-item.model');
  const { country: { map: countryMap = {} } = {} } = useProjectDict();

  return (
    <Descriptions bordered>
      <DescriptionsItem label={formatMessage({ id: 'study.研究名称' })} span={3}>
        {study.studyName}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study.研究名称（英文）' })} span={3}>
        {study.studyNameEn}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study.研究编号' })}>
        {study.studyId}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.方案号' })}>
        {study.protocolNo}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: '国家' })}>
        {compact(study.country?.map((item) => countryMap[item]?.value)).join(' / ')}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study.申办方' })}>
        {study.sponsor}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study.项目经理' })}>
        {study.projectManager}
      </DescriptionsItem>
    </Descriptions>
  );
};

export default Index;
