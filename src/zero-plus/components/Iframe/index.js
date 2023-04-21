import React, { useState, useEffect, useRef } from 'react';
import Spin from '../../components/Spin';

export default (props) => {
  const { src, beforeLoad, onLoad, onChange, ...rest } = props;

  const iframeRef = useRef();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (beforeLoad) {
      beforeLoad({ iframe: iframeRef.current });
    }
  }, []);

  useEffect(() => {
    if (loaded && src && onChange) {
      onChange({ iframe: iframeRef.current, src });
    }
  }, [loaded, src]);

  return (
    <>
      {!loaded && <Spin />}
      <iframe
        frameBorder={0}
        {...rest}
        ref={iframeRef}
        src={src}
        onLoad={() => {
          setLoaded(true);
          if (onLoad) {
            onLoad({ iframe: iframeRef.current });
          }
        }}
      />
    </>
  );
};
