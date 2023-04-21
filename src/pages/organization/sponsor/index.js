import { useMessage } from '@/hooks/Independent';
import { useProjectDict } from '@/hooks/Project';
import { deleteSponsor, exportSponsors, getSponsors } from '@/services/sponsor';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProTable } from '@/components/TsCommonComponents';
import { Delete } from '@/components/TsProjectComponents';
import { getLocale, useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Space } from 'antd';
import { compact } from 'lodash';
import Edit from './_components/Edit';
import ImportFile from './_components/ImportFile';

const actionStyle = {
  fontSize: 16,
};

const ja = 'zh-CN';
const en = 'en-US';

const Index = () => {
  const { formatMessage } = useIntl();
  const { country: { map: countryMap = {} } = {} } = useProjectDict();
  const { runAsync: runExportSponsors, loading: exportSponsorsLoading } = useRequest(
    exportSponsors,
    {
      manual: true,
    }
  );
  const message = useMessage();
  const localLanguage = getLocale();
  const isShowJa = localLanguage === ja;
  const isShowEn = localLanguage === en;

  const columns = [
    isShowJa && {
      dataIndex: 'name',
      title: formatMessage({ id: 'sponsor.公司名称' }),
      width: 200,
      fixed: 'left',
    },
    isShowEn && {
      dataIndex: 'nameEn',
      title: `${formatMessage({ id: 'sponsor.公司名称' })}（EN）`,
      hideInSearch: true,
      width: 200,
    },
    isShowJa && {
      dataIndex: 'address1',
      title: formatMessage({ id: 'site.所在地１' }),
      width: 200,
      hideInSearch: true,
    },
    isShowEn && {
      dataIndex: 'addressEn1',
      title: `${formatMessage({ id: 'site.所在地１' })}（EN）`,
      width: 200,
      hideInSearch: true,
    },
    isShowJa && {
      dataIndex: 'address2',
      title: formatMessage({ id: 'site.所在地2' }),
      width: 200,
      hideInSearch: true,
    },
    isShowEn && {
      dataIndex: 'addressEn2',
      title: `${formatMessage({ id: 'site.所在地2' })}（EN）`,
      width: 200,
      hideInSearch: true,
    },
    {
      dataIndex: 'telephoneNumber',
      title: formatMessage({ id: '电话' }),
      width: 150,
      hideInSearch: true,
    },
    {
      dataIndex: 'country',
      title: formatMessage({ id: '国家' }),
      hideInSearch: true,
      width: 100,
      renderText: (text) => countryMap[text]?.value,
    },
    {
      dataIndex: 'operation',
      title: formatMessage({ id: '操作' }),
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (text, record, index, action) => (
        <Space>
          <Edit
            data={record}
            title={formatMessage({ id: '编辑' })}
            onOk={() => {
              action.reload();
            }}
          >
            <a title={formatMessage({ id: '编辑' })} style={actionStyle}>
              <EditOutlined />
            </a>
          </Edit>
          <Delete
            data={record}
            service={(params) =>
              deleteSponsor({
                ...record,
                ...params,
              })
            }
            onOk={() => {
              action.reload();
              action.clearSelected();
            }}
          >
            <a title={formatMessage({ id: '删除' })} style={actionStyle}>
              <DeleteOutlined />
            </a>
          </Delete>
        </Space>
      ),
    },
  ];

  return (
    <ProTable
      columns={compact(columns)}
      request={async (params) => {
        const { data, total, success } = await getSponsors(params);
        if (!data.length && total) {
          const newParams = { ...params, current: params.current - 1 };
          // 保护机制（当前页没有数据并且total大于0时自动请求上一页）
          return getSponsors(newParams);
        }
        return { data, total, success };
      }}
      rowSelection
      scroll={{
        x: 'max-content',
      }}
      toolBarRender={({ reload }, { selectedRowKeys = [] }) => [
        <Button
          key="export"
          type="primary"
          loading={exportSponsorsLoading}
          style={{ display: 'none' }}
          onClick={() =>
            runExportSponsors({ ids: [] }).then((response) =>
              message({
                response,
                mode: 'download',
              })
            )
          }
        >
          {formatMessage({ id: '导出全部' })}
        </Button>,
        <Button
          key="download"
          type="primary"
          loading={exportSponsorsLoading}
          disabled={!selectedRowKeys.length}
          style={{ display: 'none' }}
          onClick={() =>
            runExportSponsors({ ids: selectedRowKeys }).then((response) =>
              message({
                response,
                mode: 'download',
              })
            )
          }
        >
          {formatMessage({ id: '导出' })}
          {selectedRowKeys.length ? `（${selectedRowKeys.length}）` : null}
        </Button>,
        <ImportFile key="import-file">
          <Button type="primary" style={{ display: 'none' }}>
            {formatMessage({ id: '批量导入' })}
          </Button>
        </ImportFile>,
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
  );
};

export default Index;
