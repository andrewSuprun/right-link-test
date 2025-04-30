import { fetcher } from '../../lib/fetcher';
import { Lot, FilterParams } from './types';

interface GetLotsResponse {
  size: number;
  page: number;
  pages: number;
  count: number;
  data: Lot[];
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
/**
 * Отримати список лотів з фільтрами і пагінацією
 */
interface GetLotsParams extends FilterParams {
  page?: number;
  size?: number;
}

export const getLots = async (paramsObj: GetLotsParams): Promise<GetLotsResponse> => {
  const params = new URLSearchParams();

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        value.forEach((v) => {
          if (v !== undefined && v !== null && v !== '') {
            params.append(key, String(v));
          }
        });
      }
    } else if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const url = `${API_URL}/cars?${params.toString()}`;
  return fetcher<GetLotsResponse>(url);
};





export const getCurrentBid = async (lotId: number, site: number): Promise<number | null> => {
  try {
    const response = await fetcher<{ pre_bid: number }>(
      `/cars/current-bid?lot_id=${lotId}&site=${site}`
    );
    return response.pre_bid ?? null;
  } catch (error) {
    console.error(`Failed to fetch current bid for lot ${lotId}:`, error);
    return null;
  }
};

export const getMakesAndModels = async (): Promise<
  { make: string; models: string[] }[]
> => {
  const url = `${API_URL}/cars/makes-and-models`;
  return fetcher(url);
};