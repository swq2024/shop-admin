import { queryParams } from "@/utils/formatUrl";
import { service } from "./axios";

export const getCommodityCommentListApi = (page: number, query = {}) => {
  const r = queryParams(query);
  return service.request({
    url: `/admin/goods_comment/${page}${r}`,
    method: "GET",
  });
};

export const updateCommodityCommentStatusApi = (id: number, status: number) => {
  return service.request({
    url: `/admin/goods_comment/${id}/update_status`,
    method: "POST",
    data: { status },
  });
};

export const replyCommodityCommentApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/goods_comment/review/${id}`,
    method: "POST",
    data: { data },
  });
};
