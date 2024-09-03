import { service } from "./axios";

export const getSkuListApi = (page: number) => {
  return service.request({
    url: `/admin/skus/${page}`,
    method: "GET",
  });
};

export const creatSkuApi = (data: any) => {
  return service.request({
    url: "/admin/skus",
    method: "POST",
    data,
  });
};

export const updateSkuApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/goods/updateskus/${id}`,
    method: "POST",
    data,
  });
};

export const createCommoditySkuCardApi = (data: any) => {
  return service.request({
    url: `/admin/goods_skus_card`,
    method: "POST",
    data,
  });
};

export const updateCommoditySkuCardApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/goods_skus_card/${id}`,
    method: "POST",
    data,
  });
};

export const deleteCommoditySkuCardApi = (id: number) => {
  return service.request({
    url: `/admin/goods_skus_card/${id}/delete`,
    method: "POST",
  });
};

export const deleteSkuApi = (ids: number[]) => {
  ids = !Array.isArray(ids) ? [ids] : ids;
  return service.request({
    url: `/admin/skus/delete_all`,
    method: "POST",
    data: { ids },
  });
};

export const updateSkuStatusApi = (id: number, status: number) => {
  return service.request({
    url: `/admin/skus/${id}/update_status`,
    method: "POST",
    data: { status },
  });
};

export const selectAndSetCommoditySkuCardValApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/goods_skus_card/${id}/set`,
    method: "POST",
    data
  })
}
