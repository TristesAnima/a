import { request } from '@/zero-plus';
import { downloadPro } from '@/utils/Project';

function getSearcher(searcher = {}) {
  return searcher;
}

function getSorter(sorter = {}) {
  const { field, order } = sorter;
  if (!field) {
    return {};
  }
  return {
    order: field,
    orderType: order === 'ascend' ? 0 : 1,
  };
}

export async function getSites(params) {
  const { sorter, filter, searcher, current, pageSize, ...rest } = params;
  const { success, data } = await request('/ctms/api/sites/page', {
    method: 'post',
    body: {
      ...getSearcher(searcher),
      ...rest,
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

export async function getSitesPro(params) {
  const { dataScope, country } = params;
  return request('/ctms/api/sites/list', {
    body: {
      dataScope,
      country,
    },
  });
}

export async function getUsageSites() {
  return request('/ctms/api/sites/list/datascope');
}

/**
 * 获取site所有信息
 */
export async function getSitesByStudyPro(params) {
  const { studyId, dataScope } = params;
  return request(`/ctms/api/studies/site/${studyId}`, {
    body: {
      dataScope,
    },
  });
}

export async function getSitesByStudy(params) {
  const { studyId, dataScope } = params;
  return request(`/ctms/api/studies/siteinfo/${studyId}`, {
    body: {
      dataScope,
    },
  });
}

export async function getIRBSitesByStudy(params) {
  const { studyId, dataScope, businessType } = params;
  return request(`/ctms/api/studies/site/filter/${studyId}`, {
    body: {
      dataScope,
      businessType,
    },
  });
}

export async function saveSite(params) {
  const { id } = params;
  return request(id ? `/ctms/api/sites/${id}` : `/ctms/api/sites`, {
    method: id ? 'put' : 'post',
    body: params,
    headers: {
      signature: params.signature,
    },
  });
}

export async function deleteSite(params) {
  const { id } = params;
  return request(`/ctms/api/sites/${id}`, {
    method: 'delete',
    headers: {
      signature: params.signature,
    },
  });
}

export async function validateSite(params) {
  return request('/ctms/api/sites/namerepeatcheck', {
    method: 'post',
    body: params,
  });
}

export async function downloadTemplate() {
  const response = await request('/ctms/api/sites/downloadtemplate', {
    responseType: 'arraybuffer',
  });
  downloadPro(response, 'in_医療機関_テンプレート.xlsx');
  return response;
}

export async function importSites(params) {
  const { file, signature } = params;
  const formData = new FormData();
  formData.append('file', file);
  return request('/ctms/api/sites/import', {
    method: 'post',
    body: formData,
    headers: {
      signature,
    },
  });
}

export async function exportSites(params) {
  const { ids } = params;
  const response = await request('/ctms/api/sites/export', {
    body: ids,
    method: 'post',
    responseType: 'arraybuffer',
  });
  if (response.success) {
    downloadPro(response);
  }
  return response;
}

export async function getSitesByStudyIds(params) {
  const { studyIds, dataScope, examinationCommitteeId } = params;
  return request('/ctms/api/studies/site/filter', {
    body: {
      dataScope,
      studyIds,
      examinationCommitteeId,
    },
  });
}
