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

export async function getCROs(params) {
  const { sorter, filter, searcher, current, pageSize, ...rest } = params;
  const { success, data } = await request('/ctms/api/crocompanys/page', {
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

export async function getCROsPro() {
  return request('/ctms/api/crocompanys/list');
}

export async function getUsageCROs() {
  return request('/ctms/api/crocompanys/list/datascope');
}

export async function saveCRO(params) {
  const { id } = params;
  return request(id ? `/ctms/api/crocompanys/${id}` : `/ctms/api/crocompanys`, {
    method: id ? 'put' : 'post',
    body: params,
    headers: {
      signature: params.signature,
    },
  });
}

export async function deleteCRO(params) {
  const { id } = params;
  return request(`/ctms/api/crocompanys/${id}`, {
    method: 'delete',
    headers: {
      signature: params.signature,
    },
  });
}

export async function validateCRO(params) {
  return request('/ctms/api/crocompanys/namerepeatcheck', {
    method: 'post',
    body: params,
  });
}

export async function downloadTemplate() {
  const response = await request('/ctms/api/crocompanys/downloadtemplate', {
    responseType: 'arraybuffer',
  });
  downloadPro(response, 'in_CRO機関_テンプレート.xlsx');
  return response;
}

export async function importCROs(params) {
  const { file, signature } = params;
  const formData = new FormData();
  formData.append('file', file);
  return request('/ctms/api/crocompanys/import', {
    method: 'post',
    body: formData,
    headers: {
      signature,
    },
  });
}

export async function exportCROs(params) {
  const { ids } = params;
  const response = await request('/ctms/api/crocompanys/export', {
    body: ids,
    method: 'post',
    responseType: 'arraybuffer',
  });
  if (response.success) {
    downloadPro(response);
  }
  return response;
}
