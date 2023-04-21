import * as PropTypes from 'prop-types';
import { useIntl } from '@umijs/max';
import { ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components';
import { noop } from 'lodash';
import { DrawerForm } from '@/components/TsCommonComponents';
import { useMessage } from '@/hooks/Independent';
import { saveStudy } from '@/services/study';
import { useProjectDict } from '@/hooks/Project';

const propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

const defaultProps = {
  onOk: noop,
  onCancel: noop,
};

const Index = (props) => {
  const { children, title, data, onOk, onCancel } = props;
  const { formatMessage } = useIntl();
  const messagePro = useMessage();
  const { study_phase: { list: studyPhaseList = [] } = {} } = useProjectDict();

  async function save(newData, reset, onError) {
    const params = { ...data, ...newData };
    const saveResult = await saveStudy(params);
    messagePro({
      response: saveResult,
      mode: 'save',
      onSuccess: () => {
        reset();
        onOk();
      },
      onError,
    });
    return saveResult.success;
  }

  const isEdit = !!data.id;

  return (
    <DrawerForm
      title={title}
      initialValues={data}
      okText={formatMessage({ id: '保存' })}
      onShow={(show) => {
        show();
      }}
      onOk={(...args) => save(...args)}
      onCancel={onCancel}
      formItems={() => ({
        defaultRowOption: {
          gutter: 32,
        },
        defaultColOption: {
          span: 24,
        },
        defaultCommonFormItemOption: {
          labelCol: {
            span: 24,
          },
          wrapperCol: {
            span: 24,
          },
        },
        content: [
          {
            element: (
              <ProFormText
                name="studyId"
                label={formatMessage({ id: 'study.研究编号' })}
                rules={[
                  {
                    required: true,
                  },
                ]}
                disabled={isEdit}
              />
            ),
          },
          {
            element: (
              <ProFormTextArea
                name="studyName"
                label={formatMessage({ id: 'study.研究名称' })}
                rules={[
                  {
                    required: true,
                  },
                ]}
                disabled={isEdit}
              />
            ),
          },
          {
            element: (
              <ProFormTextArea
                name="studyNameEn"
                label={formatMessage({ id: 'study.研究名称（英文）' })}
                rules={[
                  {
                    required: true,
                  },
                ]}
                disabled={isEdit}
              />
            ),
          },
          {
            element: (
              <ProFormSelect
                name="studyPhase"
                label={formatMessage({ id: 'study.试验阶段' })}
                options={studyPhaseList?.map((item) => ({
                  label: item.value,
                  value: item.code,
                }))}
                rules={[
                  {
                    required: true,
                  },
                ]}
                disabled={isEdit}
              />
            ),
          },
          {
            element: (
              <ProFormText
                name="projectManager"
                label={formatMessage({ id: 'study.项目经理' })}
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
            ),
          },
          {
            element: (
              <ProFormText
                name="sponsor"
                label={formatMessage({ id: 'study.申办方' })}
                disabled={isEdit}
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
            ),
          },
        ],
      })}
    >
      {children}
    </DrawerForm>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'Edit';

export default Index;
