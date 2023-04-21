// @ts-ignore
import { request } from '@/zero-plus';
import { downloadPro } from '@/utils/Project';
import { ResponseType } from '@/typings/api';

interface Sorter {
  field?: string;
  order?: string;
}

function getSearcher(searcher = {}) {
  return searcher;
}

function getSorter(sorter: Sorter = {}) {
  const { field, order } = sorter;
  if (!field) {
    return {};
  }
  return {
    order: field,
    orderType: order === 'ascend' ? 0 : 1,
  };
}

export async function getContacts(params: { sorter?: Sorter; [key: string]: any }) {
  const { sorter, filter, searcher, sponsorId, affiliationJob, current, pageSize, ...rest } =
    params;
  const { success, data } = await request('/ctms/api/contacts', {
    // method: 'post',
    body: {
      ...getSearcher(searcher),
      ...rest,
      sponsorId: sponsorId === '0' ? '' : sponsorId,
      affiliationJob: affiliationJob === '0' ? '' : affiliationJob,
      page: {
        ...getSorter(sorter),
        current,
        pageSize,
      },
    },
  });
  return {
    success,
    data: success ? data.datas : [],
    total: data?.total,
  };
}

export async function saveSponsorContacts(params: Record<string, any>) {
  const { id } = params;
  return request(id ? `/ctms/api/contacts/sponsor/${id}` : `/ctms/api/contacts/sponsor`, {
    method: id ? 'put' : 'post',
    body: params,
    headers: {
      signature: params.signature,
    },
  });
}

export async function saveSiteContacts(params: Record<string, any>) {
  const { id } = params;
  return request(id ? `/ctms/api/contacts/site/${id}` : `/ctms/api/contacts/site`, {
    method: id ? 'put' : 'post',
    body: params,
    headers: {
      signature: params.signature,
    },
  });
}

export async function saveEthicContacts(params: Record<string, any>) {
  const { id } = params;
  return request(
    id
      ? `/ctms/api/contacts/examinationcommittee/${id}`
      : `/ctms/api/contacts/examinationcommittee`,
    {
      method: id ? 'put' : 'post',
      body: params,
      headers: {
        signature: params.signature,
      },
    }
  );
}

export async function saveCroContacts(params: Record<string, any>) {
  const { id } = params;
  return request(id ? `/ctms/api/contacts/crocompany/${id}` : `/ctms/api/contacts/crocompany`, {
    method: id ? 'put' : 'post',
    body: params,
    headers: {
      signature: params.signature,
    },
  });
}

export async function deleteContacts(params: Record<string, any>) {
  const { id } = params;
  return request(`/ctms/api/contacts/${id}`, {
    method: 'delete',
    headers: {
      signature: params.signature,
    },
  });
}

export async function deleteSponsorContacts(params: Record<string, any>) {
  const { id } = params;
  return request(`/ctms/api/contacts/sponsor/${id}`, {
    method: 'delete',
    headers: {
      signature: params.signature,
    },
  });
}

export async function deleteSiteContacts(params: Record<string, any>) {
  const { id } = params;
  return request(`/ctms/api/contacts/site/${id}`, {
    method: 'delete',
    headers: {
      signature: params.signature,
    },
  });
}

export async function deleteEthicContacts(params: Record<string, any>) {
  const { id } = params;
  return request(`/ctms/api/contacts/examinationcommittee/${id}`, {
    method: 'delete',
    headers: {
      signature: params.signature,
    },
  });
}

export async function deleteCroContacts(params: Record<string, any>) {
  const { id } = params;
  return request(`/ctms/api/contacts/crocompany/${id}`, {
    method: 'delete',
    headers: {
      signature: params.signature,
    },
  });
}

export async function getContactsBySponsor(params: Record<string, any>) {
  const { id } = params;
  return request(`/ctms/api/contacts/sponsorcontacts/${id}`, {
    body: params,
  });
}

export async function getContactsBySite(params: Record<string, any>) {
  const { id } = params;
  return request(`/ctms/api/contacts/sitecontacts/${id}`);
}

export async function getRelationUsers(): Promise<ResponseType<number[]>> {
  return request('/ctms/api/contacts/relationuserid');
}

export async function getContactsByEthic(params: Record<string, any>) {
  const { ethicId = 0 } = params;
  return request(`/ctms/api/contacts/examinationcommitteecontacts/${ethicId}`);
}

export async function getContactsByCro(params: Record<string, any>) {
  const { croId = 0 } = params;
  return request(`/ctms/api/contacts/crocompanycontacts/${croId}`);
}

// 查询CRO Leader所在所属的联系人
export async function getContactsByCroLeader(params: Record<string, any>) {
  const { croId = 0 } = params;
  return request(`/ctms/api/contacts/crocompanycontacts/leader/${croId}`);
}

export async function isUserRelation(params: Record<string, any>) {
  const { userId = '', type = '' } = params;
  return request(`/ctms/api/contacts/userisrepeat/${userId}/type/${type}`);
}

export async function downloadSponsorContactsTemplate() {
  const response = await request('/ctms/api/contacts/downloadsponsortemplate', {
    responseType: 'arraybuffer',
  });
  if (response.success) {
    downloadPro(response);
  }
  return response;
}

export async function validateSiteTreatmentDepartment(params: Record<string, any>) {
  const { id } = params;
  return request(`/ctms/api/contacts/treatmentdepartment/${id}`);
}

export async function getSponsorByUserId(params: Record<string, any>) {
  const { userId } = params;
  return request(`/ctms/api/contacts/sponsor/user/${userId}`);
}

export async function getCroContacts() {
  return request(`/ctms/api/contacts/crocontacts`);
}

export async function getCroContactsByUserId(params: Record<string, any>) {
  const { userId } = params;
  return request(`/ctms/api/contacts/cro/user/${userId}`);
}

export async function checkRelieveContactsRelationUser(params: Record<string, any>) {
  const { id } = params;
  return request(`/ctms/api/contacts/relieve/${id}`);
}

export async function getCroContactBySponsor(params: Record<string, any>) {
  const { sponsorId } = params;
  return request(`/ctms/api/contacts/sponsor/croCompany/${sponsorId}`);
}

export async function saveCroContactBySponsor(params: Record<string, any>) {
  const { croCompanyId, sponsorId, contactsList } = params;
  return request('/ctms/api/contacts/sponsor/croCompany', {
    method: 'post',
    body: {
      croCompanyId,
      sponsorId,
      contactsList,
    },
    headers: {
      signature: params.signature,
    },
  });
}

// 判断用户是否是多角色
export async function getMultipleRoleTypeByUser(params: Record<string, any>) {
  const { userId } = params;
  return request(`/ctms/api/contacts/signrole/${userId}`);
}

export async function saveUserSystemRole(params: Record<string, any>) {
  const { userId, roleType } = params;
  return request(`/ctms/api/contacts/signrole/${userId}`, {
    method: 'put',
    params: {
      roleType,
    },
  });
}

/**
 * 获取用户所在的医疗机关列表
 */
export async function getSitesByUser() {
  return request('/ctms/api/contactsites');
}

export async function saveUserSite(params: Record<string, any>) {
  const { siteId } = params;
  return request(`/ctms/api/contacts/choose/site/${siteId}`, {
    method: 'put',
  });
}

export async function getUserRoleType() {
  return request('/ctms/api/contacts/choose');
}

export async function getSponsorCroByUser(params: Record<string, any>) {
  const { userId } = params;
  return request(`/ctms/api/contacts/sponsorcro/user/${userId}`);
}
