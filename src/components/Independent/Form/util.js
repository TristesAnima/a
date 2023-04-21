import { forEach, isArray, isObject, values } from 'lodash';
import { isTruth } from '@/utils/Independent';

export function hasTruth(data = {}) {
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
