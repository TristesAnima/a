import { DrawerForm, Linkage, QuantityNumber } from '@/components/TsCommonComponents';
import { EditableTable, eSign } from '@/components/TsProjectComponents';
import { useDict, useMessage } from '@/hooks/Independent';
import { useProjectDict } from '@/hooks/Project';
import { checkMachineText } from '@/services/api';
import {
  checkRelieveContactsRelationUser,
  getRelationUsers,
  isUserRelation,
  saveSiteContacts,
} from '@/services/contacts';
import { getUsers } from '@/services/user';
import { getNameWithLanguage, parseUsername } from '@/utils/Project';
import {
  ProForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Form, Input, InputNumber, Space, Table } from 'antd';
import { noop, omit } from 'lodash';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import { useRef } from 'react';
import { DoctorTypeDict } from '../../dict';

const { Item: FormItem } = Form;

const propTypes = {
  children: PropTypes.node.isRequired,
  initialValues: PropTypes.object,
  sitesConfig: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

const defaultProps = {
  initialValues: {},
  sitesConfig: {},
  onOk: noop,
  onCancel: noop,
};

const setData = (data) => {
  const { doctorLicenseNum, doctorLicenseYear, dentistLicenseNum, dentistLicenseYear } = data;
  return {
    ...data,
    experienceAsDoctor: {
      value: data.experienceAsDoctor,
      linkage: {
        1: data.experienceAsDoctorNumber,
      },
    },
    experienceResponsibleDoctors: {
      value: data.experienceResponsibleDoctors,
      linkage: {
        1: data.experienceResponsibleDoctorsNumber,
      },
    },
    eduGraduateYear: data.eduGraduateYear && moment(data.eduGraduateYear),
    doctorLicenseYear: data.doctorLicenseYear && moment(data.doctorLicenseYear),
    dentistLicenseYear: data.dentistLicenseYear && moment(data.dentistLicenseYear),
    medicalDoctorLicense: !!(doctorLicenseYear || doctorLicenseNum),
    medicalDentistLicense: !!(dentistLicenseNum || dentistLicenseYear),
    clinicalTrialDrugQuantity: {
      firstNumber: data.clinicalTrialDrugQuantity,
      secondNumber: data.clinicalTrialProgressDrugQuantity,
    },
    clinicalTrialMedicalDevicesQuantity: {
      firstNumber: data.clinicalTrialMedicalDevicesQuantity,
      secondNumber: data.clinicalTrialProgressMedicalDevicesQuantity,
    },
    treatmentTrialRegenerativeMedicine: {
      firstNumber: data.treatmentTrialRegenerativeMedicine,
      secondNumber: data.treatmentTrialProgressRegenerativeMedicine,
    },
    contactSites: data.contactSites?.map((item) => ({
      ...item,
      headOrgan: item.headOrgan === 1,
      crcType: item.crcType === 1,
    })),
  };
};

const getData = (data) => ({
  ...data,
  experienceAsDoctor: data.experienceAsDoctor?.value,
  experienceAsDoctorNumber: data.experienceAsDoctor?.linkage?.['1'],
  experienceResponsibleDoctors: data.experienceResponsibleDoctors?.value,
  experienceResponsibleDoctorsNumber: data.experienceResponsibleDoctors?.linkage?.['1'],
  eduGraduateYear: data.eduGraduateYear?.format('YYYY'),
  doctorLicenseYear: data.doctorLicenseYear?.format('YYYY'),
  dentistLicenseYear: data.dentistLicenseYear?.format('YYYY'),
  employmentRecords: data.employmentRecords?.map((item) => ({
    ...(item.id < 0 ? omit(item, ['id']) : item),
    fromDate: item.fromDate && moment(item.fromDate).format('YYYY-MM-DD HH:mm:ss'),
    toDate: item.toDate && moment(item.toDate).format('YYYY-MM-DD HH:mm:ss'),
  })),
  clinicalTrialDrugQuantity: data.clinicalTrialDrugQuantity?.firstNumber,
  clinicalTrialProgressDrugQuantity: data.clinicalTrialDrugQuantity?.secondNumber,
  clinicalTrialMedicalDevicesQuantity: data.clinicalTrialMedicalDevicesQuantity?.firstNumber,
  clinicalTrialProgressMedicalDevicesQuantity:
    data.clinicalTrialMedicalDevicesQuantity?.secondNumber,
  treatmentTrialRegenerativeMedicine: data.treatmentTrialRegenerativeMedicine?.firstNumber,
  treatmentTrialProgressRegenerativeMedicine: data.treatmentTrialRegenerativeMedicine?.secondNumber,
  contactSites: data.contactSites?.map((item) => ({
    ...item,
    headOrgan: item.headOrgan ? 1 : 0,
    crcType: item.crcType ? 1 : 0,
  })),
});

const Index = (props) => {
  const {
    children,
    initialValues,
    sitesConfig: { sites = [], refreshSiteList = () => {}, getSitesProLoading = false },
    onOk,
    onCancel,
  } = props;
  const { formatMessage } = useIntl();
  const userIdRef = useRef(null);
  const message = useMessage();
  const [doctorTypeList, , DoctorType] = useDict(DoctorTypeDict, { intl: true });

  const {
    num_medical_school: { list: numMedicalSchoolList = [] } = {},
    info_has: { list: infoHasList = [] } = {},
  } = useProjectDict(['num_medical_school', 'info_has']);

  const record = setData(initialValues);
  const isEdit = !!record.id;

  const {
    run: runQueryUsers,
    data: { data: users = [] } = {},
    loading: queryUsersLoading,
  } = useRequest(getUsers, {
    manual: true,
    formatResult: ({ success, data }) => (success ? data : []),
  });

  const {
    run: runGetRelationUsers,
    data: { data: relationUsers = [] } = {},
    loading: getRelationUsersLoading,
  } = useRequest(getRelationUsers, {
    manual: true,
    formatResult: ({ success, data }) => (success ? data : []),
  });

  const {
    // run: runCheckRelieveContactsRelationUser,
    data: isRelieve = true,
    loading: checkRelieveContactsRelationUserLoading,
  } = useRequest(checkRelieveContactsRelationUser, {
    manual: true,
  });

  const onShow = (show) => {
    show();
    refreshSiteList();
    runQueryUsers();
    runGetRelationUsers();
  };

  const closePro = () => {
    userIdRef.current = null;
    onCancel();
  };

  async function save(newData, reset) {
    const params = getData({
      id: 0,
      ...record,
      ...newData,
      // userIdRef等于0代表解除
      userId: userIdRef.current === 0 ? null : userIdRef.current || record.userId,
    });
    if (!isEdit && params.userId) {
      const relationResult = await isUserRelation({ ...newData, type: 0 });
      if (!relationResult.success) {
        message({
          response: relationResult,
        });
        return relationResult.success;
      }
      if (relationResult.data) {
        message({
          success: false,
          errorText: formatMessage({ id: 'contacts.已关联提示' }),
        });
        return relationResult.success;
      }
    }
    return new Promise((resolve, reject) => {
      eSign({
        caseName: params.nameChar,
        caseObject: 'nameChar',
        authorityName: params.id ? '联系人:医疗机关-编辑' : '联系人:医疗机关-新增',
        callback: async (signature) => {
          const saveResult = await saveSiteContacts({ ...params, signature });
          message({
            response: saveResult,
            mode: 'save',
            onSuccess: () => {
              userIdRef.current = null;
              resolve();
              reset();
              onOk();
            },
            onError: () => {
              reject();
            },
          });
          return saveResult.success;
        },
        onCancel: () => {
          reject();
        },
      });
    });
  }

  return (
    <DrawerForm
      title={isEdit ? formatMessage({ id: '编辑' }) : formatMessage({ id: '新增' })}
      width={1000}
      initialValues={record}
      onShow={onShow}
      onOk={(...args) => save(...args)}
      onCancel={closePro}
      formItems={(form) => ({
        defaultRowOption: {
          gutter: 32,
        },
        defaultColOption: {
          span: 24,
        },
        defaultCommonFormItemOption: {
          labelCol: {
            span: 24,
          },
          wrapperCol: {
            span: 24,
          },
        },
        content: [
          {
            colOption: {
              span: 12,
            },
            type: 'elements',
            group: {
              content: [
                {
                  colOption: {
                    flex: 1,
                  },
                  element: (
                    <ProFormSelect
                      label={formatMessage({ id: 'contacts.账号' })}
                      name="userId"
                      style={{ width: '100%' }}
                      showSearch
                      fieldProps={{
                        optionFilterProp: 'children',
                        loading: queryUsersLoading || getRelationUsersLoading,
                      }}
                      placeholder={formatMessage({ id: '请选择' })}
                      options={users
                        .filter(
                          (item) => item.id === record.userId || !relationUsers.includes(item.id)
                        )
                        .map((item) => ({
                          label: parseUsername(item),
                          value: item.id,
                        }))}
                    />
                  ),
                },
                {
                  type: 'addition',
                  element: (
                    <ProFormDependency name={['userId']}>
                      {({ userId }) => {
                        const relieveDisabled =
                          !record.userId || !userId || record.userId !== userId || !isRelieve;
                        return (
                          <ProForm.Item label={<></>}>
                            <Space size={2}>
                              <Button
                                type="primary"
                                disabled={!userId}
                                onClick={() => {
                                  userIdRef.current = userId;
                                  const { name, phone, email } =
                                    users.find((item) => item.id === userId) || {};
                                  form?.setFieldsValue({
                                    nameChar: name,
                                    email,
                                    phone,
                                  });
                                }}
                              >
                                {formatMessage({ id: 'contacts.同步' })}
                              </Button>
                              <Button
                                type="primary"
                                danger
                                disabled={relieveDisabled}
                                loading={checkRelieveContactsRelationUserLoading}
                                onClick={() => {
                                  userIdRef.current = 0; // 解除标识
                                  form?.setFieldsValue({
                                    userId: null,
                                  });
                                }}
                              >
                                {formatMessage({ id: 'contacts.解除' })}
                              </Button>
                            </Space>
                          </ProForm.Item>
                        );
                      }}
                    </ProFormDependency>
                  ),
                },
              ],
            },
          },
          {
            colOption: {
              span: 12,
            },
            type: 'empty',
          },
          {
            colOption: {
              span: 8,
            },
            element: (
              <ProFormText
                label={formatMessage({ id: 'contacts.姓名（拼音）' })}
                name="namePinyin"
                placeholder={formatMessage({ id: '请输入' })}
                rules={[
                  { required: true, message: formatMessage({ id: '此项为必填项' }) },
                  { max: 200, message: formatMessage({ id: '文字内容限制提示语' }, { num: 200 }) },
                  {
                    validateTrigger: ['onBlur'],
                    validator: async (rule, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const { success, data } = await checkMachineText({ text: value });
                      if (!success) {
                        return formatMessage({ id: '操作失败' });
                      }
                      if (!data) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        formatMessage({ id: 'ctn.check.error' }, { stringCode: data })
                      );
                    },
                  },
                ]}
                formItemProps={{ validateTrigger: ['onChange', 'onBlur'] }}
              />
            ),
          },
          {
            colOption: {
              span: 8,
            },
            element: (
              <ProFormText
                label={formatMessage({ id: 'contacts.氏名（漢字）' })}
                name="nameChar"
                placeholder={formatMessage({ id: '请输入' })}
                formItemProps={{ validateTrigger: ['onChange', 'onBlur'] }}
                rules={[
                  { required: true, message: formatMessage({ id: '此项为必填项' }) },
                  { max: 50, message: formatMessage({ id: '文字内容限制提示语' }, { num: 50 }) },
                  {
                    validateTrigger: ['onBlur'],
                    validator: async (rule, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const { success, data } = await checkMachineText({ text: value });
                      if (!success) {
                        return formatMessage({ id: '操作失败' });
                      }
                      if (!data) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        formatMessage({ id: 'ctn.check.error' }, { stringCode: data })
                      );
                    },
                  },
                ]}
              />
            ),
          },
          {
            colOption: {
              span: 8,
            },
            element: (
              <ProFormText
                label={formatMessage({ id: 'contacts.氏名（英文）' })}
                name="nameEn"
                placeholder={formatMessage({ id: '请输入' })}
                rules={[
                  { max: 50, message: formatMessage({ id: '文字内容限制提示语' }, { num: 50 }) },
                ]}
              />
            ),
          },
          {
            colOption: {
              span: 12,
            },
            element: (
              <ProFormText
                label={formatMessage({ id: '邮箱' })}
                name="email"
                placeholder={formatMessage({ id: '请输入' })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: '此项为必填项' }),
                  },
                  { max: 120, message: formatMessage({ id: '文字内容限制提示语' }, { num: 120 }) },
                ]}
              />
            ),
          },
          {
            colOption: {
              span: 12,
            },
            element: (
              <ProFormText
                label={formatMessage({ id: '联系方式' })}
                name="phone"
                placeholder={formatMessage({ id: '请输入' })}
                rules={[
                  { max: 120, message: formatMessage({ id: '文字内容限制提示语' }, { num: 120 }) },
                ]}
              />
            ),
          },
          {
            element: (
              <ProForm.Item
                name="contactSites"
                rules={[{ required: true, message: formatMessage({ id: '此项为必填项' }) }]}
              >
                <EditableTable
                  editable={{ type: 'single' }}
                  optionsColumnConfig={{
                    width: 80,
                  }}
                  columns={[
                    {
                      dataIndex: 'number',
                      title: formatMessage({ id: '序号' }),
                      editable: false,
                      valueType: 'index',
                      width: 50,
                    },
                    {
                      dataIndex: 'siteId',
                      width: 200,
                      title: formatMessage({ id: 'contacts.医療機関' }),
                      valueType: 'select',
                      fieldProps: {
                        showSearch: true,
                        optionFilterProp: 'label',
                        loading: getSitesProLoading,
                        options: sites.map((item) => ({
                          label: getNameWithLanguage(item.name, item.nameEn),
                          value: item.id,
                        })),
                      },
                      formItemProps: (_, { entity }) => ({
                        rules: [
                          { required: true, message: formatMessage({ id: '此项为必填项' }) },
                          {
                            validator: (rule, value) => {
                              if (
                                form
                                  ?.getFieldValue('contactSites')
                                  ?.some((item) => item.id !== entity.id && item.siteId === value)
                              ) {
                                return Promise.reject(
                                  formatMessage(
                                    { id: '不允许重复提示' },
                                    {
                                      text: formatMessage({ id: 'contacts.医療機関' }),
                                    }
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ],
                      }),
                      render: (_text, row) => {
                        const site = sites.find((item) => item.id === row.siteId);
                        if (!site) {
                          return null;
                        }
                        return getNameWithLanguage(site.name, site.nameEn);
                      },
                    },
                    {
                      dataIndex: 'treatmentDepartmentId',
                      title: formatMessage({ id: 'contacts.所属' }),
                      valueType: 'select',
                      width: 150,
                      fieldProps: (formInstance, { rowKey }) => {
                        if (!formInstance) {
                          return {};
                        }
                        const siteId = formInstance.getFieldValue([rowKey, 'siteId']);
                        const { treatmentDepartmentList = [] } =
                          sites.find((item) => item.id === siteId) || {};
                        return {
                          showSearch: true,
                          optionFilterProp: 'label',
                          options: treatmentDepartmentList.map((item) => ({
                            label: getNameWithLanguage(item.roomName, item.roomNameEn),
                            value: item.id,
                          })),
                        };
                      },
                      formItemProps: {
                        rules: [{ required: true, message: formatMessage({ id: '此项为必填项' }) }],
                      },
                      render: (_text, row) => {
                        const site = sites.find((item) => item.id === row.siteId);
                        if (!site) {
                          return null;
                        }
                        const treatmentDepartment =
                          site.treatmentDepartmentList?.find(
                            (item) => item.id === row.treatmentDepartmentId
                          ) || {};
                        if (!treatmentDepartment) {
                          return null;
                        }
                        return getNameWithLanguage(
                          treatmentDepartment.roomName,
                          treatmentDepartment.roomNameEn
                        );
                      },
                    },
                    {
                      dataIndex: 'jobTitle',
                      title: formatMessage({ id: 'contacts.職名' }),
                      width: 150,
                      formItemProps: {
                        rules: [
                          {
                            max: 100,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 100 }),
                          },
                        ],
                      },
                    },
                    {
                      dataIndex: 'headOrgan',
                      title: formatMessage({ id: 'contacts.是否是医疗机关长' }),
                      valueType: 'switch',
                      width: 150,
                      render: (_text, row) =>
                        row.headOrgan ? formatMessage({ id: '是' }) : formatMessage({ id: '否' }),
                    },
                    {
                      dataIndex: 'crcType',
                      title: formatMessage({ id: 'contacts.治験コーディネーター(CRC)' }),
                      valueType: 'switch',
                      width: 150,
                      render: (_text, row) =>
                        row.crcType ? formatMessage({ id: '是' }) : formatMessage({ id: '否' }),
                    },
                  ]}
                />
              </ProForm.Item>
            ),
          },
          {
            colOption: {
              span: 24,
            },
            element: (
              <ProFormRadio.Group
                label={formatMessage({ id: 'contacts.是否为医师' })}
                name="doctorType"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: '此项为必填项' }),
                  },
                ]}
                options={doctorTypeList}
                fieldProps={{
                  onChange: () => {
                    form?.setFieldsValue({
                      eduUniversity: null,
                      eduUndergraduate: null,
                      eduGraduateYear: null,
                      medicalDoctorLicense: null,
                      doctorLicenseNum: null,
                      doctorLicenseYear: null,
                      medicalDentistLicense: null,
                      dentistLicenseNum: null,
                      dentistLicenseYear: null,
                      workHistory: null,
                      employmentRecords: [],
                      professionalField: null,
                      affiliatedSociety: null,
                      mainResearchContents: null,
                      clinicalTrialDrugQuantity: null,
                      clinicalTrialProgressDrugQuantity: null,
                      clinicalTrialMedicalDevicesQuantity: null,
                      clinicalTrialProgressMedicalDevicesQuantity: null,
                      treatmentTrialRegenerativeMedicine: null,
                      treatmentTrialProgressRegenerativeMedicine: null,
                      majorPatients: null,
                      experienceResponsibleDoctors: {
                        value: null,
                        linkage: null,
                      },
                      experienceAsDoctor: {
                        value: null,
                        linkage: null,
                      },
                    });
                  },
                }}
              />
            ),
          },
          {
            type: 'shouldUpdate',
            name: ['doctorType'],
            group: ({ doctorType }) =>
              doctorType === DoctorType.Yes && {
                defaultRowOption: {
                  gutter: 32,
                },
                defaultColOption: {
                  span: 24,
                },
                defaultCommonFormItemOption: {
                  labelCol: {
                    span: 24,
                  },
                  wrapperCol: {
                    span: 24,
                  },
                },
                content: [
                  {
                    element: (
                      <ProFormSelect
                        label={formatMessage({ id: 'contacts.学歴（大学）' })}
                        name="eduUniversity"
                        placeholder={formatMessage({ id: '请选择' })}
                        showSearch
                        fieldProps={{ optionFilterProp: 'children' }}
                        rules={[
                          {
                            max: 200,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 200 }),
                          },
                        ]}
                        options={numMedicalSchoolList.map((item) => ({
                          label: item.value,
                          value: item.code,
                        }))}
                      />
                    ),
                  },
                  {
                    colOption: {
                      span: 12,
                    },
                    element: (
                      <ProFormText
                        label={formatMessage({ id: 'contacts.学歴（学部）' })}
                        name="eduUndergraduate"
                        rules={[
                          {
                            max: 50,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 50 }),
                          },
                        ]}
                        placeholder={formatMessage({ id: '请输入' })}
                      />
                    ),
                  },
                  {
                    colOption: {
                      span: 12,
                    },
                    element: (
                      <ProFormDatePicker
                        label={formatMessage({ id: 'contacts.学歴（卒業年）' })}
                        name="eduGraduateYear"
                        picker="year"
                        width="100%"
                      />
                    ),
                  },
                  {
                    type: 'addition',
                    element: <b>{formatMessage({ id: 'contacts.免許' })}</b>,
                  },
                  {
                    element: (
                      <ProFormCheckbox
                        name="medicalDoctorLicense"
                        formItemProps={{
                          valuePropName: 'checked',
                          dependencies: ['medicalDentistLicense'],
                        }}
                        onChange={() => {
                          form?.setFieldsValue({
                            doctorLicenseNum: null,
                            doctorLicenseYear: null,
                          });
                        }}
                      >
                        {formatMessage({ id: 'contacts.医師' })}
                      </ProFormCheckbox>
                    ),
                  },
                  {
                    colOption: {
                      span: 12,
                    },
                    element: (
                      <ProFormDependency name={['medicalDoctorLicense']}>
                        {({ medicalDoctorLicense }) => (
                          <ProFormDigit
                            label={formatMessage({ id: 'contacts.医師－免許番号' })}
                            name="doctorLicenseNum"
                            max={9999999999999999999}
                            style={{ width: '100%' }}
                            disabled={!medicalDoctorLicense}
                            placeholder={formatMessage({ id: '请输入' })}
                          />
                        )}
                      </ProFormDependency>
                    ),
                  },
                  {
                    colOption: {
                      span: 12,
                    },
                    element: (
                      <ProFormDependency name={['medicalDoctorLicense']}>
                        {({ medicalDoctorLicense }) => (
                          <ProFormDatePicker
                            label={formatMessage({ id: 'contacts.医師－免許取得年' })}
                            name="doctorLicenseYear"
                            picker="year"
                            disabled={!medicalDoctorLicense}
                            width="100%"
                          />
                        )}
                      </ProFormDependency>
                    ),
                  },
                  {
                    element: (
                      <ProFormCheckbox
                        name="medicalDentistLicense"
                        formItemProps={{
                          valuePropName: 'checked',
                          dependencies: ['medicalDoctorLicense'],
                        }}
                        onChange={() => {
                          form?.setFieldsValue({
                            dentistLicenseNum: null,
                            dentistLicenseYear: null,
                          });
                        }}
                      >
                        {formatMessage({ id: 'contacts.歯科医師' })}
                      </ProFormCheckbox>
                    ),
                  },
                  {
                    colOption: {
                      span: 12,
                    },
                    element: (
                      <ProFormDependency name={['medicalDentistLicense']}>
                        {({ medicalDentistLicense }) => (
                          <ProFormDigit
                            label={formatMessage({ id: 'contacts.歯科医師－免許番号' })}
                            name="dentistLicenseNum"
                            max={9999999999999999999}
                            style={{ width: '100%' }}
                            disabled={!medicalDentistLicense}
                            placeholder={formatMessage({ id: '请输入' })}
                          />
                        )}
                      </ProFormDependency>
                    ),
                  },
                  {
                    colOption: {
                      span: 12,
                    },
                    element: (
                      <ProFormDependency name={['medicalDentistLicense']}>
                        {({ medicalDentistLicense }) => (
                          <ProFormDatePicker
                            label={formatMessage({ id: 'contacts.歯科医師－免許取得年' })}
                            name="dentistLicenseYear"
                            picker="year"
                            disabled={!medicalDentistLicense}
                            width="100%"
                          />
                        )}
                      </ProFormDependency>
                    ),
                  },
                  {
                    element: (
                      <ProFormTextArea
                        label={formatMessage({ id: 'contacts.認定医等の資格' })}
                        name="doctorQualifications"
                        rules={[
                          {
                            max: 500,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 500 }),
                          },
                        ]}
                        rows={4}
                        placeholder={formatMessage({ id: '请输入' })}
                      />
                    ),
                  },
                  {
                    element: (
                      <ProForm.Item
                        label={formatMessage({ id: 'contacts.勤務歴（過去５年程度）' })}
                        name="employmentRecords"
                      >
                        <EditableTable
                          editable={{ type: 'single' }}
                          columns={[
                            {
                              dataIndex: 'fromDate',
                              title: formatMessage({ id: 'contacts.From' }),
                              valueType: 'dateMonth',
                              fieldProps: (formItem, { rowKey }) => {
                                const toDate = formItem?.getFieldValue([rowKey, 'toDate']);
                                return {
                                  disabledDate: (currentDate) =>
                                    currentDate && currentDate > toDate,
                                };
                              },
                            },
                            {
                              dataIndex: 'toDate',
                              title: formatMessage({ id: 'contacts.To' }),
                              valueType: 'dateMonth',
                              fieldProps: (formItem, { rowKey }) => {
                                const fromDate = formItem?.getFieldValue([rowKey, 'fromDate']);
                                return {
                                  disabledDate: (currentDate) =>
                                    currentDate && currentDate < fromDate,
                                };
                              },
                            },
                            {
                              dataIndex: 'company',
                              title: formatMessage({ id: 'contacts.勤務歴' }),
                            },
                          ]}
                        />
                      </ProForm.Item>
                    ),
                  },
                  {
                    element: (
                      <ProFormText
                        label={formatMessage({ id: 'contacts.専門分野' })}
                        name="professionalField"
                        rules={[
                          {
                            max: 200,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 200 }),
                          },
                        ]}
                        placeholder={formatMessage({ id: '请输入' })}
                      />
                    ),
                  },
                  {
                    element: (
                      <ProFormTextArea
                        label={formatMessage({ id: 'contacts.所属学会等' })}
                        name="affiliatedSociety"
                        rows={4}
                        placeholder={formatMessage({ id: '请输入' })}
                        rules={[
                          {
                            max: 300,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 300 }),
                          },
                        ]}
                      />
                    ),
                  },
                  {
                    element: (
                      <ProFormTextArea
                        label={formatMessage({ id: 'contacts.主な研究内容、著書･論文等' })}
                        name="mainResearchContents"
                        rows={4}
                        placeholder={formatMessage({ id: '请输入' })}
                        rules={[
                          {
                            max: 3000,
                            message: formatMessage({ id: '文字内容限制提示语' }, { num: 3000 }),
                          },
                        ]}
                      />
                    ),
                  },
                  {
                    label: formatMessage({
                      id: 'contacts.治験・製造販売後臨床試験の実績 (過去2年程度)',
                    }),
                    element: (
                      <Table
                        rowKey="id"
                        dataSource={[
                          {
                            id: 1,
                            category: formatMessage({ id: 'contacts.件数(うち実施中)' }),
                            drug: (
                              <FormItem name="clinicalTrialDrugQuantity" noStyle>
                                <QuantityNumber />
                              </FormItem>
                            ),
                            medicalDevice: (
                              <FormItem name="clinicalTrialMedicalDevicesQuantity" noStyle>
                                <QuantityNumber />
                              </FormItem>
                            ),
                            regenerativeMedicalProduct: (
                              <FormItem name="treatmentTrialRegenerativeMedicine" noStyle>
                                <QuantityNumber />
                              </FormItem>
                            ),
                          },
                          {
                            id: 2,
                            category: formatMessage({ id: 'contacts.主な対象疾患' }),
                            drug: (
                              <FormItem
                                name="majorPatients"
                                style={{ marginBottom: 0 }}
                                rules={[
                                  {
                                    max: 200,
                                    message: formatMessage(
                                      { id: '文字内容限制提示语' },
                                      { num: 200 }
                                    ),
                                  },
                                ]}
                              >
                                <Input placeholder={formatMessage({ id: '请输入' })} />
                              </FormItem>
                            ),
                          },
                          {
                            id: 3,
                            category: (
                              <FormItem
                                label={formatMessage({ id: 'contacts.治験責任医師の経験(件数)' })}
                                name="experienceResponsibleDoctors"
                                style={{ marginBottom: 0 }}
                                rules={[
                                  {
                                    validator: (rule, value) => {
                                      const { value: text, linkage } = value;
                                      if (text === '2') {
                                        return Promise.resolve();
                                      }
                                      if (
                                        text === '1' &&
                                        (linkage['1'] < 1 || linkage['1'] > 999)
                                      ) {
                                        return Promise.reject(
                                          formatMessage(
                                            { id: '数字阈值提示' },
                                            { min: 1, max: 999 }
                                          )
                                        );
                                      }
                                      return Promise.resolve();
                                    },
                                  },
                                ]}
                              >
                                <Linkage
                                  flex={false}
                                  type="Radio"
                                  optionSource={infoHasList.map((item) => ({
                                    label: item.value,
                                    value: item.code,
                                  }))}
                                  linkageSource={[
                                    {
                                      key: '1',
                                      element: <InputNumber min={1} max={999} />,
                                    },
                                  ]}
                                />
                              </FormItem>
                            ),
                          },
                          {
                            id: 4,
                            category: (
                              <FormItem
                                label={formatMessage({ id: 'contacts.治験分担医師の経験(件数)' })}
                                name="experienceAsDoctor"
                                style={{ marginBottom: 0 }}
                                rules={[
                                  {
                                    validator: (rule, value) => {
                                      const { value: text, linkage } = value;
                                      if (text === '2') {
                                        return Promise.resolve();
                                      }
                                      if (
                                        text === '1' &&
                                        (linkage['1'] < 1 || linkage['1'] > 999)
                                      ) {
                                        return Promise.reject(
                                          formatMessage(
                                            { id: '数字阈值提示' },
                                            { min: 1, max: 999 }
                                          )
                                        );
                                      }
                                      return Promise.resolve();
                                    },
                                  },
                                ]}
                              >
                                <Linkage
                                  flex={false}
                                  type="Radio"
                                  optionSource={infoHasList.map((item) => ({
                                    label: item.value,
                                    value: item.code,
                                  }))}
                                  linkageSource={[
                                    {
                                      key: '1',
                                      element: <InputNumber min={1} max={999} />,
                                    },
                                  ]}
                                />
                              </FormItem>
                            ),
                          },
                        ]}
                        pagination={false}
                        columns={[
                          {
                            dataIndex: 'category',
                            title: formatMessage({ id: 'contacts.実施項目' }),
                            width: 150,
                            render: (text, row, index) => {
                              const obj = {
                                children: text,
                                props: {},
                              };
                              if (index > 1) {
                                obj.props.colSpan = 4;
                              }
                              return obj;
                            },
                          },
                          {
                            dataIndex: 'drug',
                            title: formatMessage({ id: 'contacts.主な対象疾患' }),
                            render: (text, row, index) => {
                              const obj = {
                                children: text,
                                props: {},
                              };
                              if (index === 1) {
                                obj.props.colSpan = 3;
                              }
                              return obj;
                            },
                          },
                          {
                            dataIndex: 'medicalDevice',
                            title: formatMessage({ id: 'contacts.医療機器' }),
                            render: (text, row, index) => {
                              const obj = {
                                children: text,
                                props: {},
                              };
                              if (index > 0) {
                                obj.props.colSpan = 0;
                              }
                              return obj;
                            },
                          },
                          {
                            dataIndex: 'regenerativeMedicalProduct',
                            title: formatMessage({ id: 'contacts.再生医療等製品' }),
                            render: (text, row, index) => {
                              const obj = {
                                children: text,
                                props: {},
                              };
                              if (index > 0) {
                                obj.props.colSpan = 0;
                              }
                              return obj;
                            },
                          },
                        ]}
                      />
                    ),
                  },
                ],
              },
          },
        ],
      })}
    >
      {children}
    </DrawerForm>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'Edit';

export default Index;
