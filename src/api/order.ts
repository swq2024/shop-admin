import { queryParams } from "@/utils/formatUrl";
import { service } from "./axios";

export const getOrderListApi = (page: number, query: {}) => {
  const r = queryParams(query);
  return service.request({
    url: `/admin/order/${page}${r}`,
    method: "GET",
  });
};

export const deleteOrderApi = (ids: number[]) => {
  return service.request({
    url: `/admin/order/delete_all`,
    method: "POST",
    data: { ids },
  });
};

export const deliverOrderApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/order/${id}/ship`,
    method: "POST",
    data,
  });
};

export const handleOrderRefundApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/order/${id}/handle_refund`,
    method: "POST",
    data,
  });
};

export const exportOrderApi = (query: {}) => {
  const r = queryParams(query);
  return service.request({
    url: `/admin/order/excelexport${r}`,
    method: "POST",
    data: {},
    responseType: "blob",
  });
};

export const getExpressCompanyListApi = () => {
  return service.request({
    url: `/admin/express_company/1`,
    method: "GET",
  });
};

export const getOrderLogisticsInfoApi = (id: number) => {
  return service.request({
    url: `/admin/order/${id}/get_ship_info`,
    method: "GET",
  });
};
