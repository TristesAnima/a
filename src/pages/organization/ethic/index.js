import React from 'react';
import { useIntl, getLocale } from '@umijs/max';
import { Button, notification, Space, Typography } from 'antd';
import { ProTable } from '@/components/TsCommonComponents';
import { compact, isArray } from 'lodash';
import { useRequest } from 'ahooks';
import { Delete, ImportFile } from '@/components/TsProjectComponents';
import {
  getEthics,
  deleteEthic,
  downloadTemplate,
  importEthics,
  exportEthics,
} from '@/services/ethic';
import { useMessage } from '@/hooks/Independent';
import { useProjectDict } from '@/hooks/Project';
import { getNameWithLanguage } from '@/utils/Project';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Edit from './_components/Edit';

const { Paragraph } = Typography;

const actionStyle = {
  fontSize: 16,
};

const ja = 'zh-CN';
const en = 'en-US';

const Index = () => {
  const { formatMessage } = useIntl();
  const { country: { map: countryMap = {} } = {} } = useProjectDict();
  const { run: runExportEthics, loading: exportEthicsLoading } = useRequest(exportEthics, {
    manual: true,
  });
  const message = useMessage();
  const localLanguage = getLocale();
  const isShowJa = localLanguage === ja;
  const isShowEn = localLanguage === en;

  const columns = [
    isShowJa && {
      dataIndex: 'name',
      title: formatMessage({ id: 'ethic.审查委员会名称' }),
      width: 200,
      fixed: 'left',
    },
    isShowEn && {
      dataIndex: 'nameEn',
      title: `${formatMessage({ id: 'ethic.审查委员会名称' })}（EN）`,
      hideInSearch: true,
      width: 200,
    },
    isShowJa && {
      dataIndex: 'address',
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
      dataIndex: 'country',
      title: formatMessage({ id: '国家' }),
      hideInSearch: true,
      renderText: (text) => countryMap[text]?.value,
      width: 100,
    },
    {
      dataIndex: 'corporationName',
      title: formatMessage({ id: 'ethic.法人名' }),
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'corporationDesignation',
      title: formatMessage({ id: 'ethic.法人番号' }),
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'siteName',
      title: formatMessage({ id: 'site.中心' }),
      hideInSearch: true,
      width: 200,
      renderText: (text, record) => getNameWithLanguage(text, record.siteNameEn),
    },
    {
      dataIndex: 'operation',
      title: formatMessage({ id: '操作' }),
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_text, record, index, action) => (
        <Space>
          <Edit
            title={formatMessage({ id: '编辑' })}
            data={record}
            onOk={() => {
              action.reload();
            }}
          >
            <a title={formatMessage({ id: '编辑' })} style={actionStyle}>
              <EditOutlined />
            </a>
          </Edit>
          <Delete
            key="delete"
            service={(params) => deleteEthic({ ...record, ...params })}
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
      scroll={{
        x: 'max-content',
      }}
      search={{
        labelWidth: 'auto',
      }}
      request={async (params) => {
        const { data, total, success } = await getEthics(params);
        if (!data.length && total) {
          const newParams = { ...params, current: params.current - 1 };
          // 保护机制（当前页没有数据并且total大于0时自动请求上一页）
          return getEthics(newParams);
        }
        return { data, total, success };
      }}
      rowSelection
      toolBarRender={({ reload }, { selectedRowKeys = [] }) => [
        <Button
          key="export-all"
          type="primary"
          loading={exportEthicsLoading}
          style={{ display: 'none' }}
          onClick={() =>
            runExportEthics({ ids: [] }).then((response) => {
              message({
                response,
                mode: 'download',
              });
            })
          }
        >
          {formatMessage({ id: '导出全部' })}
        </Button>,
        <Button
          key="export"
          type="primary"
          loading={exportEthicsLoading}
          style={{ display: 'none' }}
          disabled={!selectedRowKeys.length}
          onClick={() =>
            runExportEthics({ ids: selectedRowKeys }).then((response) => {
              message({
                response,
                mode: 'download',
              });
            })
          }
        >
          {formatMessage({ id: '导出' })}
          {selectedRowKeys.length ? `（${selectedRowKeys.length}）` : null}
        </Button>,
        <ImportFile
          key="import"
          accept={['.xls', '.xlsx']}
          importService={importEthics}
          downloadService={downloadTemplate}
          eSign={{
            authorityName: '关联机构:审查委员会-导入',
          }}
          onOk={({ data }) => {
            if (isArray(data) && data.length) {
              notification.warning({
                message: formatMessage({ id: '提示' }),
                duration: null,
                description: (
                  <Typography>
                    {data.map((item, index) => (
                      <Paragraph key={`${index + 1}`}>
                        {item.errorType === '1' &&
                          formatMessage(
                            { id: 'contacts.导入审查委员会没有医疗机关提示' },
                            { name: item.name, siteName: item.siteName }
                          )}
                        {item.errorType === '2' &&
                          formatMessage(
                            { id: 'contacts.导入审查委员会医疗机关重复提示' },
                            { siteName: item.siteName, size: item.size }
                          )}
                        {item.errorType === '3' &&
                          formatMessage(
                            { id: 'contacts.导入审查委员会医疗机关已被关联提示' },
                            { name: item.name, siteName: item.siteName }
                          )}
                        {item.errorType === '4' &&
                          formatMessage(
                            { id: 'contacts.导入审查委员会文件内重复提示' },
                            { name: item.name, size: item.size }
                          )}
                        {item.errorType === '5' &&
                          formatMessage(
                            { id: 'contacts.导入审查委员会联系人审查委员会不存在提示' },
                            {
                              nameChar: item.name,
                              examinationCommitteeName: item.examinationCommitteeName,
                            }
                          )}
                        {item.errorType === '6' &&
                          formatMessage(
                            { id: 'contacts.导入审查委员会已经存在委员长提示' },
                            { examinationCommitteeName: item.examinationCommitteeName }
                          )}
                        {item.errorType === '7' &&
                          formatMessage(
                            { id: 'contacts.导入审查委员会文件内委员长重复提示' },
                            {
                              examinationCommitteeName: item.examinationCommitteeName,
                              size: item.size,
                            }
                          )}
                        {item.errorType === '8' &&
                          formatMessage(
                            { id: 'contacts.导入审查委员会文件内委员长为空提示' },
                            {
                              nameChar: item.name,
                            }
                          )}
                        {item.errorType === '9' &&
                          formatMessage(
                            { id: 'contacts.导入审查委员会文件内事务局的人为空提示' },
                            {
                              nameChar: item.name,
                            }
                          )}
                        {!!item.name &&
                          !!item.error &&
                          formatMessage(
                            { id: 'contacts.机种文字提示' },
                            { nameChar: item.name, text: item.error }
                          )}
                        {'email' in item &&
                          formatMessage(
                            { id: 'contacts.导入时联系人邮箱为空提示' },
                            {
                              nameChar: item.name,
                            }
                          )}
                        {'namePinyin' in item &&
                          formatMessage(
                            { id: 'contacts.导入时联系人拼音名称为空提示' },
                            {
                              nameChar: item.namePinyin,
                            }
                          )}
                        {item.errorType === '10' &&
                          formatMessage(
                            { id: 'contact.导入审查委员会英文名称为空提示' },
                            {
                              name: item.name,
                            }
                          )}
                        {item.errorType === '11' &&
                          formatMessage(
                            { id: 'contact.导入审查委员会英文名称重复提示' },
                            {
                              name: item.name,
                            }
                          )}
                      </Paragraph>
                    ))}
                  </Typography>
                ),
              });
            }
            reload();
          }}
        >
          <Button type="primary" style={{ display: 'none' }}>
            {formatMessage({ id: '批量导入' })}
          </Button>
        </ImportFile>,
        <Edit
          key="add"
          data={{}}
          title={formatMessage({ id: '新增' })}
          onOk={() => {
            reload();
          }}
        >
          <Button type="primary">{formatMessage({ id: '新增' })}</Button>
        </Edit>,
      ]}
    />
  );
};

export default Index;
