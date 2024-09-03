import { service } from "./axios";

export const getOriginalSysConfigApi = () => {
  return service.request({
    url: "/admin/sysconfig",
    method: "GET",
  });
};

export const updateSysConfigApi = (data: any) => {
  return service.request({
    url: "/admin/sysconfig",
    method: "POST",
    data,
  });
};

export const uploadAction = `${import.meta.env.VITE_APP_BASE_API}/admin/sysconfig/upload`

export const uploadFileApi = (data: any) => {
  return service.request({
    url: "/admin/sysconfig/upload",
    method: "POST",
    data,
  });
};
