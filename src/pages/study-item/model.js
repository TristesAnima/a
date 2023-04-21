import { useRequest } from 'ahooks';
import moment from 'moment';
import { formatResponseData } from '@/utils/Project';
import { getStudy } from '@/services/study';
import { getSessionStorageItem } from '@/zero-plus';

function setStudy(study) {
  return {
    ...study,
    country: study.country?.split(',') || [],
    firstPlannedStartDate: study.firstPlannedStartDate && moment(study.firstPlannedStartDate),
    firstPlannedEndDate: study.firstPlannedEndDate && moment(study.firstPlannedEndDate),
    geneticsCheck: study.geneticsCheck?.toString(),
    underageParticipants: study.underageParticipants?.toString(),
    studyFileList: study.studyFileList?.map((item) => ({
      ...item,
      name: item.fileName,
      uploaded: true,
    })),
  };
}

export default function useStudy() {
  const {
    run,
    data = {},
    refresh,
    loading,
  } = useRequest(
    async () => {
      const studyId = getSessionStorageItem('studyId');
      return setStudy(formatResponseData(await getStudy({ id: studyId }), {}));
    },
    {
      manual: true,
    }
  );

  return {
    run,
    study: data,
    refresh,
    loading,
  };
}
