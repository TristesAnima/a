import { useMemo } from 'react';
import { useIntl } from '@umijs/max';

interface Options {
  deps?: any[];
  labelPropName?: string;
  valuePropName?: string;
  intl?: boolean;
}

/**
 * 管理数据字典
 * @param dictionaries {array} 数据源
 * @param options {?object} 配置项
 * @returns {array}
 */
export default function useDict<T extends Record<string, string | number>>(
  dictionaries: T[],
  options: Options
): [T[], Record<string | number, T>, Record<string, string | number>] {
  const { deps = [], labelPropName = 'label', valuePropName = 'value', intl = false } = options;
  const { formatMessage } = useIntl();

  // List
  const list = useMemo(
    () =>
      dictionaries.map((dict) =>
        intl
          ? {
              ...dict,
              [labelPropName]: dict[labelPropName] && formatMessage({ id: dict[labelPropName] }),
            }
          : dict
      ),
    deps
  );

  // Map
  const map = useMemo(
    () =>
      list.reduce((accumulator: Record<string, T>, currentValue) => {
        if (typeof currentValue === 'object') {
          accumulator[currentValue[valuePropName]] = currentValue;
        }
        return accumulator;
      }, {}),
    [list, valuePropName]
  );

  // enum
  const ENUM = useMemo(
    () =>
      list.reduce((accumulator: Record<string, string | number>, currentValue) => {
        const { enum: enumText, [valuePropName]: value } = currentValue;
        if (typeof currentValue === 'object' && enumText) {
          // eslint-disable-next-line no-param-reassign
          accumulator[enumText] = value;
        }
        return accumulator;
      }, {}),
    [list]
  );

  return [list, map, ENUM];
}
