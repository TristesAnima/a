import { InputNumber, Space } from 'antd';

interface Props {
  id?: string;
  value?: { firstNumber: number; secondNumber: number };
  disabled?: boolean;
  onChange?: ({
    firstNumber,
    secondNumber,
  }: {
    firstNumber?: number | null;
    secondNumber?: number | null;
  }) => void;
}

const Index = (props: Props) => {
  const { id, value, disabled, onChange = () => {} } = props;
  const { firstNumber, secondNumber } = value || {};

  return (
    <Space>
      <InputNumber
        id={id}
        min={secondNumber}
        max={999}
        value={firstNumber}
        disabled={disabled}
        onChange={(newValue) => {
          onChange({
            ...value,
            firstNumber: newValue,
          });
        }}
      />
      （
      <InputNumber
        min={0}
        max={firstNumber}
        value={secondNumber}
        disabled={disabled}
        onChange={(newValue) => {
          onChange({
            ...value,
            secondNumber: newValue,
          });
        }}
      />
      ）
    </Space>
  );
};

Index.displayName = 'QuantityNumber';

export default Index;
