import React from 'react';
import * as PropTypes from 'prop-types';
import { downloadTemplate, importSponsors } from '@/services/sponsor';
import { isArray } from 'lodash';
import { notification, Typography } from 'antd';
import { ImportFile } from '@/components/TsProjectComponents';
import { useIntl } from '@umijs/max';

const { Paragraph } = Typography;

const propTypes = {
  children: PropTypes.element.isRequired,
  onOk: PropTypes.func,
};

const defaultProps = {
  onOk: () => {},
};

const Index = (props) => {
  const { children, onOk } = props;
  const { formatMessage } = useIntl();
  return (
    <ImportFile
      key="import"
      accept={['.xls', '.xlsx']}
      importService={importSponsors}
      downloadService={downloadTemplate}
      eSign={{
        authorityName: '关联机构:申办方-导入',
      }}
      onOk={({ data }) => {
        if (isArray(data) && data.length) {
          notification.warning({
            message: formatMessage({ id: '提示' }),
            duration: null,
            description: (
              <Typography>
                {data.map((item, index) => (
                  <Paragraph key={`${index + 1}`}>
                    {!!item.size &&
                      !item.ceo &&
                      formatMessage(
                        { id: 'contacts.导入申办方重复提示' },
                        { size: item.size, sponsorName: item.sponsorName }
                      )}
                    {!!item.nameChar &&
                      item.sponsorName &&
                      formatMessage(
                        { id: 'contacts.导入没有申办方提示' },
                        { name: item.nameChar, sponsorName: item.sponsorName }
                      )}
                    {!!item.nameChar &&
                      !item.sponsorName &&
                      !item.error &&
                      !('sponsorAffiliationName' in item) &&
                      !item.ceo &&
                      !('email' in item) &&
                      !item.errorType &&
                      formatMessage({ id: 'contacts.导入申办方为空提示' }, { name: item.nameChar })}
                    {!!item.nameChar &&
                      !!item.error &&
                      formatMessage(
                        { id: 'contacts.机种文字提示' },
                        { nameChar: item.nameChar, text: item.error }
                      )}
                    {!!item.sponsorAffiliationName &&
                      formatMessage(
                        { id: 'contacts.导入没有所属提示' },
                        {
                          name: item.nameChar,
                          sponsorAffiliationName: item.sponsorAffiliationName,
                        }
                      )}
                    {'sponsorAffiliationName' in item &&
                      !item.sponsorAffiliationName &&
                      formatMessage(
                        { id: 'contacts.导入所属为空提示' },
                        {
                          name: item.nameChar,
                        }
                      )}
                    {item.type === 1 &&
                      item.ceo &&
                      item.size &&
                      formatMessage(
                        { id: 'contacts.导入申办方文件内CEO重复提示' },
                        {
                          sponsorName: item.ceo,
                          size: item.size,
                        }
                      )}
                    {item.type === 3 &&
                      item.ceo &&
                      formatMessage(
                        { id: 'contacts.导入申办方已经存在CEO提示' },
                        {
                          sponsorName: item.ceo,
                        }
                      )}
                    {item.type === 2 &&
                      item.ceo &&
                      formatMessage(
                        { id: 'contacts.导入申办方联系人CEO为空提示' },
                        {
                          nameChar: item.nameChar,
                        }
                      )}
                    {'email' in item &&
                      formatMessage(
                        { id: 'contacts.导入时联系人邮箱为空提示' },
                        {
                          nameChar: item.nameChar,
                        }
                      )}
                    {'namePinyin' in item &&
                      formatMessage(
                        { id: 'contacts.导入时联系人拼音名称为空提示' },
                        {
                          nameChar: item.namePinyin,
                        }
                      )}
                    {item.errorType === '1' &&
                      formatMessage(
                        { id: 'contact.导入申办方英文名称为空提示' },
                        {
                          name: item.nameChar,
                        }
                      )}
                    {item.errorType === '2' &&
                      formatMessage(
                        { id: 'contact.导入申办方英文名称重复提示' },
                        {
                          name: item.nameChar,
                        }
                      )}
                    {item.errorType === '3' &&
                      formatMessage(
                        { id: 'contact.导入申办方部门为空提示' },
                        {
                          name: item.nameChar,
                        }
                      )}
                    {item.errorType === '4' &&
                      formatMessage(
                        { id: 'contact.导入申办方部门英文名为空提示' },
                        {
                          name: item.nameChar,
                        }
                      )}
                  </Paragraph>
                ))}
              </Typography>
            ),
          });
        }
        onOk();
      }}
    >
      {children}
    </ImportFile>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = '';

export default Index;
