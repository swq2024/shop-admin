import { queryParams } from "@/utils/formatUrl";
import { service } from "./axios";

export const loginApi = async (username: string, password: string) => {
  return service.request({
    url: "/admin/login",
    method: "POST",
    data: { username, password },
  });
};

export const getInfoApi = () => {
  return service.request({
    url: "/admin/getinfo",
    method: "POST",
  });
};

export const LogoutApi = () => {
  return service.request({
    url: "/admin/logout",
    method: "POST",
  });
};

export const modifiedPassApi = (data: any) => {
  return service.request({
    url: "/admin/updatepassword",
    method: "POST",
    data,
  });
};

export const getManagerListApi = (page: number, query = {}) => {
  const r = queryParams(query);
  return service.request({
    url: `/admin/manager/${page}${r}`,
    method: "GET",
  });
};

export const updateManagerStatusApi = (id: number, status: number) => {
  return service.request({
    url: `/admin/manager/${id}/update_status`,
    method: "POST",
    data: { status },
  });
};

export const createManagerApi = (data: any) => {
  return service.request({
    url: "/admin/manager",
    method: "POST",
    data
  })
}

export const updateManagerApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/manager/${id}`,
    method: "POST",
    data
  })
}

export const deleteManagerApi = (id: number) => {
  return service.request({
    url: `/admin/manager/${id}/delete`,
    method: "POST"
  })
}
