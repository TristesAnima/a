import React from 'react';
import { history, useIntl } from '@umijs/max';
import { Button, Space, Radio, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTable } from '@/hooks/Independent';
import { formatMoment } from '@/utils/Independent';
import { Delete } from '@/components/TsProjectComponents';
import PageContainer from '@/layouts/PageContainer';
import { ProTable } from '@/components/TsCommonComponents';
import { getStudies, deleteStudy } from '@/services/study';
import { useProjectDict } from '@/hooks/Project';
import { setSessionStorageItem } from '@/zero-plus';
import Edit from './_components/Edit';

const { Group: RadioGroup } = Radio;

const actionStyle = {
  fontSize: 16,
};

const initialSearcher = {
  studyPhase: '',
  projectStatus: '',
};

const Index = () => {
  const { formatMessage } = useIntl();
  const {
    project_status: { list: projectStatusList = [] } = {},
    study_phase: { list: studyPhaseList = [], map: studyPhaseMap = {} } = {},
  } = useProjectDict();
  const {
    tableProps,
    searcher,
    setSearcher,
    refresh: refreshGetStudies,
  } = useTable(
    async (params) => {
      const {
        data: { datas, total },
      } = await getStudies(params);
      return {
        list: datas,
        total,
      };
    },
    {
      cacheKey: 'study',
      defaultSearcher: initialSearcher,
    }
  );

  const columns = [
    {
      dataIndex: 'studyId',
      title: formatMessage({ id: 'study.研究编号' }),
      fixed: 'left',
      width: 200,
      sorter: true,
      render: (text, row) => (
        <a
          onClick={() => {
            setSessionStorageItem('studyId', row.id);
            history.push('/study-item/study-configuration');
          }}
        >
          {text}
        </a>
      ),
    },
    {
      dataIndex: 'studyName',
      title: formatMessage({ id: 'study.研究名称' }),
      width: 300,
      sorter: true,
    },
    {
      dataIndex: 'studyPhase',
      title: formatMessage({ id: 'study.试验阶段' }),
      width: 100,
      renderFormItem: () => (
        <Select
          options={[
            {
              label: formatMessage({ id: '全部' }),
              value: '',
            },
            ...studyPhaseList.map((item) => ({
              label: item.value,
              value: item.code,
            })),
          ]}
        />
      ),
      render: (text) => studyPhaseMap[text]?.value,
    },
    {
      dataIndex: 'projectManager',
      title: formatMessage({ id: 'study.项目经理' }),
      hideInSearch: true,
      width: 150,
    },
    {
      dataIndex: 'sponsor',
      title: formatMessage({ id: 'study.申办方' }),
      hideInSearch: true,
      width: 150,
    },
    {
      dataIndex: 'a',
      title: formatMessage({ id: 'study.项目进度' }),
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'b',
      title: formatMessage({ id: 'study.入组进度' }),
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'c',
      title: formatMessage({ id: 'study.中心数' }),
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'd',
      title: formatMessage({ id: 'study.项目参与人' }),
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'gmtCreate',
      title: formatMessage({ id: '创建日期' }),
      hideInSearch: true,
      render: (text) => formatMoment(text, 'YYYY-MM-DD'),
    },
    {
      dataIndex: 'operation',
      title: formatMessage({ id: '操作' }),
      width: 100,
      valueType: 'option',
      fixed: 'right',
      render: (_text, row) => (
        <Space>
          <Edit
            title={formatMessage({ id: '编辑' })}
            data={row}
            onOk={() => {
              refreshGetStudies();
            }}
          >
            <a title={formatMessage({ id: '编辑' })} style={actionStyle}>
              <EditOutlined />
            </a>
          </Edit>
          <Delete
            service={(params) => deleteStudy({ ...params, ...row })}
            containerProps={{
              disabled: true,
            }}
            onOk={() => {
              refreshGetStudies();
            }}
          >
            <a title={formatMessage({ id: '删除' })} style={actionStyle} disabled>
              <DeleteOutlined />
            </a>
          </Delete>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        {...tableProps}
        headerTitle={
          <RadioGroup
            value={searcher.projectStatus}
            options={[
              {
                label: formatMessage({ id: '全部' }),
                value: '',
              },
              ...projectStatusList.map((item) => ({
                label: item.value,
                value: item.code,
              })),
            ]}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => {
              setSearcher({
                ...searcher,
                projectStatus: e.target.value,
              });
            }}
          />
        }
        scroll={{
          x: 'max-content',
        }}
        columns={columns}
        form={{
          initialValues: initialSearcher,
        }}
        onSubmit={(values) => {
          setSearcher({
            ...searcher,
            ...values,
          });
        }}
        onReset={() => {
          setSearcher(initialSearcher);
        }}
        toolBarRender={() => [
          <Edit
            key="add"
            title={formatMessage({ id: '新增' })}
            data={{}}
            onOk={() => {
              refreshGetStudies();
            }}
          >
            <Button type="primary">{formatMessage({ id: '新增' })}</Button>
          </Edit>,
        ]}
      />
    </PageContainer>
  );
};

export default Index;
