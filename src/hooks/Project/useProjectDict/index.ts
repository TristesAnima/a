import { useMemo } from 'react';
import { getLocale, useModel } from '@umijs/max';
import { SYSTEM_LANGUAGE } from '@/enums/system';

const language: keyof typeof SYSTEM_LANGUAGE = getLocale();

export default function useProjectDict(
  locale: 'zh' | 'en' | 'jp' = SYSTEM_LANGUAGE[language]
): any {
  const {
    initialState: { dict },
  } = useModel('@@initialState');

  return useMemo(() => dict[locale] || {}, [dict, locale]);
}
