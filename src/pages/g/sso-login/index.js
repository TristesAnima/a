import React, { useEffect } from 'react';
import { useModel, useLocation } from '@umijs/max';
import { parse } from 'qs';
import PageLoading from '@/components/PageLoading';

export default () => {
  const location = useLocation();
  const { token, callback } = parse(location.search, { ignoreQueryPrefix: true });

  const { initialState } = useModel('@@initialState');
  const { ssoLogin } = initialState;

  useEffect(() => {
    ssoLogin({ token }).then(() => {
      window.location.href = callback || '/';
    });
  }, []);

  return <PageLoading />;
};
