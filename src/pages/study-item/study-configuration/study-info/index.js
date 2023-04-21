import React, { useState } from 'react';
import { useIntl, useModel } from '@umijs/max';
import { Form, Collapse, Card, Row, Col, Button, Spin, Modal } from 'antd';
import { useRequest, useUpdateEffect } from 'ahooks';
import { useMessage } from '@/hooks/Independent';
import { saveStudy, uploadStudyFiles } from '@/services/study';
import { FooterToolbar } from '../_components';
import ProjectInfoReadonly from './ProjectInfoReadonly';
import ProjectInfoEditable from './ProjectInfoEditable';
import StudyInfoReadonly from './StudyInfoReadonly';
import StudyInfoEditable from './StudyInfoEditable';
import ExecutiveInfoReadonly from './ExecutiveInfoReadonly';
import ExecutiveInfoEditable from './ExecutiveInfoEditable';
import ProtocolSummaryReadonly from './ProtocolSummaryReadonly';
import ProtocolSummaryEditable from './ProtocolSummaryEditable';

const { Panel } = Collapse;

function getStudy(study) {
  return {
    ...study,
    country: study.country.toString(),
    firstPlannedStartDate: study.firstPlannedStartDate && +study.firstPlannedStartDate,
    firstPlannedEndDate: study.firstPlannedEndDate && +study.firstPlannedEndDate,
  };
}

const Index = () => {
  const [editable, setEditable] = useState(false);
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const { study, refresh: refreshStudyItemStore, loading } = useModel('study-item.model');
  const messagePro = useMessage();

  useUpdateEffect(() => {
    if (editable) {
      form.resetFields();
    }
  }, [study, editable]);

  const saveStudyPro = async (values) => {
    const { studyFileList = [] } = values;
    const uploadFiles = studyFileList.filter((item) => !item.uploaded);
    const fileResponse = uploadFiles.length
      ? await uploadStudyFiles({ files: uploadFiles.map((item) => item.originFileObj) })
      : {
          success: true,
          data: [],
        };
    const response = await saveStudy(
      getStudy({
        ...study,
        ...values,
        studyFileList: fileResponse.success
          ? studyFileList.filter((item) => !item.size).concat(fileResponse.data)
          : studyFileList,
      })
    );
    messagePro({
      response,
      onSuccess: () => {
        refreshStudyItemStore();
      },
    });
  };
  const { run: runSaveStudy, loading: saveStudyLoading } = useRequest(saveStudyPro, {
    manual: true,
  });

  const items = [
    {
      key: 'basic-info',
      label: formatMessage({ id: 'study-configuration.基本信息' }),
      children: (
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <Card
              size="small"
              title={formatMessage({ id: 'study-configuration.项目信息' })}
              bordered={false}
            >
              {editable ? <ProjectInfoEditable /> : <ProjectInfoReadonly />}
            </Card>
          </Col>
          <Col span={24}>
            <Card
              size="small"
              title={formatMessage({ id: 'study-configuration.研究信息' })}
              bordered={false}
            >
              {editable ? <StudyInfoEditable /> : <StudyInfoReadonly />}
            </Card>
          </Col>
          <Col span={24}>
            <Card
              size="small"
              title={formatMessage({ id: 'study-configuration.执行信息' })}
              bordered={false}
            >
              {editable ? <ExecutiveInfoEditable /> : <ExecutiveInfoReadonly />}
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'schema-summary',
      label: formatMessage({ id: 'study-configuration.方案摘要' }),
      children: editable ? <ProtocolSummaryEditable /> : <ProtocolSummaryReadonly />,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Form form={form} initialValues={study} scrollToFirstError onFinish={runSaveStudy}>
        <Row gutter={[0, 16]}>
          {items.map((item) => (
            <Col span={24} key={item.key}>
              <Collapse defaultActiveKey={[item.key]}>
                <Panel key={item.key} header={item.label}>
                  {item.children}
                </Panel>
              </Collapse>
            </Col>
          ))}
        </Row>
        <FooterToolbar
          prevActions={
            editable ? (
              [
                <Button
                  key="cancel"
                  onClick={() => {
                    if (form.isFieldsTouched()) {
                      Modal.confirm({
                        title: formatMessage({ id: '未保存离开提示' }),
                        centered: true,
                        onOk: () => {
                          setEditable(false);
                        },
                      });
                    } else {
                      setEditable(false);
                    }
                  }}
                >
                  {formatMessage({ id: '取消' })}
                </Button>,
                <Button key="save" type="primary" htmlType="submit" loading={saveStudyLoading}>
                  {formatMessage({ id: '保存' })}
                </Button>,
              ]
            ) : (
              <Button
                key="edit"
                type="primary"
                onClick={() => {
                  setEditable(true);
                }}
              >
                {formatMessage({ id: '编辑' })}
              </Button>
            )
          }
          onNext={(next) => {
            next();
          }}
        />
      </Form>
    </Spin>
  );
};

export default Index;
