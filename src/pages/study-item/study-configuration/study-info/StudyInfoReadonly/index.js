import React from 'react';
import { useIntl, useModel } from '@umijs/max';
import { Descriptions } from 'antd';
import { useProjectDict } from '@/hooks/Project';

const { Item: DescriptionsItem } = Descriptions;

const Index = () => {
  const { formatMessage } = useIntl();
  const { study } = useModel('study-item.model');
  const {
    study_phase: { map: studyPhaseMap = {} } = {},
    yes_or_no: { map: yesOrNoMap = {} } = {},
  } = useProjectDict();

  return (
    <Descriptions bordered>
      <DescriptionsItem label={formatMessage({ id: 'study.试验阶段' })}>
        {studyPhaseMap[study.studyPhase]?.value}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.研究产品' })}>
        {study.studyProduct}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.对照产品' })}>
        {study.controlProduct}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.适应症' })}>
        {study.indications}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.研究设计' })}>
        {study.studyDesign}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.研究人群' })}>
        {study.studyPopulation}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.是否未成年参与？' })}>
        {yesOrNoMap[study.underageParticipants]?.value}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.是否基因学检查' })}>
        {yesOrNoMap[study.geneticsCheck]?.value}
      </DescriptionsItem>
    </Descriptions>
  );
};

export default Index;
