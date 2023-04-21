import React from 'react';
import { FooterToolbar } from '../_components';

const Index = () => {
  return (
    <>
      中心质检
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
