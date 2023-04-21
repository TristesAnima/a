import { useState } from 'react';
import { useIntl } from '@umijs/max';
import { Card, Steps, Affix } from 'antd';
import Context from './context';
import StudyInfo from './study-info';
import StudyMilestones from './study-milestones';
import StudyEnrollmentPlan from './study-enrollment-plan';
import SiteMilestones from './site-milestones';
import SiteEnrollmentPlan from './site-enrollment-plan';
import MonitoringStrategies from './monitoring-strategies';
import SiteQualification from './site-qualification';

const Index = () => {
  const { formatMessage } = useIntl();
  const [current, setCurrent] = useState(0);
  const [isStepsFixed, setIsStepsFixed] = useState(false);

  const items = [
    {
      title: formatMessage({ id: 'study-configuration.维护项目信息' }),
    },
    {
      title: formatMessage({ id: 'study-configuration.制定项目里程碑' }),
    },
    {
      title: formatMessage({ id: 'study-configuration.制定项目入组计划' }),
    },
    {
      title: formatMessage({ id: 'study-configuration.制定中心里程碑' }),
    },
    {
      title: formatMessage({ id: 'study-configuration.制定中心入组计划' }),
    },
    {
      title: formatMessage({ id: 'study-configuration.创建监查计划策略' }),
    },
    {
      title: formatMessage({ id: 'study-configuration.中心确认' }),
    },
  ];

  // rgba(240, 242, 245, 0.4)

  return (
    <Card bordered={false}>
      <Affix
        offsetTop={48}
        onChange={(affixed) => {
          setIsStepsFixed(affixed);
        }}
      >
        <div
          style={
            isStepsFixed
              ? {
                  padding: 4,
                  backgroundColor: 'rgba(240, 242, 245, 0.4)',
                  backdropFilter: 'blur(8px)',
                }
              : {}
          }
        >
          <Steps
            labelPlacement="vertical"
            current={current}
            items={items}
          />
        </div>
      </Affix>
      <Context.Provider
        value={{
          current,
          stepsLength: items.length,
          prev: () => {
            setCurrent(current - 1);
          },
          next: () => {
            setCurrent(current + 1);
          },
        }}
      >
        {current === 0 && <StudyInfo />}
        {current === 1 && <StudyMilestones />}
        {current === 2 && <StudyEnrollmentPlan />}
        {current === 3 && <SiteMilestones />}
        {current === 4 && <SiteEnrollmentPlan />}
        {current === 5 && <MonitoringStrategies />}
        {current === 6 && <SiteQualification />}
      </Context.Provider>
    </Card>
  );
};

export default Index;
