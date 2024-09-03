import { service } from "./axios";

export const getNoticeListApi = (page: number) => {
  return service.request({
    url: `/admin/notice/${page}`,
    method: "GET",
  });
};

export const creatNoticeApi = (data: any) => {
  return service.request({
    url: "/admin/notice",
    method: "POST",
    data,
  });
};

export const updateNoticeApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/notice/${id}`,
    method: "POST",
    data,
  });
};

export const deleteNoticeApi = (id: number) => {
  return service.request({
    url: `/admin/notice/${id}/delete`,
    method: "POST",
  });
};
