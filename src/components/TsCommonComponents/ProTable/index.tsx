import type { ProTableProps } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import React from 'react';
import styles from './index.less';

type Props = ProTableProps<any, any>;

const Index: React.FC<Props> = (props) => {
  const { ghost, search, pagination = {}, options = {} } = props;

  return (
    <ProTable
      rowKey="id"
      columnEmptyText={false}
      tableAlertRender={false}
      revalidateOnFocus={false}
      size='small'
      {...props}
      search={
        search
          ? {
              labelWidth: 'auto',
              optionRender: (searchConfig, formProps, dom) => dom.reverse(),
              className: ghost ? styles['pro-table-search'] : undefined,
              ...search,
            }
          : search
      }
      pagination={{
        defaultPageSize: 10,
        size: 'small',
        showSizeChanger: true,
        ...pagination,
      }}
      options={{
        density: false,
        fullScreen: false,
        ...options,
      }}
    />
  );
};

Index.displayName = 'ProTable';

export default Index;
