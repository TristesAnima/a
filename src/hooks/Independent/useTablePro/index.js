/**
 * @author zhangxu
 * @date 2021/2/25 1:59 下午
 * @description 前台分页
 */
import { useCreation, useUpdateEffect, useRequest } from 'ahooks';
import { useState } from 'react';
import { isEqual, noop } from 'lodash';
import useUrlState from '@ahooksjs/use-url-state';
import { parseJson } from '@/utils/Independent';
import { filterData } from './_util';

export default function useTablePro(service, options = {}) {
  const {
    rules: ruleProps = {},
    autoFirstQuery = true,
    cacheKey = '',
    formatSearcher,
    formatDataSource,
    searcherConfig = {},
    onSuccess = noop,
    onLoadData = noop,
    ...rest
  } = options;
  const [urlState, setUrlState] = useUrlState({
    state: JSON.stringify(ruleProps),
  });
  const [rules, setRules] = useState(parseJson(urlState.state || '') || ruleProps);
  const {
    runAsync: run,
    data: dataSourcePlus = [],
    loading: requestLoading,
    refresh,
  } = useRequest(
    async (params) => {
      const response = await service(params);
      const { success, data } = response;
      if (success) {
        onLoadData(response);
        return data;
      }
      return [];
    },
    {
      ...rest,
      manual: !autoFirstQuery,
      cacheKey,
      onSuccess: (...args) => {
        onSuccess(...args);
        setRules({
          ...rules,
          pagination: {
            current: 1,
            pageSize: 10,
          },
        });
      },
    },
  );

  useUpdateEffect(() => {
    if (cacheKey) {
      setUrlState({
        state: JSON.stringify(rules),
      });
    }
  }, [rules]);

  return useCreation(() => {
    const { searcher = {}, pagination = {}, sorter = {} } = rules;
    const searcherPlus = typeof formatSearcher === 'function' ? formatSearcher(searcher) : searcher;
    const { dataSource: filterDataSource, total } = filterData(
      dataSourcePlus || [],
      {
        searcher: searcherPlus,
        sorter,
        pagination,
      },
      {
        searcherConfig,
        formatDataSource,
      },
    );
    const tableProps = {
      dataSource: filterDataSource,
      pagination: {
        ...pagination,
        total,
        size: 'small',
      },
      sorter,
      loading: requestLoading,
      onChange: (newPagination, newSorter) => {
        setRules({
          ...rules,
          pagination: {
            current: newPagination.current,
            pageSize: newPagination.pageSize,
          },
          sorter: newSorter,
        });
      },
    };

    const query = (newRules = {}) => {
      const { searcher: newSearcher = {} } = newRules;
      if (!isEqual(newSearcher, searcherPlus)) {
        // 搜索变化则重置到第一页
        setRules({
          ...newRules,
          pagination: {
            current: 1,
            pageSize: pagination.pageSize,
          },
        });
      } else {
        setRules({
          ...rules,
          ...newRules,
        });
      }
    };

    return {
      tableProps,
      query,
      allDataSource: dataSourcePlus,
      reload: autoFirstQuery ? refresh : run,
      run,
    };
  }, [rules, dataSourcePlus, requestLoading]);
}
