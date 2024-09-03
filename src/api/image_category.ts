import { service } from "./axios";

export const getImageCategoryApi = (page: number) => {
  return service.request({
    url: `/admin/image_class/${page}`,
    method: "GET",
  });
};

export const createImageCategoryApi = (data: any) => {
  return service.request({
    url: "/admin/image_class",
    method: "POST",
    data,
  });
};

export const updateImageCategoryApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/image_class/${id}`,
    method: "POST",
    data,
  });
};

export const deleteImageCategoryApi = (id: number) => {
  return service.request({
    url: `/admin/image_class/${id}/delete`,
    method: "POST",
  });
};
