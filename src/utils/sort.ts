import { type Ref } from "vue";

// 规格选项上移
export const useArrayMoveUp = (arr: Ref[], index: number) =>
  swapArray(arr, index, index - 1);

// 规格选项下移
export const useArrayMoveDown = (arr: Ref[], index: number) =>
  swapArray(arr, index, index + 1);

export const swapArray = (arr: Ref[], index1: number, index2: number) => {
  if (
    index1 < 0 ||
    index1 >= arr.length ||
    index2 < 0 ||
    index2 >= arr.length
  ) {
    console.error("索引超出数组范围");
    return;
  }
  // 1. 用一个临时变量来交换两个数组元素
  // const temp = arr[index1];
  // arr[index1] = arr[index2];
  // arr[index2] = temp;
  // 2. 解构赋值交换两个数组元素
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
  // 3. Splice() 方法交换两个数组元素，从一个数组中移除一个或多个元素，然后用任何指定的元素替换这些元素。
  // 语法 array.splice(index, howmany, element1, ....., elementX)
  // arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};
