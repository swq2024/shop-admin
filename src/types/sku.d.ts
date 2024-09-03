export type SkuLsitType = {
  create_time: string;
  default: string;
  id: number;
  name: string;
  order: number;
  status: number;
  type: number;
  update_time: string;
};

export type CommoditySkusCardType = {
  goodsSkusCardValue: [];
  goods_id: number;
  id: number;
  name: string;
  order: number;
  type: number;
};

export type CommoditySkusCardValueType = {
  goods_skus_card_id: number;
  id: number;
  name: string;
  order: number;
  text: string;
  value: string;
};
