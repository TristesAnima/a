import { pickBy } from 'lodash';
import { request } from '@/zero-plus';
import { downloadPro } from '@/utils/Project';

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

export async function getStudies(params) {
  const { pagination, searcher, sorter } = params;

  return request('/ctms/api/studies/page', {
    method: 'post',
    body: {
      page: {
        ...pagination,
        ...getSorter(sorter),
      },
      ...pickBy(searcher, (item) => item),
    },
  });
}

export async function getStudiesPro() {
  return request('/ctms/api/studies/list');
}

export async function saveStudy(params) {
  const { id } = params;
  return request(id ? `/ctms/api/studies/info/${id}` : '/ctms/api/studies', {
    method: id ? 'put' : 'post',
    body: params,
  });
}

export async function deleteStudy(params) {
  const { id } = params;
  return request(`/ctms/api/studies/${id}`, {
    method: 'delete',
  });
}

export async function validateStudy(params) {
  return request('/ctms/api/studies/namerepeatcheck', {
    method: 'post',
    body: params,
  });
}

export async function getStudy(params) {
  const { id } = params;
  return request(`/ctms/api/studies/${id}`);
}

export async function uploadStudyFiles(params) {
  const { files } = params;
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('file', file);
  });
  return request('/ctms/api/studyfiles', {
    method: 'post',
    body: formData,
  });
}

export async function downloadStudyFile(params) {
  const { id } = params;
  const response = await request(`/ctms/api/studyfiles/download/${id}`, {
    responseType: 'arraybuffer',
  });
  downloadPro(response);
  return response;
}
