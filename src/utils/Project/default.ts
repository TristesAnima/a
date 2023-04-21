import { getLocale } from '@umijs/max';
import type { ResponseType } from '@/typings/api';
import type { SystemUser } from '@/typings/project';
import { getTruth, isTruth } from '@/utils/Independent';
import { forEach, isArray, isObject, values } from 'lodash';

export function formatResponseData<T>(response: ResponseType<T>, errorData: any = []): T {
  const { success, data } = response;
  return success ? data : errorData;
}

export const download = (fileName: string, bytes: any) => {
  const link = document.createElement('a');
  const blob = new Blob([bytes]);
  link.target = '_blank';
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  link.click();
  // @ts-ignore
  URL.revokeObjectURL(blob);
};

export function downloadPro<T>(response: ResponseType<T>, fileName?: string) {
  const { headers } = response;
  const disposition = headers['content-disposition'] || '';
  const contents = disposition.split(';');
  const fileNameStr = contents[contents.length - 1];
  const fileNames = fileNameStr.split('=');
  let bFileName = fileNames[fileNames.length - 1];
  bFileName = bFileName.replace(/"/g, '');
  const content = response.data;
  download(fileName || decodeURI(bFileName), content);
}

export function getNameWithLanguage(nameJp: string, nameEn: string): string {
  const language = getLocale();
  if (language === 'zh-CN') {
    return nameJp;
  }
  if (!nameEn) {
    return nameJp;
  }
  if (language === 'en-US') {
    return nameEn;
  }
  return nameJp;
}

/**
 * 常规用户名显示
 */
export function parseUsername(user?: SystemUser): string | null {
  if (!user) {
    return null;
  }
  const { name, username } = user;
  if (!name && !username) {
    return null;
  }
  return `${getTruth(name)}（${getTruth(username)}）`;
}

export function hasTruth(data: Record<string, any> = {}): boolean {
  let result = false;
  forEach(values(data), (item) => {
    if (!isObject(item)) {
      result = isArray(item) ? !!item.length : isTruth(item);
    } else {
      result = hasTruth(item);
    }
    return !result;
  });
  return result;
}
