import {
  createCommoditySkuCardApi,
  deleteCommoditySkuCardApi,
  selectAndSetCommoditySkuCardValApi,
  updateCommoditySkuCardApi,
} from "@/api/sku";
import type {
  CommoditySkusCardType,
  CommoditySkusCardValueType,
} from "@/types/sku";
import { computed, nextTick, ref } from "vue";
import { toast } from "./layer";
import { useArrayMoveDown, useArrayMoveUp } from "./sort";
import {
  createCommoditySkuCardValueApi,
  deleteCommoditySkuCardValueApi,
  sortCommoditySkuApi,
  updateCommoditySkuCardValueApi,
} from "@/api/commodity";
import type { InputInstance } from "element-plus";

// 当前商品ID
export const commodityId = ref(0);

// 规格选项列表
export const sku_card_list = ref([]);

export const sku_list = ref([]);
// 初始化规格选项列表
export const initSkuCardList = (data: any) => {
  sku_card_list.value = data.goodsSkusCard.map(
    (item: CommoditySkusCardType) => {
      // @ts-ignore
      item.text = item.name;
      // @ts-ignore
      item.loading = false;
      item.goodsSkusCardValue.map((v) => {
        // @ts-ignore
        v.text = v.value || "属性值";
        return v;
      });
      return item;
    }
  );
  // sku_list.value = data.goodsSkus;
};

// 初始化规格选项的值
export const initSkuCardValue = (id: number) => {
  const item = sku_card_list.value.find(
    (item: CommoditySkusCardType) => item.id === id
  );
  const inputValue = ref("");
  const inputVisible = ref(false);
  const InputRef = ref<InputInstance>();
  const optLoading = ref(false);

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value!.input!.focus();
    });
  };
  // 添加
  const handleInputConfirm = () => {
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }
    optLoading.value = true;
    createCommoditySkuCardValueApi({
      goods_skus_card_id: id,
      // @ts-ignore
      name: item.name,
      order: 50,
      value: inputValue.value,
    })
      .then((res) => {
        // @ts-ignore
        item.goodsSkusCardValue.push({
          ...res,
          // @ts-ignore
          text: res.value,
        });
      })
      .finally(() => {
        inputVisible.value = false;
        inputValue.value = "";
        optLoading.value = false;
      });
  };
  // 修改
  const handlechange = (value: string, tag: CommoditySkusCardValueType) => {
    optLoading.value = true;
    updateCommoditySkuCardValueApi(tag.id, {
      goods_skus_card_id: id,
      // @ts-ignore
      name: item.name,
      order: tag.order,
      value: value,
    })
      .then(() => {
        tag.value = value;
      })
      .catch(() => {
        tag.text = tag.value;
      })
      .finally(() => {
        optLoading.value = false;
      });
  };
  // 删除
  const handleClose = (tag: CommoditySkusCardValueType) => {
    optLoading.value = true;
    deleteCommoditySkuCardValueApi(tag.id)
      .then(() => {
        // @ts-ignore
        const index = item.goodsSkusCardValue.findIndex(
          (item: any) => item.id === tag.id
        );
        // @ts-ignore
        index !== -1 && item.goodsSkusCardValue.splice(index, 1);
      })
      .finally(() => {
        optLoading.value = false;
      });
  };

  // 以对象的形式返回，才能被解构
  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    optLoading,
    handleClose,
    handlechange,
    showInput,
    handleInputConfirm,
  };
};

// 添加规格选项
export const btnLoading = ref(false);
export const addSkuCardEvent = () => {
  btnLoading.value = true;
  createCommoditySkuCardApi({
    goods_id: commodityId.value,
    name: "规格名称",
    order: 50,
    type: 0,
  })
    .then((res: any) => {
      // @ts-ignore
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      });
    })
    .finally(() => {
      btnLoading.value = false;
    });
};

// 修改规格选项
export const updateSkuCardEvent = (item: any) => {
  item.loading = true;
  updateCommoditySkuCardApi(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: 0,
  })
    .then(() => {
      item.name = item.text;
    })
    .catch(() => {
      item.text = item.name;
    })
    .finally(() => {
      item.loading = false;
    });
};

// 删除规格选项
export const deleteSkuCardEvent = (item: any) => {
  item.loading = true;
  deleteCommoditySkuCardApi(item.id)
    .then(() => {
      const index = sku_card_list.value.findIndex((i: any) => i.id !== item.id);
      index !== -1 && sku_card_list.value.splice(index, 1);
      toast("删除成功");
    })
    .finally(() => (item.loading = false));
};

// 排序规格选项  上移 / 下移
export const cardLoading = ref(false);
export const sortSkuCardEvent = (action: string, index: number) => {
  // 对 sku_card_list.value 进行浅拷贝
  const oList = JSON.parse(JSON.stringify(sku_card_list.value));
  const func = action === "up" ? useArrayMoveUp : useArrayMoveDown;
  func(oList, index);

  const sortData = oList.map((item: any, index: number) => {
    return {
      id: item.id,
      order: index + 1,
    };
  });
  // console.log(sortData);
  cardLoading.value = true;
  sortCommoditySkuApi({
    sortdata: sortData,
  })
    .then(() => {
      func(sku_card_list.value, index);
    })
    .finally(() => (cardLoading.value = false));
};

// 选择设置规格项 规格值
export const handleSelectAndSetCommoditySkuCardVal = (
  id: number,
  data: any
) => {
  const oItem = sku_card_list.value.find((o) => o.id === id);
  oItem.loading = true;
  selectAndSetCommoditySkuCardValApi(id, data)
    .then((res) => {
      // console.log(res);
      oItem.name = oItem.text = res.goods_skus_card.name;
      oItem.goodsSkusCardValue = res.goods_skus_card_value.map((o) => {
        o.text = o.value || "属性值";
        return o;
      });
    })
    .finally(() => {
      oItem.loading = false;
    });
};

// 初始化规格表格
export const initSkuTable = () => {
  // const skuLabels = computed(() => sku_card_list.value.filter(v => v.goodsSkusCardValue.length > 0))

  // const tableThs = computed
}
