import { queryParams } from "@/utils/formatUrl";
import { service } from "./axios";

export const getDistributionStatisticsDataApi = () => {
  return service.request({
    url: "/admin/agent/statistics",
    method: "GET",
  });
};

export const getDistributorListApi = (page: number, query: {}) => {
  const r = queryParams(query);
  return service.request({
    url: `/admin/agent/${page}${r}`,
    method: "GET",
  });
};

export const getSpreadOrderListApi = (page: number, query: {}) => {
  const r = queryParams(query);
  return service.request({
    url: `/admin/user_bill/${page}${r}`,
    method: "GET",
  });
};

export const getDistributionConfigApi = () => {
  return service.request({
    url: "/admin/distribution_setting/get",
    method: "GET",
  });
};

export const updateDistributionConfigApi = (data: any) => {
  return service.request({
    url: "/admin/distribution_setting/set",
    method: "POST",
    data,
  });
};
