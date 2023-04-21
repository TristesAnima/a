import { getLocale } from '@umijs/max';
import { useMemo } from 'react';
import type { SYSTEM_LANGUAGE } from '@/enums/system';

/**
 * 优雅管理各个国际化配置的hook
 * @param args
 * @returns {*}
 */
export default function useLocaleConfig<T>(...args: T[]): T {
  const locale: keyof typeof SYSTEM_LANGUAGE = getLocale();

  return useMemo(() => {
    const localeGroup = ['zh-CN', 'en-US', 'ja-JP'];
    const index = localeGroup.findIndex((item) => item === locale);
    return args[index];
  }, [locale, args]);
}
