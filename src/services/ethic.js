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

export async function getEthics(params) {
  const { sorter, filter, searcher, current, pageSize, ...rest } = params;
  const { success, data } = await request('/ctms/api/examinationcommittees/page', {
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

export async function getEthicsPro() {
  return request('/ctms/api/examinationcommittees/list');
}

export async function saveEthic(params) {
  const { id, signature } = params;
  return request(id ? `/ctms/api/examinationcommittees/${id}` : `/ctms/api/examinationcommittees`, {
    method: id ? 'put' : 'post',
    body: params,
    headers: {
      signature,
    },
  });
}

export async function deleteEthic(params) {
  const { id, signature } = params;
  return request(`/ctms/api/examinationcommittees/${id}`, {
    method: 'delete',
    headers: {
      signature,
    },
  });
}

export async function validateEthic(params) {
  return request('/ctms/api/examinationcommittees/namerepeatcheck', {
    method: 'post',
    body: params,
  });
}

export async function downloadTemplate() {
  const response = await request('/ctms/api/examinationcommittees/downloadtemplate', {
    responseType: 'arraybuffer',
  });
  downloadPro(response, 'in_治験審査委員会_テンプレート.xlsx');
  return response;
}

export async function importEthics(params) {
  const { file, signature } = params;
  const formData = new FormData();
  formData.append('file', file);
  return request('/ctms/api/examinationcommittees/import', {
    method: 'post',
    body: formData,
    headers: {
      signature,
    },
  });
}

export async function exportEthics(params) {
  const { ids } = params;
  const response = await request('/ctms/api/examinationcommittees/export', {
    body: ids,
    method: 'post',
    responseType: 'arraybuffer',
  });
  if (response.success) {
    downloadPro(response);
  }
  return response;
}

export async function getStudySiteEthics(params) {
  const { studySiteId } = params;
  return request(`/ctms/api/examinationcommittees/list/${studySiteId}`);
}

export async function getUserEthic() {
  return request('/ctms/api/examinationcommittees/user');
}
