export type ImageCategoryListType = {
  id: number;
  images_count: number;
  name: string;
  order: number;
};

export type ResListType = {
  list: ImageCategoryListType[];
  totalCount: number;
};

export type ImageListType = {
  id: number;
  url: string;
  name: string;
  path: string;
  create_time: string;
  update_time: string;
  image_class_id: number;
};
