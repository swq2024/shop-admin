// 公共管理数据类型
export type TableListType = {
  id: number;
  title: string;
  content: string;
  order: number;
  create_time: string;
  update_time: string;
};

export type TableResDataType = {
    msg: string,
    data: {
        list: TableListType[]
    },
    totalCount: number
}
