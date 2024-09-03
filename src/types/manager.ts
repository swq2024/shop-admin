export type RoleDataType = {
  id: number;
  name: string;
};

export type ManagerListType = {
  avatar: string;
  create_time: string;
  id: number;
  role: RoleDataType[];
  role_id: number;
  status: number;
  super: number;
  update_time: string;
  username: string;
};

export type ResManagerType = {
  list: ManagerListType[];
  roles: RoleDataType[];
  totalCount: number;
};
