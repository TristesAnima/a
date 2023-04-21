import type { ProColumns } from '@ant-design/pro-components';
import type {
  EditableProTableProps,
  RecordCreatorProps,
} from '@ant-design/pro-table/es/components/EditableTable';
import type { ProCoreActionType } from '@ant-design/pro-utils';
import type { ButtonProps } from 'antd';

interface MyRecordCreatorProps<T> extends Omit<RecordCreatorProps<T>, 'record'> {
  record?: T | ((index: number, dataSource: T[]) => T);
}

export interface MyEditableProTableProps<T extends Record<string, any>, U extends object>
  extends Omit<EditableProTableProps<T, U>, 'recordCreatorProps'> {
  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 是否能编辑
   */
  isEdit?: boolean;

  /**
   * 是否能删除
   */
  isDelete?: boolean;

  /**
   *  操作列配置项 但排除 `render` 方法，render方法被 `optionsColumnExt` 代替
   */
  optionsColumnConfig?: Omit<ProColumns<T>, 'render'>;

  /**
   * 将 `recordCreatorProps` 里的 `record` 配置项改为了选填 新增一行的唯一标识默认为时间戳
   */
  recordCreatorProps?:
    | (MyRecordCreatorProps<T> &
        ButtonProps & {
          creatorButtonText?: React.ReactNode;
        })
    | false;

  /**
   *  操作列扩展 渲染方法
   */
  optionsColumnExt?: (
    text: React.ReactNode,
    record: T,
    index: number,
    action: ProCoreActionType | undefined
  ) => React.ReactNode[];
}
