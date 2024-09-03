import { service } from "./axios";

export const getRoleListApi = (page: number) => {
  return service.request({
    url: `/admin/role/${page}`,
    method: "GET",
  });
};

export const creatRoleApi = (data: any) => {
  return service.request({
    url: "/admin/role",
    method: "POST",
    data,
  });
};

export const updateRoleApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/role/${id}`,
    method: "POST",
    data,
  });
};

export const deleteRoleApi = (id: number) => {
  return service.request({
    url: `/admin/role/${id}/delete`,
    method: "POST",
  });
};

export const updateRoleStatusApi = (id: number, status: number) => {
  return service.request({
    url: `/admin/manager/${id}/update_status`,
    method: "POST",
    data: { status },
  });
};

export const configRoleAuthApi = (id: number, rule_ids: number[]) => {
  return service.request({
    url: `/admin/role/set_rules`,
    method: "POST",
    data: {
      id,
      rule_ids
    }
  });
};
