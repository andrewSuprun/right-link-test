import { useEffect, useState } from 'react';


export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};




export function useIsSafari() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafariBrowser =
      /^((?!chrome|android).)*safari/i.test(ua) || navigator.vendor?.includes('Apple');
    setIsSafari(isSafariBrowser);
  }, []);

  return isSafari;
}
