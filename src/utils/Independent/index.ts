import { forEach } from 'lodash';
import moment from 'moment';

/**
 * 判断是否是真值（0也是真值）
 */
export function isTruth(value: any): boolean {
  return value === 0 || !!value;
}

/**
 * 如果是真值，则返回，否则返回null
 */
export function getTruth<T>(value: T): T | null {
  return isTruth(value) ? value : null;
}

/**
 * 延迟执行函数
 */
export function delayed(fn: Function) {
  setTimeout(fn, 0);
}

/**
 * 校验文件
 */
export function validateFile(file: File): { success: boolean; msg?: string } {
  if (!file) {
    return {
      success: true,
    };
  }
  const { name } = file;
  if (name.includes(',')) {
    return {
      success: false,
      msg: '文件名称中不允许含有逗号',
    };
  }
  return {
    success: true,
  };
}

/**
 * 校验文件列表
 */
export function validateFiles(files: File[]): { success: boolean; msg?: string | null } {
  if (!files?.length) {
    return {
      success: true,
    };
  }
  let success = true;
  let msg = null;
  forEach(files, (item) => {
    const validateResult = validateFile(item);
    success = validateResult.success;
    msg = validateResult.msg;
    return success;
  });
  return {
    success,
    msg,
  };
}

/**
 * 拍平树
 */
export function flattenTree(data: any[]): any[] {
  const result: any[] = [];
  data.forEach((item) => {
    const { children, ...rest } = item;
    result.push(rest);
    if (children?.length) {
      result.push(...flattenTree(children));
    }
  });
  return result;
}

/**
 * 使Promise函数暂停指定时间
 */
export function delay(num: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, num);
  });
}

/**
 * 将数组中指定两个下标的元素调换（改变原数组）
 */
export function arrayMoveMutable(array: any[], fromIndex: number, toIndex: number) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;
    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

/**
 * 将数组中指定两个下标的元素调换（不改变原数组）
 */
export function arrayMoveImmutable(array: any[], fromIndex: number, toIndex: number) {
  const newArray = [...array];
  arrayMoveMutable(newArray, fromIndex, toIndex);
  return newArray;
}

/**
 * 排序
 */
export function sorter(a: any, b: any): number {
  if (!a && !b) {
    return 0;
  }
  if (!a || !b) {
    if (!a) {
      return -1;
    }
    return 1;
  }
  if (typeof a === 'string' || typeof b === 'string') {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    // names must be equal
    return 0;
  }
  if (typeof a === 'number' || typeof b === 'number') {
    return a - b;
  }
  return 0;
}

export function setDataLevel<T extends { children: T[] }>(dataSource: T[], level: number): T[] {
  const result = dataSource.map((item) => ({
    ...item,
    level,
  }));
  return result.map((item) => {
    const { children } = item;
    level += 1;
    if (!children?.length) {
      return item;
    }
    return {
      ...item,
      children: setDataLevel(children, level),
    };
  });
}

/**
 * 在字符串指定的位置替换成新的字符串
 */
export function replaceStrByPosition(
  str: string,
  newStr: string,
  left: number,
  right: number
): string {
  if (!str) {
    return newStr;
  }
  const leftStr = str.substring(0, left);
  const rightStr = str.substring(left === right ? right : right + 1, str.length + 1);
  return leftStr + newStr + rightStr;
}

/**
 * 在数组中找到指定的元素
 * @param treeData
 * @param iteratee
 */
export function findInTree(treeData = [], iteratee: (item: any) => boolean) {
  let result = null;
  forEach(treeData, (item) => {
    const matched = iteratee(item);
    if (matched) {
      result = item;
      return false;
    }
    const { children = [] } = item;
    if (!children?.length) {
      return true;
    }
    const childrenResult = findInTree(children, iteratee);
    if (childrenResult) {
      result = childrenResult;
      return false;
    }
    return true;
  });
  return result;
}

/**
 * 将字符串格式化为moment
 * @param str
 * @param format
 */
export function formatMoment(str: string, format: string): string | null {
  if (!str) {
    return null;
  }
  const m = moment(str);
  if (!moment.isMoment(m)) {
    return null;
  }
  return m.format(format);
}

/**
 * 判断是否是JSON字符串
 */
export function isJsonString(str: string): boolean {
  try {
    if (JSON.parse(str)) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

/**
 * 解析JSON字符串
 */
export function parseJson(str: string): any {
  return isJsonString(str) ? JSON.parse(str) : null;
}

/**
 * ArrayBuffer转String
 */
export function ab2str(ab: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([ab]);
    const reader = new FileReader();
    reader.readAsText(blob, 'utf-8');
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reader.abort();
      reject(reader.error);
    };
  });
}

// eslint-disable-next-line import/extensions
export * from './cache';