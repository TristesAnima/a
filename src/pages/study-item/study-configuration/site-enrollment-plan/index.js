import { useProjectDict } from '@/hooks/Project';
import { isTruth } from '@/utils/Independent';
import { ProFormDependency, ProFormRadio } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Form, Space } from 'antd';
import { Day, FooterToolbar } from '../_components';

const { Group: ProFormRadioGroup } = ProFormRadio;
const { Item: FormItem } = Form;

const Index = () => {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const {
    yes_or_no: { list: yesOrNoList = [] },
  } = useProjectDict();

  return (
    <>
      <Form
        form={form}
        initialValues={{
          a: '2',
          b: {},
        }}
        onFinish={(values) => {
          console.log(values);
        }}
      >
        <ProFormRadioGroup
          label={formatMessage({ id: 'study-configuration.要求CRA制定入组计划时限' })}
          name="a"
          options={yesOrNoList.map((item) => ({
            label: item.value,
            value: item.code,
          }))}
        />
        <ProFormDependency name={['a']}>
          {({ a }) =>
            a === '1' && (
              <FormItem
                label={formatMessage({ id: 'study-configuration.在参研中心可填写' })}
                name="b"
                required
                rules={[
                  {
                    validator: (rule, value) => {
                      if (!value.day || !isTruth(value.dayType)) {
                        return Promise.reject(new Error(formatMessage({ id: '此项为必填项' })));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Day />
              </FormItem>
            )
          }
        </ProFormDependency>
        <Space>
          <Button type="primary" htmlType="submit">
            {formatMessage({ id: '保存' })}
          </Button>
          <Button
            htmlType="submit"
            onClick={() => {
              form.resetFields();
            }}
          >
            {formatMessage({ id: '重置' })}
          </Button>
        </Space>
      </Form>
      <FooterToolbar
        onPrev={(prev) => {
          prev();
        }}
        onNext={(next) => {
          next();
        }}
      />
    </>
  );
};

export default Index;
