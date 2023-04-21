import React from 'react';
import { useIntl, getLocale, useModel } from '@umijs/max';
import { Button, notification, Space, Typography } from 'antd';
import { ProTable } from '@/components/TsCommonComponents';
import { compact, isArray } from 'lodash';
import { useRequest } from 'ahooks';
import { Delete, ImportFile } from '@/components/TsProjectComponents';
import { getSites, deleteSite, downloadTemplate, importSites, exportSites } from '@/services/site';
import { useProjectDict } from '@/hooks/Project';
import { useMessage } from '@/hooks/Independent';
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
  const { country: { map: countryMap = {} } = {}, post_name: { map: postNameMap = {} } = {} } =
    useProjectDict();
  const {
    initialState: { currentUser },
  } = useModel('@@initialState');
  const { run: runExportSites, loading: exportSitesLoading } = useRequest(exportSites, {
    manual: true,
  });
  const message = useMessage();
  const localLanguage = getLocale();
  const isShowJa = localLanguage === ja;
  const isShowEn = localLanguage === en;

  const columns = [
    {
      dataIndex: 'number',
      title: formatMessage({ id: 'site.中心编号' }),
      hideInSearch: true,
      width: 150,
      fixed: 'left',
    },
    isShowJa && {
      dataIndex: 'name',
      title: formatMessage({ id: 'site.中心名称' }),
      width: 200,
    },
    isShowEn && {
      dataIndex: 'nameEn',
      hideInSearch: true,
      title: `${formatMessage({ id: 'site.中心名称' })}（EN）`,
      width: 200,
    },
    isShowJa && {
      dataIndex: 'address1',
      title: formatMessage({ id: 'site.所在地１' }),
      width: 150,
      hideInSearch: true,
    },
    isShowEn && {
      dataIndex: 'addressEn1',
      title: `${formatMessage({ id: 'site.所在地１' })}（EN）`,
      width: 150,
      hideInSearch: true,
    },
    isShowJa && {
      dataIndex: 'address2',
      title: formatMessage({ id: 'site.所在地2' }),
      width: 150,
      hideInSearch: true,
    },
    isShowEn && {
      dataIndex: 'addressEn2',
      title: `${formatMessage({ id: 'site.所在地2' })}（EN）`,
      width: 150,
      hideInSearch: true,
    },
    {
      dataIndex: 'telephoneNumber',
      title: formatMessage({ id: '电话' }),
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'country',
      title: formatMessage({ id: '国家' }),
      hideInSearch: true,
      renderText: (text) => countryMap[text]?.value,
      width: 100,
    },
    {
      dataIndex: 'postName',
      title: formatMessage({ id: 'site.实施医疗机构负责人的职称' }),
      hideInSearch: true,
      renderText: (text) => postNameMap[text]?.value,
      width: 100,
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
            title={formatMessage({ id: '编辑' })}
            data={record}
            onOk={() => {
              action.reload();
            }}
          >
            <a key="edit" title={formatMessage({ id: '编辑' })} style={actionStyle}>
              <EditOutlined />
            </a>
          </Edit>
          <Delete
            key="delete"
            service={(params) => deleteSite({ ...record, ...params })}
            onOk={() => {
              action.reload();
              action.clearSelected();
            }}
          >
            <a key="delete" title={formatMessage({ id: '删除' })} style={actionStyle}>
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
        const { data, total, success } = await getSites({
          ...params,
          dataScope: currentUser.identity,
        });
        if (!data.length && total) {
          const newParams = {
            ...params,
            current: params.current - 1,
            dataScope: currentUser.identity,
          };
          // 保护机制（当前页没有数据并且total大于0时自动请求上一页）
          return getSites(newParams);
        }
        return { data, total, success };
      }}
      rowSelection
      toolBarRender={({ reload }, { selectedRowKeys = [] }) => [
        <Button
          type="primary"
          loading={exportSitesLoading}
          key="export-all"
          style={{ display: 'none' }}
          onClick={() =>
            runExportSites({ ids: [] }).then((response) => {
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
          type="primary"
          loading={exportSitesLoading}
          disabled={!selectedRowKeys.length}
          key="export"
          style={{ display: 'none' }}
          onClick={() =>
            runExportSites({ ids: selectedRowKeys }).then((response) => {
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
          accept={['.xls', '.xlsx']}
          importService={importSites}
          downloadService={downloadTemplate}
          key="import"
          onOk={({ data }) => {
            if (isArray(data) && data.length) {
              notification.warning({
                message: formatMessage({ id: '提示' }),
                duration: null,
                description: (
                  <Typography>
                    {data.map((item, index) => (
                      <Paragraph key={`${index + 1}`}>
                        {!!item.site &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入没有中心提示' },
                            { name: item.nameChar, siteName: item.site }
                          )}
                        {'site' in item &&
                          !item.site &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入中心为空提示' },
                            { name: item.nameChar }
                          )}
                        {!!item.treatmentDepartmentName &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入没有科室提示' },
                            {
                              name: item.nameChar,
                              treatmentDepartmentName: item.treatmentDepartmentName,
                            }
                          )}
                        {'treatmentDepartmentName' in item &&
                          !item.errorType &&
                          !item.treatmentDepartmentName &&
                          formatMessage(
                            { id: 'contacts.导入科室为空提示' },
                            {
                              name: item.nameChar,
                            }
                          )}
                        {!!item.size &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入中心重复提示' },
                            {
                              siteName: item.siteNumber,
                              size: item.size,
                            }
                          )}
                        {!!item.nameChar &&
                          !!item.error &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.机种文字提示' },
                            { nameChar: item.nameChar, text: item.error }
                          )}
                        {'doctorType' in item &&
                          !!item.nameChar &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入中心文件担当医師为空提示' },
                            {
                              nameChar: item.nameChar,
                            }
                          )}
                        {'headOrgan' in item &&
                          !!item.nameChar &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入中心文件医疗机关长为空提示' },
                            {
                              nameChar: item.nameChar,
                            }
                          )}
                        {'crcType' in item &&
                          !!item.nameChar &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入中心文件CRC为空提示' },
                            {
                              nameChar: item.nameChar,
                            }
                          )}
                        {'email' in item &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入时联系人邮箱为空提示' },
                            {
                              nameChar: item.nameChar,
                            }
                          )}
                        {'namePinyin' in item &&
                          !item.errorType &&
                          formatMessage(
                            { id: 'contacts.导入时联系人拼音名称为空提示' },
                            {
                              nameChar: item.namePinyin,
                            }
                          )}
                        {item.errorType === '1' &&
                          formatMessage(
                            { id: 'contact.导入医疗机关英文名称为空提示' },
                            {
                              name: item.nameChar,
                            }
                          )}
                        {item.errorType === '2' &&
                          formatMessage(
                            { id: 'contact.导入医疗机关联系人医疗机关错误提示' },
                            {
                              nameChar: item.nameChar,
                              siteNum: item.site,
                            }
                          )}
                        {item.errorType === '3' &&
                          formatMessage(
                            { id: 'contact.导入医疗机关部门为空提示' },
                            {
                              name: item.nameChar,
                            }
                          )}
                        {item.errorType === '4' &&
                          formatMessage(
                            { id: 'contact.导入医療機関部门英文名为空提示' },
                            {
                              name: item.nameChar,
                            }
                          )}
                        {item.errorType === '5' &&
                          formatMessage(
                            { id: 'contact.导入実施医療機関の長の職名为空提示' },
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
          key="add"
          title={formatMessage({ id: '新增' })}
          data={{}}
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
