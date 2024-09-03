export type CouponListType = {
  create_time: string;
  desc: string;
  end_time: string;
  id: number;
  min_price: string;
  name: string;
  order: number;
  start_time: string;
  status: number;
  total: number;
  type: number;
  update_time: string;
  used: number;
  value: string;
};
export type ResCouponListType = {
  list: CouponListType[];
  totalCount: number;
};
