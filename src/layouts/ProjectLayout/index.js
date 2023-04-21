import React, { useEffect } from "react";
import { history, Outlet, Link, useIntl, useModel } from '@umijs/max';
import { Select, Affix, PageHeader, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { parseInt } from 'lodash';
import PageContainer from '@/layouts/PageContainer';
import { getSessionStorageItem, setSessionStorageItem } from '@/zero-plus';
import { formatResponseData, getNameWithLanguage } from '@/utils/Project';
import { getStudiesPro } from '@/services/study';

const Index = () => {
  const { formatMessage } = useIntl();
  const { data: studies = [], loading: getStudiesProLoading } = useRequest(async (params) =>
    formatResponseData(await getStudiesPro(params))
  );
  const { run } = useModel('study-item.model');

  useEffect(() => {
    run();
  }, [run]);

  const redirect = () => {
    history.go(0);
  };

  return (
    <PageContainer>
      <Affix offsetTop={48}>
        <PageHeader
          style={{ marginBottom: 8, paddingBottom: 8 }}
          ghost={false}
          breadcrumb={
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/my-project">
                  <HomeOutlined /> &nbsp;
                  <span>{formatMessage({ id: 'menu.my-project' })}</span>
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Select
                  loading={getStudiesProLoading}
                  showSearch
                  optionFilterProp="children"
                  value={parseInt(getSessionStorageItem('studyId'))}
                  bordered={false}
                  style={{
                    maxWidth: 400,
                  }}
                  options={studies.map((item) => ({
                    label: getNameWithLanguage(item.studyName, item.studyNameEn),
                    value: item.id,
                  }))}
                  onSelect={(v) => {
                    setSessionStorageItem('studyId', v);
                    redirect();
                  }}
                />
              </Breadcrumb.Item>
            </Breadcrumb>
          }
        />
      </Affix>
      <Outlet />
    </PageContainer>
  );
};

export default Index;
