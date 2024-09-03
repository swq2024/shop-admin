import { queryParams } from "@/utils/formatUrl";
import { service } from "./axios";

export const getCommodityrListApi = (page: number, query = {}) => {
  const r = queryParams(query);
  return service.request({
    url: `/admin/goods/${page}${r}`,
    method: "GET",
  });
};

// 批量上架 / 下架
export const updateCommodityStatusApi = (ids: number[], status: number) => {
  return service.request({
    url: `/admin/goods/changestatus`,
    method: "POST",
    data: { ids, status },
  });
};

export const createCommodityApi = (data: any) => {
  return service.request({
    url: "/admin/goods",
    method: "POST",
    data,
  });
};

export const updateCommodityApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/goods/${id}`,
    method: "POST",
    data,
  });
};

export const deleteCommodityApi = (ids: number[]) => {
  return service.request({
    url: `/admin/goods/delete_all`,
    method: "POST",
    data: { ids },
  });
};
// 审核商品 1通过/2拒绝
export const checkCommodityApi = (id: number, ischeck: number) => {
  return service.request({
    url: `/admin/goods/${id}/check`,
    method: "POST",
    data: { ischeck },
  });
};

export const restoreCommodityApi = (ids: number[]) => {
  return service.request({
    url: `/admin/goods/restore`,
    method: "POST",
    data: { ids },
  });
};

export const destroyCommodityApi = (ids: number[]) => {
  return service.request({
    url: `/admin/goods/destroy`,
    method: "POST",
    data: { ids },
  });
};

export const getCommodityDetailApi = (id: number) => {
  return service.request({
    url: `/admin/goods/read/${id}`,
    method: "GET",
  });
};

export const setCommodityBannerApi = (id: number, banners: string[]) => {
  return service.request({
    url: `/admin/goods/banners/${id}`,
    method: "POST",
    data: { banners },
  });
};

export const updateCommoditySkuApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/goods/updateskus/${id}`,
    method: "POST",
    data,
  });
};

export const sortCommoditySkuApi = (data: any) => {
  return service.request({
    url: `/admin/goods_skus_card/sort`,
    method: "POST",
    data,
  });
};

export const createCommoditySkuCardValueApi = (data: any) => {
  return service.request({
    url: `/admin/goods_skus_card_value`,
    method: "POST",
    data,
  });
};

export const updateCommoditySkuCardValueApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/goods_skus_card_value/${id}`,
    method: "POST",
    data,
  });
};

export const deleteCommoditySkuCardValueApi = (id: number) => {
  return service.request({
    url: `/admin/goods_skus_card_value/${id}/delete`,
    method: "POST",
  });
};
