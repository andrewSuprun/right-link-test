// domains/lots/hooks.ts
import { useState, useEffect } from 'react';
import { getLots } from './api';
import { Lot, PropLot } from './types';

import useSWR from 'swr';
import { fetcher } from '../../lib/fetcher';
import { useFilterStore } from '../../domains/lots/store';


const API_URL = process.env.NEXT_PUBLIC_API_URL || '';



export const useLots = () => {
  const [lots, setLots] = useState<PropLot[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number>()

  const { filters, setFilters } = useFilterStore();

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

  const fetchLots = async (newPage = page, reset = false) => {
    setIsLoading(true);
    try {
      const res = await getLots({ page: newPage, size: 10, ...filters });
      const mappedLots = res.data.map(mapLot);
      if (reset) {
        setLots(mappedLots);
      } else {
        setLots((prev) => [...prev, ...mappedLots]);
      }
      setHasMore(newPage < res.pages);
      setTotal(res.count)
    } catch (e) {
      console.error('Failed to fetch lots', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLots(nextPage);
  };

  useEffect(() => {
    setPage(1);
    fetchLots(1, true);
  }, [filters]);

  return {
    lots,
    loadMore,
    hasMore,
    isLoading,
    setFilters,
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


