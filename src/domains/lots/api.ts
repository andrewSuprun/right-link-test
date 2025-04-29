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

  if (paramsObj.page) params.append('page', paramsObj.page.toString());
  if (paramsObj.size) params.append('size', paramsObj.size.toString());

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (key !== 'page' && key !== 'size' && value !== undefined && value !== null && value !== '') {
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