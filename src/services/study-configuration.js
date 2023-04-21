import { request } from '@/zero-plus';

export async function getProjectEnrollmentPlan(params) {
  const { studyId } = params;

  return request(`/ctms/api/studyenrollmentplans/${studyId}`);
}

export async function saveProjectEnrollmentPlan(params) {
  const { id } = params;
  return request(`/ctms/api/studyenrollmentplans/${id}`, {
    method: 'put',
    body: params,
  });
}

export async function getProjectMilestones(params) {
  const { studyId } = params;

  return request(`/ctms/api/milestones/study/${studyId}`);
}

export async function saveProjectMilestone(params) {
  const { id } = params;
  return request(!id ? '/ctms/api/milestones/study' : `/ctms/api/milestones/study/${id}`, {
    method: id ? 'put' : 'post',
    body: params,
  });
}

export async function deleteProjectMilestone(params) {
  const { id } = params;

  return request(`/ctms/api/milestones/study/${id}`, {
    method: 'delete',
  });
}

export async function getSiteMilestones(params) {
  const { studyId } = params;
  return request(`/ctms/api/milestones/site/${studyId}`);
}

export async function saveSiteMilestone(params) {
  const { id } = params;
  return request(id ? `/ctms/api/milestones/site/${id}` : '/ctms/api/milestones/site', {
    method: id ? 'put' : 'post',
    body: params,
  });
}

export async function deleteSiteMilestone(params) {
  const { id } = params;
  return request(`/ctms/api/milestones/site/${id}`, {
    method: 'delete',
  });
}

export async function saveSiteMilestonePlan(params) {
  const { id } = params;
  return request(`/ctms/api/studies/sitemilestone/${id}`, {
    method: 'put',
    body: params,
  });
}
