// domains/lots/hooks.ts
import { useState, useEffect, useRef, useMemo } from 'react';
import { getLots } from './api';
import { Lot, PropLot } from './types';

import useSWR from 'swr';
import { fetcher } from '../../lib/fetcher';
import { useFilterStore } from '../../domains/lots/store';
import { useSearchParams } from 'next/navigation';
import { useUpdateUrlFilters } from '../../hooks';



const API_URL = process.env.NEXT_PUBLIC_API_URL || '';



export const useLots = () => {
  const searchParams = useSearchParams();
  const updateUrl = useUpdateUrlFilters();
  const initialPage = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);

  const [page, setPage] = useState(initialPage);
  const [lots, setLots] = useState<PropLot[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number>();

  const firstRenderRef = useRef(true);
  const filterKey = useRef<string>('');

  const { filters, initialized } = useFilterStore();

  const mapLot = (lot: Lot): PropLot => ({
    id: lot.id,
    title: lot.title || `${lot.year} ${lot.make} ${lot.model}`,
    imageUrl: lot.link_img_small?.[0] || '/no-image.png',
    priceNew: lot.price_new,
    currentBid: lot.current_bid,
    location: lot.location_old,
    odometer: lot.odometer,
    status: lot.status,
    keyStatus: lot.keys,
    drive: lot.drive,
    dateEnd: lot.auction_date,
    lotId: lot.lot_id,
    vin: lot.vin,
    damage: lot.damage_pr,
    sellerType: lot.seller_type,
    site: lot.site,
    odobrand: lot.odobrand,
  });

  const fetchLots = async (fetchPage: number, reset = false) => {
    if (!initialized) return;
    setIsLoading(true);
    try {
      const res = await getLots({ page: fetchPage, size: 10, ...filters });
      const mapped = res.data.map(mapLot);
      setLots((prev) => (reset ? mapped : [...prev, ...mapped]));
      setHasMore(fetchPage < res.pages);
      setTotal(res.count);
    } catch (e) {
      console.error('Failed to fetch lots', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || isLoading || !initialized) return;
    const nextPage = page + 1;
    setPage(nextPage);
    updateUrl({ ...filters, page: String(nextPage) });
    fetchLots(nextPage);
  };

  useEffect(() => {
    if (!initialized) return;

    const currentKey = JSON.stringify(filters);
    const isFilterChanged = currentKey !== filterKey.current;

    if (isFilterChanged) {
      filterKey.current = currentKey;

      if (firstRenderRef.current) {
        firstRenderRef.current = false;
        fetchLots(page, true);
        return;
      }

      setPage(1);
      updateUrl({ ...filters, page: '1' });
      fetchLots(1, true);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, initialized]);

  return {
    lots,
    loadMore,
    hasMore,
    isLoading,
    filters,
    total,
  };
};





type CurrentBidResponse = {
  lot_id: number;
  site: number;
  pre_bid: number;
}
export const useCurrentBidWhenVisible = (
  lotId: number,
  site: number,
  inView: boolean
): {
  currentBid: number | null;
  isLoading: boolean;
  error: Error | undefined;
} => {
  const shouldFetch = inView && !!lotId && !!site;
  const endpoint = shouldFetch ? `${API_URL}/cars/current-bid?lot_id=${lotId}&site=${site}` : null;

  const { data, error, isLoading } = useSWR<CurrentBidResponse, Error>(
    endpoint,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      refreshInterval: inView ? 5000 : 0,
    }
  );

  return {
    currentBid: data?.pre_bid ?? null,
    isLoading,
    error,
  };
};


