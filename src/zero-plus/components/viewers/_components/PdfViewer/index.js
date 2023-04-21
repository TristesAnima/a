import React from 'react';
import { getLocale } from '@umijs/max';
import Iframe from '../../../Iframe';
import { getToken } from '../../../../utils/storage';

export default (props) => {
  const { src, headers, page = 1, search, ...rest } = props;

  return (
    <Iframe
      {...rest}
      src={`/parties/pdfjs-dist/web/viewer.html?file=#page=${page}`}
      beforeLoad={({ iframe }) => {
        document.addEventListener('webviewerloaded', () => {
          if (iframe.contentWindow) {
            const viewerApplicationOptions = iframe.contentWindow.PDFViewerApplicationOptions;
            viewerApplicationOptions.set('locale', getLocale());
          }
        });
      }}
      onChange={({ iframe }) => {
        const viewerApplication = iframe.contentWindow.PDFViewerApplication;

        if (viewerApplication) {
          viewerApplication.open(src, {
            httpHeaders: {
              Authorization: getToken(),
              ...headers,
            },
          });

          if (search) {
            viewerApplication.initializedPromise.then(() => {
              viewerApplication.findBar.open();
              viewerApplication.findBar.findField.value = search;
              viewerApplication.findBar.highlightAll.checked = true;
              viewerApplication.findBar.dispatchEvent('');
            });
          }
        }
      }}
    />
  );
};
