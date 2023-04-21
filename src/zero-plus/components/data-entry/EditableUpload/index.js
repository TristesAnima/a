import React from 'react';
import { formatMessage } from '@umijs/max';
import { Input } from 'antd';
import Form from '../../forms/Form';
import Upload from '../../uploads/Upload';
import EditableTable from '../EditableTable';

export default (props) => {
  const {
    append = false,

    rowKey = 'id',

    normalizeValue = (files) => {
      return files;
    },
    renderValue = ({ config }) => {
      return (
        <EditableTable
          {...config}
          columns={[
            ...config.columns,
            {
              title: formatMessage({ id: '备注' }),
              dataIndex: 'remark',
              render: (text, record) => {
                if (record.data_status === 'editing') {
                  return (
                    <Form.Item name="remark">
                      <Input />
                    </Form.Item>
                  );
                }
                return text;
              },
            },
          ]}
        />
      );
    },

    value,
    onChange,

    ...rest
  } = props;

  const newValue = (value || []).map((item) => {
    return {
      ...item,
      key: item.key || item.uid || `${item[rowKey]}`,
    };
  });

  return (
    <>
      <Upload
        {...rest}
        onAllComplete={(files) => {
          const newFiles = files.map((item) => ({
            ...item,
            uid: item.uid,
            name: item.name,
            size: item.size,
            type: item.type,
            file: item,
          }));
          if (append) {
            onChange(normalizeValue(newValue.concat(newFiles)));
          } else {
            onChange(normalizeValue(newFiles));
          }
        }}
      />

      {newValue.length !== 0 &&
        renderValue({
          value: newValue,
          onChange,
          config: {
            value: newValue,
            onChange,

            type: 'inline',
            renderHeaderAndFooter: () => {
              return {
                header: undefined,
                footer: undefined,
              };
            },
            columns: [
              {
                title: formatMessage({ id: '文件名' }),
                dataIndex: 'name',
              },
              {
                title: formatMessage({ id: '大小' }),
                dataIndex: 'size',
              },
              {
                title: formatMessage({ id: '类型' }),
                dataIndex: 'type',
              },
            ],
          },
        })}
    </>
  );
};
