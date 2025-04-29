export interface Lot {
  id: string;
  lot_id: number;
  site: number;
  base_site: string;
  salvage_id: number;
  odometer: number;
  price_new: number | null;
  price_future: number | null;
  reserve_price: number | null;
  current_bid: number;
  auction_date: string;
  cost_priced: number;
  cost_repair: number | null;
  year: number;
  cylinders: number;
  state: string;
  vehicle_type: string;
  auction_type: string;
  make: string;
  model: string;
  series: string;
  damage_pr: string;
  damage_sec: string;
  keys: string;
  odobrand: string;
  fuel: string;
  drive: string;
  transmission: string;
  color: string;
  status: string;
  title: string;
  vin: string;
  engine: string;
  engine_size: number;
  location: string;
  location_old: string;
  location_id: number;
  country: string;
  document: string;
  currency: string;
  seller: string;
  is_buynow: boolean;
  iaai_360: string | null;
  copart_exterior_360: string[];
  copart_interior_360: string | null;
  video: string | null;
  link_img_hd: string[];
  link_img_small: string[];
  link: string;
  body_type: string;
  seller_type: string;
  vehicle_score: string;
  created_at: string;
  updated_at: string;
}

export interface FilterParams {
  make?: string;
  model?: string;
  year_from?: number;
  year_to?: number;
  odometer_max?: number;
  state?: string;
  color?: string;
  fuel?: string;
  transmission?: string;
}

export type PropLot = {
  id: string;
  title: string;
  imageUrl: string;
  priceNew?: number | null;
  currentBid?: number;
  location?: string;
  odometer?: number;
  status?: string;
  keyStatus?: string;
  drive?: string;
  dateEnd?: string;
  lotId: number;
  vin?: string;
  damage?: string;
  sellerType?: string;
  site: number;
}
