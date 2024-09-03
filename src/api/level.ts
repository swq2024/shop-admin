import { service } from "./axios";

export const getVipLevelListApi = (page: number) => {
  return service.request({
    url: `/admin/user_level/${page}`,
    method: "GET",
  });
};

export const createVipLevelApi = (data: any) => {
  return service.request({
    url: "/admin/user_level",
    method: "POST",
    data,
  });
};

export const updateVipLevelApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/user_level/${id}`,
    method: "POST",
    data,
  });
};

export const deleteVipLevelApi = (id: number) => {
  return service.request({
    url: `/admin/user_level/${id}/delete`,
    method: "POST",
  });
};

export const updateVipLevelStatusApi = (id: number, status: number) => {
  return service.request({
    url: `/admin/user_level/${id}/update_status`,
    method: "POST",
    data: { status },
  });
};
