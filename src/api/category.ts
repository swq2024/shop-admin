import { service } from "./axios";

export function getCategoryListApi() {
  return service.request({
    url: "/admin/category",
    method: "GET",
  });
}

export function getAssociateCommodityListApi(cid: number) {
  return service.request({
    url: `/admin/app_category_item/list?category_id=${cid}`,
    method: "GET",
  });
}

export const createCategoryApi = (data: any) => {
  // name 分类名称
  return service.request({
    url: "/admin/category",
    method: "POST",
    data
  });
};

export const updateCategoryApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/category/${id}`,
    method: "POST",
    data
  });
};

export const deleteCategoryApi = (id: number) => {
  return service.request({
    url: `/admin/category/${id}/delete`,
    method: "POST",
  });
};

export const updateCategoryStatusApi = (id: number, status: number) => {
  return service.request({
    url: `/admin/category/${id}/update_status`,
    method: "POST",
    data: { status },
  });
};

// 删除关联商品
export const deleteAssociateCommodityApi = (id: number) => {
  return service.request({
    url: `/admin/app_category_item/${id}/delete`,
    method: "POST",
  });
};

// 关联商品
export const associateCommodityApi = (data: any) => {
  return service.request({
    url: `/admin/app_category_item`,
    method: "POST",
    data,
  });
};
