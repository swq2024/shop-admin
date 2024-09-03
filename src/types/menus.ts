export type menuListType = {
  id: number;
  rule_id: number;
  status: number;
  create_time: string;
  update_time: string;
  name: string;
  desc: string;
  frontpath: null;
  condition: null;
  menu: number;
  order: number;
  icon: string;
  method: string;
  child: [
    {
      id: number;
      rule_id: number;
      status: number;
      create_time: string;
      update_time: string;
      name: string;
      desc: string;
      frontpath: string;
      condition: null;
      menu: number;
      order: number;
      icon: string;
      method: string;
      child: [];
    }
  ];
};
