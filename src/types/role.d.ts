export type RoleListType = {
  create_time: string;
  desc: string;
  id: number;
  name: string;
  rules: RoleIdsListType[];
  status: number;
  update_time: string;
};

export type RoleIdsListType = {
  id: number;
  pivot: PivotListType[];
};

export type PivotListType = {
  id: number;
  role_id: number;
  rule_id: number;
};
