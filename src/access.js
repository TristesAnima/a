/**
 * https://umijs.org/zh-CN/plugins/plugin-access
 */
import { entries } from 'lodash';

const AUTHORITIES_MAPPING = {};

export default (initialState = {}) => {
  const { authorities = [] } = initialState; // eslint-disable-line
  const result = {};

  entries(AUTHORITIES_MAPPING).forEach(([key, value]) => {
    result[key] = authorities.some((item) => item.id === value);
  });

  return result;
};
