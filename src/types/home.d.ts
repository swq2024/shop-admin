export type CardDataType = {
  title: string;
  subTitle: string;
  value: number;
  subValue: number;
  unit: string;
  subUnit: string;
  unitColor: string;
};
export type ResDataType = {
  panels: cardDataType[];
};

export type ShopDataType = {
  label: string;
  value: number;
};
export type ShopResDataType = {
  goods: ShopDataType[];
  order: ShopDataType[];
};
