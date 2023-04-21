import React from 'react';
import { Upload } from 'antd';
import AutomaticUpload from './_components/AutomaticUpload';
import ManualUpload from './_components/ManualUpload';

const Index = (props) => {
  if (props.hasOwnProperty('action')) {
    return <AutomaticUpload {...props} />;
  }
  return <ManualUpload {...props} />;
};

Object.keys(Upload).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Upload[item];
  }
});
export default Index;
