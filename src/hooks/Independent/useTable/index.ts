import { useState } from 'react';
import { useAntdTable } from 'ahooks';
import { pick, parseInt } from 'lodash';
import useUrlState from '@ahooksjs/use-url-state';
import { getCache, setCache } from '@/utils/Independent';

interface Pagination {
  current: number;
  pageSize: number;
}
type Searcher = Record<string, any>;
interface Sorter {
  field: string;
  order: 'ascend' | 'descend';
}
type Service<TData> = (params: {
  searcher: Record<string, any>;
  pagination: Pagination;
  sorter: Partial<Sorter>;
}) => Promise<{ list: TData[]; total: number }>;
type Options = Parameters<typeof useAntdTable>[1] & {
  syncToUrl?: boolean;
  defaultPagination?: Pagination;
  defaultSearcher?: Record<string, any>;
  defaultSorter?: Partial<Sorter>;
};
interface CacheData {
  pagination?: Pagination;
  searcher?: Searcher;
  sorter?: Partial<Sorter>;
}
type UrlState = Partial<
  Pagination & Sorter & Omit<Searcher, 'current' | 'pageSize' | 'field' | 'order'>
>;

export default function useTable<TData extends Record<string, any>>(
  service: Service<TData>,
  options: Options = {}
) {
  const {
    cacheKey,
    defaultPagination = {
      current: 1,
      pageSize: 10,
    },
    defaultSearcher = {},
    defaultSorter = {},
    syncToUrl = false,
    ...rest
  } = options;

  const [urlState, setUrlState] = useUrlState<UrlState>({});

  const getInitialRules = (): {
    initialPagination: Pagination;
    initialSearcher: Searcher;
    initialSorter: Partial<Sorter>;
  } => {
    const {
      data: { pagination: cachePagination, searcher: cacheSearcher, sorter: cacheSorter } = {},
    }: { data?: CacheData } = cacheKey ? getCache(cacheKey) : {};
    if (!syncToUrl) {
      return {
        initialPagination: {
          ...defaultPagination,
          ...cachePagination,
        },
        initialSearcher: { ...defaultSearcher, ...cacheSearcher },
        initialSorter: { ...defaultSorter, ...cacheSorter },
      };
    }
    const { current, pageSize, field, order, ...searcher } = urlState;

    const initialPagination = {
      ...defaultPagination,
      ...cachePagination,
    };
    const initialSorter = {
      ...defaultSorter,
      ...cacheSorter,
    };
    if (current && pageSize) {
      initialPagination.current = parseInt(current);
      initialPagination.pageSize = parseInt(pageSize);
    }
    if (field && order) {
      initialSorter.field = field;
      initialSorter.order = order;
    }

    return {
      initialPagination,
      initialSearcher: {
        ...defaultSearcher,
        ...cacheSearcher,
        ...searcher,
      },
      initialSorter,
    };
  };
  const { initialPagination, initialSearcher, initialSorter } = getInitialRules();

  const [searcher, setSearcher] = useState<Searcher>(initialSearcher);

  const result = useAntdTable(
    async (params) => {
      const pagination = pick(params, ['current', 'pageSize']);
      const sorter: Partial<Sorter> = params.sorter.order
        ? pick(params.sorter, ['field', 'order'])
        : {};
      if (cacheKey) {
        setCache(cacheKey, {
          searcher,
          pagination,
          sorter,
        });
      }
      if (syncToUrl) {
        setUrlState({
          ...pagination,
          ...sorter,
          ...searcher,
        });
      }
      return service({
        searcher,
        pagination,
        sorter,
      });
    },
    {
      refreshDeps: [searcher],
      defaultParams: [
        {
          current: initialPagination.current || 1,
          pageSize: initialPagination.pageSize || 10,
          sorter: initialSorter,
        },
      ],
      ...rest,
    }
  );

  return {
    ...result,
    initialSorter,
    searcher,
    setSearcher,
  };
}
