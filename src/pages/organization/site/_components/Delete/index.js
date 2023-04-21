import { DeleteOutlined } from '@ant-design/icons';
import { ArrayTable } from '@formily/antd';
import { useIntl } from '@umijs/max';
import { Popconfirm, message } from 'antd';
import { validateSiteTreatmentDepartment } from '@/services/contacts';

const Index = function Index() {
  const index = ArrayTable.useIndex();
  const array = ArrayTable.useArray();
  const record = ArrayTable.useRecord();
  const { formatMessage } = useIntl();

  return (
    <Popconfirm
      title={formatMessage({ id: '删除提示' })}
      placement="topRight"
      arrowPointAtCenter
      onConfirm={() => {
        if (record.id) {
          return validateSiteTreatmentDepartment(record).then(({ success, data }) => {
            if (success && !data) {
              array.field.remove(index).finally();
            } else {
              message.warn(formatMessage({ id: 'contacts.科室无法删除提示' }));
            }
          });
        }
        return array.field.remove(index);
      }}
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
