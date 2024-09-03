import { service } from "./axios";

export const getRuleListApi = (page: number) => {
  return service.request({
    url: `/admin/rule/${page}`,
    method: "GET",
  });
};

export const createRuleApi = (data: any) => {
  return service.request({
    url: "/admin/rule",
    method: "POST",
    data,
  });
};

export const updateRuleApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/rule/${id}`,
    method: "POST",
    data,
  });
};

export const updateRuleStatusApi = (id: number, status: number) => {
  return service.request({
    url: `/admin/rule/${id}/update_status`,
    method: "POST",
    data: { status },
  });
};

export const deleteRuleApi = (id: number) => {
  return service.request({
    url: `/admin/rule/${id}/delete`,
    method: "POST",
  });
};
