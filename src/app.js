import { entries } from 'lodash';
import produce from 'immer';
import { request, getToken, setToken, setLocalStorageItem } from '@/zero-plus';
import { getDict } from '@/services/api';

/**
 * 获取用户信息
 * @returns {Promise<{}>}
 */
const requestCurrentUser = async () => {
  const { success, data } = await request('/sso/api/users/userinfo');
  return success ? data : {};
};

/**
 * 获取公司信息
 * @returns {Promise<{}>}
 */
// const requestCurrentCompany = async () => {
//   const { success, data } = await request('/sso/api/companys/user');
//   return success ? data : {};
// };

/**
 * 获取权限信息
 * @returns {Promise<Array>}
 */
// const requestAuthorities = async () => {
//   const { success, data } = await request(
//     `/sso/api/users/getaliasnames?productUid=${process.env.CLOUD_CODE}`,
//   );
//   return success ? data : [];
// };

/**
 * 获取数据字典
 */
const requestDict = async () => {
  const { success, data } = await getDict();
  if (!success) {
    return {};
  }
  const dict = {};
  entries(data).forEach(([locale, value]) => {
    dict[locale] = {};
    entries(value).forEach(([k, v]) => {
      dict[locale][k] = {
        list: v,
        map: produce({}, (draftState) => {
          v.forEach((item) => {
            draftState[item.code] = item;
          });
        }),
      };
    });
  });
  return dict;
};

/**
 * 单点登录
 * @returns {Promise<void>}
 */
const ssoLogin = async (params = {}) => {
  setLocalStorageItem('type', '单点登录');
  setToken(params.token);
};

export const getInitialState = async () => {
  // console.log(
  //   process.env.CI_SOURCE_NAME,
  //   process.env.CI_COMMIT_REF_NAME,
  //   process.env.CI_COMMIT_SHA,
  //   process.env.NODE_ENV,
  // );

  if (getToken()) {
    const [currentUser, dict, authorities] = await Promise.all([
      requestCurrentUser(),
      requestDict(),
      // requestAuthorities(),
    ]);

    return {
      currentUser,
      authorities,
      dict,

      ssoLogin,
    };
  }

  return {
    ssoLogin,
  };
};
