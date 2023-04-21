import { deleteProjectMilestone, getProjectMilestones } from '@/services/study-configuration';
import { formatMoment } from '@/utils/Independent';
import { formatResponseData } from '@/utils/Project';
import { getSessionStorageItem } from '@/zero-plus';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Delete } from '@/components/TsProjectComponents';
import { useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Space } from 'antd';
import { compact, forEach } from 'lodash';
import { useMemo } from 'react';
import { FooterToolbar } from '../_components';
import Edit from './_components/Edit';

const actionStyle = {
  fontSize: 16,
};

const Index = () => {
  const { formatMessage } = useIntl();
  const {
    data = [],
    loading,
    refresh,
  } = useRequest(async () =>
    formatResponseData(
      await getProjectMilestones({
        studyId: getSessionStorageItem('studyId'),
      })
    )
  );

  const sumWeight = useMemo(() => {
    let weight = 0;

    const computeWeight = (list = []) => {
      forEach(list, (item) => {
        weight += item.weight;
        if (item.children?.length) {
          computeWeight(item.children);
        }
      });
    };

    computeWeight(data);

    return weight;
  }, [data]);

  return (
    <>
      <ProTable
        size="small"
        ghost
        rowKey="id"
        options={false}
        loading={loading}
        dataSource={data}
        pagination={false}
        search={false}
        toolBarRender={() => [
          <Edit
            sumWeight={sumWeight}
            dataSource={data}
            key="add"
            portalId="add"
            data={{}}
            onOk={() => {
              refresh();
            }}
          >
            <Button type="primary">{formatMessage({ id: '新增' })}</Button>
          </Edit>,
        ]}
        columns={[
          {
            dataIndex: 'name',
            title: formatMessage({ id: 'study-configuration.计划名称' }),
            width: 200,
          },
          {
            dataIndex: 'planStartDate',
            title: formatMessage({ id: 'study-configuration.首次计划开始/结束日期' }),
            width: 200,
            render: (text, row) => {
              const startDate = formatMoment(text, 'YYYY-MM-DD');
              const endDate = formatMoment(row.planFinishDate, 'YYYY-MM-DD');
              return compact([startDate, endDate]).join(' / ');
            },
          },
          {
            dataIndex: 'actualStartDate',
            title: formatMessage({ id: 'study-configuration.实际计划开始/结束日期' }),
            width: 200,
            render: (text, row) => {
              const startDate = formatMoment(text, 'YYYY-MM-DD');
              const endDate = formatMoment(row.actualFinishDate, 'YYYY-MM-DD');
              return compact([startDate, endDate]).join(' / ');
            },
          },
          {
            dataIndex: 'weight',
            title: `${formatMessage({ id: '权重' })}（${sumWeight}%）`,
            width: 100,
            render: (text) => text && `${text}%`,
          },
          {
            dataIndex: 'note',
            title: formatMessage({ id: '备注' }),
          },
          {
            dataIndex: 'action',
            title: formatMessage({ id: '操作' }),
            width: 100,
            render: (_, row) => (
              <Space>
                <Edit
                  sumWeight={sumWeight}
                  dataSource={data}
                  portalId={row.id}
                  data={row}
                  onOk={() => {
                    refresh();
                  }}
                >
                  <a title={formatMessage({ id: '编辑' })} style={actionStyle}>
                    <EditOutlined />
                  </a>
                </Edit>
                <Edit
                  sumWeight={sumWeight}
                  dataSource={data}
                  portalId={`add-child-${row.id}`}
                  title={formatMessage({ id: '新增' })}
                  data={{
                    milestoneId: row.id,
                    parentId: row.uuid,
                  }}
                  onOk={() => {
                    refresh();
                  }}
                >
                  <a title={formatMessage({ id: '新增' })} style={actionStyle}>
                    <PlusOutlined />
                  </a>
                </Edit>
                <Delete
                  data={row}
                  service={deleteProjectMilestone}
                  onOk={() => {
                    refresh();
                  }}
                >
                  <a title={formatMessage({ id: '删除' })} style={actionStyle}>
                    <DeleteOutlined />
                  </a>
                </Delete>
              </Space>
            ),
          },
        ]}
      />
      <FooterToolbar />
    </>
  );
};

export default Index;
