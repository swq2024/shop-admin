import { queryParams } from "@/utils/formatUrl";
import { service } from "./axios";

export const getUserListApi = (page: number, query = {}) => {
  const r = queryParams(query);
  return service.request({
    url: `/admin/user/${page}${r}`,
    method: "GET",
  });
};

export const createUserApi = (data: any) => {
  return service.request({
    url: "/admin/user",
    method: "POST",
    data,
  });
};

export const updateUserApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/user/${id}`,
    method: "POST",
    data,
  });
};

export const deleteUserApi = (id: number) => {
  return service.request({
    url: `/admin/user/${id}/delete`,
    method: "POST",
  });
};

export const updateUserStatusApi = (id: number, status: number) => {
  return service.request({
    url: `/admin/user/${id}/update_status`,
    method: "POST",
    data: { status },
  });
};
