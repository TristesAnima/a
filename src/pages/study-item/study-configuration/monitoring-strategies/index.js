import React from 'react';
import { FooterToolbar } from '../_components';

const Index = () => {
  return (
    <>
      监控策略
      <FooterToolbar
        onPrev={(prev) => {
          prev();
        }}
        onNext={(next) => {
          next();
        }}
      />
    </>
  );
};

export default Index;
