import React from 'react';
import Resumablejs from 'resumablejs';
import Upload from '../Upload';

export default ({ config, ...rest }) => (
  <Upload
    customRequest={({
      method,
      action,
      data,
      headers,
      withCredentials,
      filename,
      file,
      onProgress,
      onSuccess,
    }) => {
      const r = new Resumablejs({
        uploadMethod: method,
        target: action,
        query: data,
        headers,
        withCredentials,
        fileParameterName: filename,

        chunkSize: 5 * 1024 * 1024,

        chunkNumberParameterName: 'chunk',
        totalChunksParameterName: 'chunks',
        chunkSizeParameterName: 'chunkSize',
        currentChunkSizeParameterName: 'currentChunkSize',
        totalSizeParameterName: 'size',
        identifierParameterName: 'uuid',
        fileNameParameterName: 'name',
        relativePathParameterName: 'relativePath',
        typeParameterName: 'type',

        testChunks: false,
        ...config,
      });

      r.addFile(file);

      r.on('fileAdded', () => {
        r.upload();
      });
      r.on('fileProgress', (resumableFile) => {
        onProgress({ percent: resumableFile.progress() * 100 });
      });
      r.on('fileSuccess', (resumableFile, responseBody) => {
        onSuccess(responseBody, resumableFile.file);
      });
    }}
    {...rest}
  />
);
