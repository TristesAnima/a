import { useMessage } from '@/hooks/Independent';
import { useProjectDict } from '@/hooks/Project';
import { deleteCRO, downloadTemplate, exportCROs, getCROs, importCROs } from '@/services/cro';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProTable } from '@/components/TsCommonComponents';
import { Delete, ImportFile } from '@/components/TsProjectComponents';
import { getLocale, useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, notification, Space, Typography } from 'antd';
import { compact, isArray } from 'lodash';
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
  const { run: runExportCros, loading: exportCrosLoading } = useRequest(exportCROs, {
    manual: true,
  });
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
            service={(params) => deleteCRO({ ...record, ...params })}
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
        const { data, total, success } = await getCROs(params);
        if (!data.length && total) {
          const newParams = { ...params, current: params.current - 1 };
          // 保护机制（当前页没有数据并且total大于0时自动请求上一页）
          return getCROs(newParams);
        }
        return { data, total, success };
      }}
      scroll={{
        x: 'max-content',
      }}
      toolBarRender={({ reload }, { selectedRowKeys = [] }) => [
        <Button
          key="export"
          type="primary"
          loading={exportCrosLoading}
          style={{ display: 'none' }}
          onClick={() =>
            runExportCros({ ids: [] }).then((response) => {
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
          key="download"
          type="primary"
          style={{ display: 'none' }}
          loading={exportCrosLoading}
          disabled={!selectedRowKeys.length}
          onClick={() =>
            runExportCros({ ids: selectedRowKeys }).then((response) => {
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
          importService={importCROs}
          downloadService={downloadTemplate}
          eSign={{
            authorityName: '关联机构:申办方-导入',
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
                        {!!item.size &&
                          formatMessage(
                            { id: 'contacts.导入CRO时CRO重复提示' },
                            { size: item.size, croName: item.sponsorName }
                          )}
                        {!!item.nameChar &&
                          item.croCompanyName &&
                          formatMessage(
                            { id: 'contacts.导入CRO时联系人的CRO不存在提示' },
                            { name: item.nameChar, croName: item.croCompanyName }
                          )}
                        {!!item.nameChar &&
                          !item.croCompanyName &&
                          !item.error &&
                          !('croAffiliationName' in item) &&
                          !item.ChargeMan &&
                          !('email' in item) &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入CRO时联系人的CRO为空提示' },
                            { name: item.nameChar }
                          )}
                        {!!item.nameChar &&
                          !!item.error &&
                          formatMessage(
                            { id: 'contacts.机种文字提示' },
                            { nameChar: item.nameChar, text: item.error }
                          )}
                        {!!item.croAffiliationName &&
                          formatMessage(
                            { id: 'contacts.导入CRO时联系人的所属不存在提示' },
                            {
                              name: item.nameChar,
                              croAffiliationName: item.croAffiliationName,
                            }
                          )}
                        {'croAffiliationName' in item &&
                          !item.croAffiliationName &&
                          formatMessage(
                            { id: 'contacts.导入CRO时联系人所属为空提示' },
                            {
                              name: item.nameChar,
                            }
                          )}
                        {item.type === 2 &&
                          item.ChargeMan &&
                          formatMessage(
                            { id: 'contacts.导入CRO时联系人负责人为空提示' },
                            {
                              nameChar: item.nameChar,
                            }
                          )}
                        {'email' in item &&
                          formatMessage(
                            { id: 'contacts.导入时联系人邮箱为空提示' },
                            {
                              nameChar: item.nameChar,
                            }
                          )}
                        {'namePinyin' in item &&
                          formatMessage(
                            { id: 'contacts.导入时联系人拼音名称为空提示' },
                            {
                              nameChar: item.namePinyin,
                            }
                          )}
                        {item.errorType === '1' &&
                          formatMessage(
                            { id: 'contact.导入CRO英文名称为空提示' },
                            {
                              name: item.nameChar,
                            }
                          )}
                        {item.errorType === '2' &&
                          formatMessage(
                            { id: 'contact.导入CRO英文名称重复提示' },
                            {
                              name: item.nameChar,
                            }
                          )}
                        {item.errorType === '3' &&
                          formatMessage(
                            { id: 'contact.导入CRO部门为空提示' },
                            {
                              name: item.nameChar,
                            }
                          )}
                        {item.errorType === '4' &&
                          formatMessage(
                            { id: 'contact.导入CRO部门英文名为空提示' },
                            {
                              name: item.nameChar,
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
