import { service } from "./axios";

export const getImageListApi = (
  id: number,
  page: number = 1,
  limit?: number
) => {
  return service.request({
    url: `/admin/image_class/${id}/image/${page}`,
    method: "GET",
  });
};

export const renameImageApi = (id: number, name: string) => {
  return service.request({
    url: `/admin/image/${id}`,
    method: "POST",
    data: { name },
  });
};

export const deleteImageApi = (ids: number[]) => {
  return service.request({
    url: "/admin/image/delete_all",
    method: "POST",
    data: { ids },
  });
};

export const uploadImageAction = `${import.meta.env.VITE_APP_BASE_API}/admin/image/upload`
