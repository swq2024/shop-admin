import { service } from "./axios";

export const getStatistics1Api = () => {
  return service.request({
    url: "/admin/statistics1",
    method: "GET",
  });
};

export const getStatistics2Api = () => {
  return service.request({
    url: "/admin/statistics2",
    method: "GET",
  });
};

export const getStatistics3Api = (type: string) => {
  return service.request({
    url: `/admin/statistics3?type=${type}`,
    method: "GET",
  });
};
