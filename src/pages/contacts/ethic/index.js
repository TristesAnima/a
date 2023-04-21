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
import { getContacts, deleteEthicContacts } from '@/services/contacts';
import { getEthicsPro } from '@/services/ethic';
import { formatResponseData, getNameWithLanguage } from '@/utils/Project';
import { CONTACT_TYPE } from '../dict';
import Edit from './_components/Edit';

const actionStyle = {
  fontSize: 16,
};

const Index = () => {
  const { formatMessage } = useIntl();
  const { data: ethics = [], loading: getEthicsProLoading } = useRequest(async () =>
    formatResponseData(await getEthicsPro())
  );
  const [selectedEthic, setSelectedEthic] = useState(null);
  const actionRef = useRef({});

  const columns = [
    {
      dataIndex: 'nameChar',
      title: formatMessage({ id: 'contacts.氏名（漢字）' }),
      render: (text, record) => (
        <Space>
          {!!record.chairmanType && <CrownOutlined />}
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
          <Delete data={record} service={deleteEthicContacts} onOk={action.reload}>
            <a key="delete" title={formatMessage({ id: '删除' })} style={actionStyle}>
              <DeleteOutlined />
            </a>
          </Delete>
        </Space>
      ),
    },
  ];

  const ethicsDataSource = useMemo(
    () =>
      ethics.map((item) => ({
        value: item.id,
        children: getNameWithLanguage(item.name, item.nameEn),
      })),
    [ethics]
  );

  return (
    <ProCard split="vertical">
      <ProCard colSpan={4}>
        <Spin spinning={getEthicsProLoading}>
          <RadioList
            height={document.body.clientHeight - 300}
            showSearch
            options={ethicsDataSource}
            onChange={(value) => {
              const sponsor = ethics.find((item) => item.id === value);
              setSelectedEthic(sponsor);
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
              examinationCommitteeId: selectedEthic?.id,
            });
            if (!data.length && total) {
              const newParams = {
                ...params,
                current: params.current - 1,
                sponsorId: selectedEthic?.id,
              };
              // 保护机制（当前页没有数据并且total大于0时自动请求上一页）
              return getContacts(newParams);
            }
            return { data, total, success };
          }}
          params={{
            type: CONTACT_TYPE.ETHIC,
          }}
          headerTitle={getNameWithLanguage(selectedEthic?.name, selectedEthic?.nameEn)}
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
