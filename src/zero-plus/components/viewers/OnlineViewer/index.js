import React from 'react';
import Spin from '../../../components/Spin';
import Iframe from '../../Iframe';
import PdfViewer from '../_components/PdfViewer';
import useFiletype from './_hooks/useFiletype';

export default (props) => {
  if (!props.src) {
    return <Spin />;
  }
  const { src, filetype, ...rest } = useFiletype(props);
  if (
    /pdf/i.test(filetype) &&
    (src.startsWith(window.location.origin) || !/^(http)s?/i.test(src))
  ) {
    return <PdfViewer {...rest} src={src} />;
  }
  return <Iframe {...rest} src={src} />;
};
