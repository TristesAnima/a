import { useIntl } from '@umijs/max';
import { InputNumber, Select, Space } from 'antd';

const Index = (props) => {
  const { formatMessage } = useIntl();
  const { value, onChange } = props;
  const { day, dayType } = value || {};
  return (
    <Space.Compact>
      <InputNumber
        value={day}
        placeholder={formatMessage({ id: '请输入' })}
        min={1}
        max={99}
        style={{
          width: 100,
        }}
        onChange={(v) => {
          onChange({
            ...value,
            day: v,
          });
        }}
      />
      <Select
        style={{
          width: 150,
        }}
        placeholder={formatMessage({ id: '请选择' })}
        value={dayType}
        options={[
          {
            label: formatMessage({ id: 'study-configuration.工作日' }),
            value: 1,
          },
          {
            label: formatMessage({ id: 'study-configuration.自然日' }),
            value: 2,
          },
        ]}
        onChange={(v) => {
          onChange({
            ...value,
            dayType: v,
          });
        }}
      />
    </Space.Compact>
  );
};

export default Index;
