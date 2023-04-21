import { DeleteOutlined } from '@ant-design/icons';
import { ArrayTable } from '@formily/antd';
import { useIntl } from '@umijs/max';
import { Popconfirm } from 'antd';

const Index = function Index() {
  const index = ArrayTable.useIndex();
  const array = ArrayTable.useArray();
  const { formatMessage } = useIntl();

  return (
    <Popconfirm
      title={formatMessage({ id: '删除提示' })}
      placement="topRight"
      arrowPointAtCenter
      onConfirm={() => array.field.remove(index)}
    >
      <a
        title={formatMessage({ id: '删除' })}
        style={{
          fontSize: 16,
        }}
      >
        <DeleteOutlined />
      </a>
    </Popconfirm>
  );
};

export default Index;
