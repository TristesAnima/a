import React from 'react';
import { useIntl, useModel } from "@umijs/max";
import { Descriptions } from 'antd';
import { useProjectDict } from '@/hooks/Project';

const { Item: DescriptionsItem } = Descriptions;

const Index = () => {
  const { formatMessage } = useIntl();
  const { study } = useModel('study-item.model');
  const { project_status: { map: projectStatusMap = {} } = {} } = useProjectDict();

  return (
    <Descriptions bordered>
      <DescriptionsItem label={formatMessage({ id: 'study.项目状态' })}>
        {projectStatusMap[study.projectStatus]?.value}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.首次计划开始日期' })}>
        {study.firstPlannedStartDate?.format('YYYY-MM-DD')}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.首次计划结束日期' })}>
        {study.firstPlannedEndDate?.format('YYYY-MM-DD')}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.计划受试者数' })}>
        {study.plannedSubjects}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: 'study-configuration.计划中心数' })}>
        {study.numberOfSites}
      </DescriptionsItem>
      <DescriptionsItem label={formatMessage({ id: '备注' })}>{study.note}</DescriptionsItem>
    </Descriptions>
  );
};

export default Index;
