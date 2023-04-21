// @ts-ignore
import type { ResponseType } from '@/typings/api';
import type { SystemCompany } from '@/typings/project';
import { request } from '@/zero-plus';

/**
 * 获取公司列表
 */
export async function getOptionalCompanies(): Promise<ResponseType<SystemCompany[]>> {
  return request('/sso/api/companys/get/list', {
    body: {
      productUid: 'ssujp',
    },
  });
}

/**
 * 获取根公司
 */
export async function getRootCompany(): Promise<ResponseType<SystemCompany>> {
  return request('/sso/api/companys/get/one');
}

/**
 * 获取根公司
 */
export async function setRootCompany(params: { companyId: number }): Promise<ResponseType> {
  return request(`/sso/api/companys/choose/${params.companyId}`, {
    method: 'post',
    params: {
      productUid: 'ssujp',
    },
  });
}

/**
 * 获取根公司
 */
export async function checkMachineText(params: { text: string }) {
  const { text } = params;
  return request('/ssu/api/ctnInfos/chinesecheck', {
    method: 'post',
    body: {
      chinese: text,
    },
  });
}

export async function checkESign(params: {
  content?: string;
  passWord: string;
  functionalModuleId: number;
  caseName?: string;
  caseObject?: string;
}): Promise<ResponseType<{ id: number }>> {
  return request('/ctms/api/auditsignature', {
    method: 'post',
    body: params,
  });
}

export async function getDict(params: any) {
  return request(`/ctms/api/sysdicts/finddictlist`, {
    body: params,
  });
}
