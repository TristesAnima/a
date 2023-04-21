// @ts-ignore
import { request } from '@/zero-plus';
import type { SystemUser } from '@/typings/project';
import type { ResponseType } from '@/typings/api';

/**
 * 查询所有用户
 */
export async function getUsers(): Promise<ResponseType<SystemUser[]>> {
  return request(`/sso/api/users/listbyprodyctuid/${process.env.CLOUD_CODE}`);
}

/**
 * 根据查询用户
 */
export async function getUsersByRoles(params: {
  roleIds: number[];
}): Promise<ResponseType<SystemUser[]>> {
  const { roleIds = [] } = params;
  return request(`/sso/api/users/find/user/roleids`, {
    body: {
      productUid: process.env.CLOUD_CODE,
      roleIds: roleIds.toString(),
    },
  });
}
