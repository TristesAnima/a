import { useMessage } from '@/hooks/Independent';
import {
  deleteSiteMilestone,
  getSiteMilestones,
  saveSiteMilestonePlan,
} from '@/services/study-configuration';
import { formatMoment, isTruth } from '@/utils/Independent';
import { formatResponseData } from '@/utils/Project';
import { getSessionStorageItem } from '@/zero-plus';
import { Delete } from '@/components/TsProjectComponents';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Form, FormItem, Submit } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Space } from 'antd';
import { compact, forEach } from 'lodash';
import { useMemo } from 'react';
import { Day, FooterToolbar } from '../_components';
import Edit from './_components/Edit';

const actionStyle = {
  fontSize: 16,
};

const form = createForm();
const SchemaField = createSchemaField({
  components: {
    Form,
    FormItem,
    Day,
  },
});

const Index = () => {
  const { formatMessage } = useIntl();
  const messagePro = useMessage();
  const {
    data = {},
    loading,
    refresh,
  } = useRequest(
    async () =>
      formatResponseData(
        await getSiteMilestones({
          studyId: getSessionStorageItem('studyId'),
        })
      ),
    {
      onSuccess: (d) => {
        form.setInitialValues({
          sitePlan: {
            day: d.sitePlanDay,
            dayType: d.sitePlanType,
          },
        });
      },
    }
  );

  const sumWeight = useMemo(() => {
    const { siteMilestoneList } = data;
    let weight = 0;

    const computeWeight = (list = []) => {
      forEach(list, (item) => {
        weight += item.weight;
        if (item.children?.length) {
          computeWeight(item.children);
        }
      });
    };

    computeWeight(siteMilestoneList);

    return weight;
  }, [data]);

  const columns = [
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
      width: 120,
    },
    {
      dataIndex: 'note',
      title: formatMessage({ id: '备注' }),
    },
    {
      dataIndex: 'operation',
      title: formatMessage({ id: '操作' }),
      width: 100,
      valueType: 'option',
      render: (_text, row) => (
        <Space>
          <Edit
            dataSource={data.siteMilestoneList || []}
            sumWeight={sumWeight}
            title={formatMessage({ id: '编辑' })}
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
            dataSource={data.siteMilestoneList || []}
            sumWeight={sumWeight}
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
            service={deleteSiteMilestone}
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
  ];

  return (
    <>
      <Form form={form}>
        <Space align="baseline" size={0}>
          <SchemaField
            schema={{
              type: 'object',
              properties: {
                sitePlan: {
                  title: formatMessage({ id: 'study-configuration.要求CRA制定表单时限' }),
                  type: 'object',
                  'x-component': 'Day',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    feedbackLayout: 'popover',
                    asterisk: true,
                  },
                  'x-validator': [
                    {
                      validator: (value) => {
                        if (!value.day || !isTruth(value.dayType)) {
                          return formatMessage({ id: '此项为必填项' });
                        }
                        return true;
                      },
                    },
                  ],
                },
              },
            }}
          />
          <Submit
            type="link"
            onSubmit={async (values) => {
              const { sitePlan } = values;
              const { day, dayType } = sitePlan;
              const response = await saveSiteMilestonePlan({
                ...data,
                sitePlanDay: day,
                sitePlanType: dayType,
              });
              messagePro({
                response,
                onSuccess: () => {
                  refresh();
                },
              });
            }}
          >
            {formatMessage({ id: '保存' })}
          </Submit>
        </Space>
      </Form>
      <ProTable
        ghost
        dataSource={data.siteMilestoneList || []}
        loading={loading}
        columnEmptyText={false}
        size="small"
        rowKey="id"
        options={false}
        columns={columns}
        pagination={false}
        search={false}
        toolBarRender={() => [
          <Edit
            dataSource={data.siteMilestoneList || []}
            key="add"
            title={formatMessage({ id: '新增' })}
            sumWeight={sumWeight}
            data={{}}
            onOk={() => {
              refresh();
            }}
          >
            <Button type="primary">{formatMessage({ id: '新增' })}</Button>
          </Edit>,
        ]}
      />
      <FooterToolbar />
    </>
  );
};

export default Index;
