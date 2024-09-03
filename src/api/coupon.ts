import { service } from "./axios";

export const getCouponListApi = (page: number) => {
  return service.request({
    url: `/admin/coupon/${page}`,
    method: "GET",
  });
};

export const creatCouponApi = (data: any) => {
  return service.request({
    url: "/admin/coupon",
    method: "POST",
    data,
  });
};

export const updateCouponApi = (id: number, data: any) => {
  return service.request({
    url: `/admin/coupon/${id}`,
    method: "POST",
    data,
  });
};

export const deleteCouponApi = (id: number) => {
  return service.request({
    url: `/admin/coupon/${id}/delete`,
    method: "POST",
  });
};

// 使优惠券失效
export const expireCouponStatusApi = (id: number) => {
  return service.request({
    url: `/admin/coupon/${id}/update_status`,
    method: "POST",
    data: { status: 0 },
  });
};
