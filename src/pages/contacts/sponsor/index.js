import React, { useRef, useState, useMemo } from 'react';
import { useIntl } from '@umijs/max';
import { Button, Space, Spin, Tooltip } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import {
  QuestionCircleOutlined,
  CrownOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { RadioList, ProTable } from '@/components/TsCommonComponents';
import { Delete } from '@/components/TsProjectComponents';
import { getContacts, deleteSponsorContacts } from '@/services/contacts';
import { useProjectDict } from '@/hooks/Project';
import { getSponsorsPro } from '@/services/sponsor';
import { formatResponseData, getNameWithLanguage } from '@/utils/Project';
import { CONTACT_TYPE } from '../dict';
import Edit from './_components/Edit';

const actionStyle = {
  fontSize: 16,
};

const Index = () => {
  const { formatMessage } = useIntl();
  const { affiliation_job: { list: affiliationJobList = [] } = {} } = useProjectDict();
  const { data: sponsors = [], loading: getSponsorsProLoading } = useRequest(async () =>
    formatResponseData(await getSponsorsPro())
  );
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const actionRef = useRef({});

  const columns = [
    {
      dataIndex: 'nameChar',
      title: formatMessage({ id: 'contacts.氏名（漢字）' }),
      render: (text, record) => (
        <Space>
          {!!record.ceo && <CrownOutlined />}
          {getNameWithLanguage(text, record.nameEn)}
        </Space>
      ),
    },
    {
      dataIndex: 'email',
      title: formatMessage({ id: '邮箱' }),
      hideInSearch: true,
      width: 150,
    },
    {
      dataIndex: 'phone',
      title: formatMessage({ id: '联系方式' }),
      hideInSearch: true,
      width: 150,
    },
    {
      dataIndex: 'sponsorId',
      title: formatMessage({ id: 'sponsor.申办方' }),
      hideInSearch: true,
      width: 200,
      valueEnum: sponsors.reduce(
        (previousValue, currentValue) => {
          previousValue[currentValue.id] = {
            text: getNameWithLanguage(currentValue.name, currentValue.nameEn),
          };
          return previousValue;
        },
        {
          0: {
            text: formatMessage({ id: '全部' }),
          },
        }
      ),
    },
    {
      dataIndex: 'affiliationName',
      title: formatMessage({ id: 'sponsor.所属' }),
      hideInSearch: true,
      renderText: (text, record) =>
        getNameWithLanguage(record.affiliationName, record.affiliationNameEn),
    },
    {
      dataIndex: 'affiliationJob',
      title: formatMessage({ id: 'contacts.职务' }),
      initialValue: '0',
      width: 100,
      valueEnum: affiliationJobList.reduce(
        (previousValue, currentValue) => {
          previousValue[currentValue.code] = {
            text: currentValue.value,
          };
          return previousValue;
        },
        {
          0: {
            text: formatMessage({ id: '全部' }),
          },
        }
      ),
      fieldProps: {
        allowClear: false,
      },
    },
    {
      dataIndex: 'userId',
      title: (
        <Space>
          <span>{formatMessage({ id: 'contacts.区分' })}</span>
          <Tooltip title={formatMessage({ id: 'contacts.区分.tip' })} placement="left">
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
      render: (text, record, index, action) => (
        <Space>
          <Edit
            data={record}
            title={formatMessage({ id: '编辑' })}
            onOk={() => {
              action.reload();
            }}
          >
            <a key="edit" title={formatMessage({ id: '编辑' })} style={actionStyle}>
              <EditOutlined />
            </a>
          </Edit>
          <Delete data={record} service={deleteSponsorContacts} onOk={action.reload}>
            <a key="delete" title={formatMessage({ id: '删除' })} style={actionStyle}>
              <DeleteOutlined />
            </a>
          </Delete>
        </Space>
      ),
    },
  ];

  const sponsorsDataSource = useMemo(
    () =>
      sponsors.map((item) => ({
        value: item.id,
        children: getNameWithLanguage(item.name, item.nameEn),
      })),
    [sponsors]
  );

  return (
    <ProCard split="vertical">
      <ProCard colSpan={4}>
        <Spin spinning={getSponsorsProLoading}>
          <RadioList
            height={document.body.clientHeight - 300}
            showSearch
            options={sponsorsDataSource}
            onChange={(value) => {
              const sponsor = sponsors.find((item) => item.id === value);
              setSelectedSponsor(sponsor);
              actionRef.current.reloadAndRest();
            }}
          />
        </Spin>
      </ProCard>
      <ProCard>
        <ProTable
          ghost
          actionRef={actionRef}
          columns={columns}
          search={{
            labelWidth: 'auto',
          }}
          request={async (params) => {
            const { data, total, success } = await getContacts({
              ...params,
              sponsorId: selectedSponsor?.id,
            });
            if (!data.length && total) {
              const newParams = {
                ...params,
                current: params.current - 1,
                sponsorId: selectedSponsor?.id,
              };
              // 保护机制（当前页没有数据并且total大于0时自动请求上一页）
              return getContacts(newParams);
            }
            return { data, total, success };
          }}
          params={{
            type: CONTACT_TYPE.SPONSOR,
          }}
          headerTitle={getNameWithLanguage(selectedSponsor?.name, selectedSponsor?.nameEn)}
          toolBarRender={({ reload }) => [
            <Edit
              data={{}}
              title={formatMessage({ id: '新增' })}
              key="add"
              onOk={() => {
                reload();
              }}
            >
              <Button key="add" type="primary">
                {formatMessage({ id: '新增' })}
              </Button>
            </Edit>,
          ]}
        />
      </ProCard>
    </ProCard>
  );
};

export default Index;
