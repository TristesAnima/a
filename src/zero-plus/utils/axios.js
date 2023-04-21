import axios from 'axios';
import { formatMessage, getLocale } from '@umijs/max';
import { getToken, removeToken } from './storage';

const toAxiosConfig = (config) => {
  const { method = 'get', body = {}, ...rest } = config;

  if (/(put|post|patch)/i.test(method)) {
    return {
      method,
      data: body,
      ...rest,
    };
  }
  return {
    method,
    params: body,
    ...rest,
  };
};

const request = (url, config = {}) => {
  const { headers = {}, ...rest } = toAxiosConfig(config);

  return axios
    .request({
      responseType: 'json', // arraybuffer, blob, document, json, text
      ...rest,
      url,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Accept-Language': `${getLocale()};q=0.9`,
        Accept: 'application/json, text/plain, */*',
        Authorization: getToken(),
        timezone: `UTC+${0 - new Date().getTimezoneOffset() / 60}`, // UTC+8
        ...headers,
      },
    })
    .then((response) => {
      if (response.data) {
        const keys = Object.keys(response.data);
        if (
          keys.length === 3 &&
          keys.includes('code') &&
          keys.includes('content') &&
          keys.includes('msg')
        ) {
          const { code, content, msg } = response.data;
          if (code === 401 && !window.location.href.toLowerCase().includes('login')) {
            removeToken();
            window.location.href = '/g/logout';
          }
          if (code === 200) {
            return {
              success: true,
              code,
              content,
              msg,
              ...response,
              data: content,
            };
          }

          console.log({
            url,
            code,
            msg,
          });

          return {
            success: false,
            code,
            content,
            msg,
            ...response,
            data: msg,
          };
        }

        /**
         * 兼容写法
         */
        if (
          response.data.status === 1002 &&
          !window.location.href.toLowerCase().includes('login')
        ) {
          removeToken();
          window.location.href = '/g/logout';
        }
      }
      return {
        success: true,
        ...response,
      };
    })
    .catch(({ response }) => {
      if (response.status === 401 && !window.location.href.includes('login')) {
        removeToken();
        window.location.href = '/g/logout';
      }
      return {
        success: false,
        ...response,
        data: response.data || { message: formatMessage({ id: '网络连接超时' }) },
      };
    });
};

export { request };
