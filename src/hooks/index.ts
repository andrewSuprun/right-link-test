import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useFilterStore } from '../domains/lots/store';

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


export const useUpdateUrlFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (updated: Record<string, string | string[] | number | number[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updated).forEach(([key, value]) => {
      params.delete(key); // видаляємо всі попередні значення ключа
      if (value == null) return; // якщо null, не додаємо

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`?${params.toString()}`);
  };
};


export const useInitializeFiltersFromURL = () => {
  const searchParams = useSearchParams();
  const { setFilters, markInitialized } = useFilterStore();

  useEffect(() => {
    const entries = Object.fromEntries(searchParams.entries());

    const filters = {
      site: searchParams.getAll('site').map(Number),
      make: searchParams.getAll('make'),
      model: entries.model || '',
      year_from: entries.year_from ? +entries.year_from : undefined,
      year_to: entries.year_to ? +entries.year_to : undefined,
    };

    setFilters(filters);
    markInitialized(); // ✅ Let the app know filters are ready
  }, [searchParams, setFilters, markInitialized]);
};

