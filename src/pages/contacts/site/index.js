import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { getLocale, useIntl, useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Space, Spin, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { getNameWithLanguage } from '@/utils/Project';
import { getSitesPro } from '@/services/site';
import { getContacts } from '@/services/contacts';
import { RadioList } from '@/components/TsCommonComponents';
import { CONTACT_TYPE } from '../dict';
import styles from '../index.less';
import Edit from './_components/Edit';

const actionStyle = {
  fontSize: 18,
};

const Index = () => {
  const { formatMessage } = useIntl();
  const actionRef = useRef({});
  const {
    initialState: { currentUser: { dataScope } = {} },
  } = useModel('@@initialState');
  const {
    data: { content: sites = [] } = {},
    loading: getSitesProLoading,
    refresh: refreshSiteList,
  } = useRequest(() => getSitesPro({ dataScope }), {
    ready: !!dataScope,
    formatResult: ({ success, data }) => (success ? data : []),
  });
  const [selectedSite, setSelectedSite] = useState(null);
  const language = getLocale();

  const columns = [
    {
      dataIndex: 'nameChar',
      title: formatMessage({ id: 'contacts.氏名（漢字）' }),
      formItemProps: {
        name: language === 'ja-JP' ? 'nameChar' : 'nameEn',
      },
      render: (text, record) => <a>{getNameWithLanguage(text, record.nameEn)}</a>,
    },
    {
      dataIndex: 'email',
      title: formatMessage({ id: '邮箱' }),
      hideInSearch: true,
    },
    {
      dataIndex: 'phone',
      title: formatMessage({ id: '联系方式' }),
      hideInSearch: true,
    },
    {
      dataIndex: 'userId',
      title: (
        <Space>
          <span>{formatMessage({ id: 'contacts.区分' })}</span>
          <Tooltip title={formatMessage({ id: 'contacts.区分.tip' })}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      ),
      hideInSearch: true,
      width: 100,
      renderText: (text) => (text ? 'S' : 'L'),
    },
    {
      dataIndex: 'operation',
      title: formatMessage({ id: '操作' }),
      valueType: 'option',
      width: 80,
      render: (_, record) => (
        <Space>
          <Edit initialValues={record} sitesConfig={{ sites, refreshSiteList, getSitesProLoading }}>
            <a title={formatMessage({ id: '编辑' })} style={actionStyle}>
              <EditOutlined />
            </a>
          </Edit>
          <a title={formatMessage({ id: '删除' })} style={actionStyle}>
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <ProCard split="vertical">
      <ProCard colSpan={4}>
        <Spin spinning={getSitesProLoading}>
          <RadioList
            height={document.body.clientHeight - 300}
            showSearch
            options={sites.map((item) => ({
              value: item.id,
              children: getNameWithLanguage(item.name, item.nameEn),
            }))}
            onChange={(value) => {
              const site = sites.find((item) => item.id === value);
              setSelectedSite(site);
              actionRef.current.reloadAndRest();
            }}
          />
        </Spin>
      </ProCard>
      <ProCard>
        <ProTable
          ghost
          revalidateOnFocus={false}
          actionRef={actionRef}
          size="small"
          rowKey="id"
          options={{
            density: false,
            fullScreen: false,
          }}
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            size: 'small',
            showSizeChanger: true,
          }}
          request={async (params) => {
            const { data, total, success } = await getContacts({
              ...params,
              siteId: selectedSite?.id,
            });
            if (!data.length && total) {
              const newParams = { ...params, current: params.current - 1 };
              // 保护机制（当前页没有数据并且total大于0时自动请求上一页）
              return getContacts({ ...newParams, siteId: selectedSite?.id });
            }
            return { data, total, success };
          }}
          params={{
            type: CONTACT_TYPE.SITE,
          }}
          search={{
            labelWidth: 'auto',
            searchText: formatMessage({ id: '搜索' }),
            optionRender: (searchConfig, formProps, dom) => dom.reverse(),
            className: styles['pro-table-search'],
          }}
          headerTitle={getNameWithLanguage(selectedSite?.name, selectedSite?.nameEn)}
          toolBarRender={() => [
            <Edit
              key="add"
              initialValues={{ siteId: selectedSite?.id }}
              sitesConfig={{ sites, refreshSiteList, getSitesProLoading }}
            >
              <Button type="primary">{formatMessage({ id: '新增' })}</Button>
            </Edit>,
          ]}
        />
      </ProCard>
    </ProCard>
  );
};

export default Index;
