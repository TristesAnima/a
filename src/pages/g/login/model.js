import { getToken, request } from '@/zero-plus';

/**
 * 命名空间
 */
const namespace = 'login';

/**
 * 初始结构
 */
const initialState = {};

/**
 * 定义model
 */
export default {
  namespace,

  state: initialState,

  effects: {
    *updatePassword({ payload }, { call }) {
      const response = yield call(
        request,
        `/sso/api/users/expiredupdatepassword/${payload.userId}`,
        {
          method: 'put',
          body: {
            ...payload,
            tenantIdentification: getToken().slice(32),
          },
        },
      );
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
