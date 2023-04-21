import { downloadPro } from '@/utils/Project';
import { request } from '@/zero-plus';

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

export async function getSponsors(params) {
  const { sorter, filter, searcher, current, pageSize, ...rest } = params;
  const { success, data } = await request('/ctms/api/sponsors/page', {
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

export async function getSponsorsPro() {
  return request('/ctms/api/sponsors/list');
}

export async function getUsageSponsors() {
  return request('/ctms/api/sponsors/list/datascope');
}

export async function saveSponsor(params) {
  const { id } = params;
  return request(id ? `/ctms/api/sponsors/${id}` : `/ctms/api/sponsors`, {
    method: id ? 'put' : 'post',
    body: params,
    headers: {
      signature: params.signature,
    },
  });
}

export async function deleteSponsor(params) {
  const { id } = params;
  return request(`/ctms/api/sponsors/${id}`, {
    method: 'delete',
    headers: {
      signature: params.signature,
    },
  });
}

export async function validateSponsor(params) {
  return request('/ctms/api/sponsors/namerepeatcheck', {
    method: 'post',
    body: params,
  });
}

export async function downloadTemplate() {
  const response = await request('/ctms/api/sponsors/downloadtemplate', {
    responseType: 'arraybuffer',
  });
  downloadPro(response, 'in_治験依頼者_テンプレート.xlsx');
  return response;
}

export async function importSponsors(params) {
  const { file, signature } = params;
  const formData = new FormData();
  formData.append('file', file);
  return request('/ctms/api/sponsors/import', {
    method: 'post',
    body: formData,
    headers: {
      signature,
    },
  });
}

export async function exportSponsors(params) {
  const { ids } = params;
  const response = await request('/ctms/api/sponsors/export', {
    body: ids,
    method: 'post',
    responseType: 'arraybuffer',
  });
  if (response.success) {
    downloadPro(response);
  }
  return response;
}
