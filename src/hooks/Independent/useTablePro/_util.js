import { orderBy } from 'lodash';

function parseSearcher(searcher = {}, config = {}) {
  const newSearcher = {};
  Object.keys(searcher).forEach((key) => {
    newSearcher[key] = {
      value: searcher[key],
      ...config[key],
    };
  });
  return newSearcher;
}

function isMatch(data, searcher) {
  const searchKeys = Object.keys(searcher);
  return searchKeys.every((key) => {
    const { type = 'text', value: searchValue, match } = searcher[key];
    if (typeof match === 'function') {
      return match(data, searchValue);
    }
    const { [key]: value } = data;
    if (type === 'text') {
      return !searchValue || value?.includes(searchValue.trim());
    }
    if (type === 'enum') {
      return searchValue === '' || value === searchValue;
    }
    return false;
  });
}

/**
 * 搜索
 * @param dataSource
 * @param searcher
 * @param searcherConfig
 * @returns {*[]}
 */
export function searchDataSource(dataSource = [], searcher = {}, searcherConfig = {}) {
  if (!Object.keys(searcher).length) {
    return dataSource;
  }
  const newSearcher = parseSearcher(searcher, searcherConfig);
  return dataSource.filter((item) => isMatch(item, newSearcher));
}

/**
 * 排序
 * @param dataSource
 * @param sorter
 * @returns {unknown[]|*[]}
 */
export function sortDataSource(dataSource = [], sorter = {}) {
  const { field, order } = sorter;
  if (!order) {
    // 不排序
    return dataSource;
  }
  const orderConfig = {
    ascend: 'asc',
    descend: 'desc',
  };
  return orderBy(dataSource, [field], [orderConfig[order]]);
}

/**
 * 分页
 * @param dataSource
 * @param pagination
 * @returns {*[]}
 */
export function pagingDataSource(dataSource = [], pagination = {}) {
  const { current, pageSize } = pagination;
  if (!Object.keys(pagination).length) {
    return dataSource;
  }
  const endIndex = current * pageSize;
  const startIndex = endIndex - pageSize;
  return dataSource.slice(startIndex, endIndex);
}

/**
 * 获取筛选后的数据
 * @param dataSource
 * @param rules
 * @param options
 * @returns {any[]}
 */
export function filterData(dataSource = [], rules = {}, options = {}) {
  const { pagination, sorter, searcher = {} } = rules;
  const { searcherConfig, formatDataSource } = options;
  const searchResult = searchDataSource(dataSource, searcher, searcherConfig);
  const sortResult = sortDataSource(searchResult, sorter);
  const pageResult = pagingDataSource(sortResult, pagination);
  const formatterDataSource =
    typeof formatDataSource === 'function' ? formatDataSource(pageResult, rules) : pageResult;
  return {
    dataSource: formatterDataSource,
    total: sortResult.length,
    allDataSource: sortResult,
  };
}
