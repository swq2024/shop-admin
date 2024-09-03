import type { TableListType } from "@/types/table";
import type { ElTable, FormInstance, FormRules } from "element-plus";
import { computed, reactive, ref } from "vue";
import { toast } from "./layer";

export const useInitTable = (opt = {}) => {
  let searchForm = null;
  let resetSearchForm = null;
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm });
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key];
      }
      getTableData();
    };
  }
  // 表格加载动画
  const isLoading = ref(false);
  const tableData = ref<TableListType[]>([]);
  // 分页
  const currentPage = ref(1);
  const totalPages = ref(0);
  // 默认每页显示10条
  const pageSize = ref(10);

  const getTableData = (p = null) => {
    if (typeof p === "number") {
      currentPage.value = p;
    }
    isLoading.value = true;

    opt
      .getListApi(currentPage.value, searchForm)
      .then((res) => {
        if (
          opt.onGetListSuccess &&
          typeof opt.onGetListSuccess === "function"
        ) {
          opt.onGetListSuccess(res);
        } else {
          tableData.value = res.list;
          // @ts-ignore
          totalPages.value = res.totalCount;
        }
      })
      .finally(() => (isLoading.value = false));
  };

  getTableData();

  // 删除
  const handleDelete = (id: number) => {
    isLoading.value = true;
    opt
      .delete(id)
      .then(() => {
        toast("删除成功");
        getTableData();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  };
  // 修改状态
  const handleChangeStatus = (status: number, row: any) => {
    // @ts-ignore
    row.statusLoading = true;
    // $event 参数传递的为 switch即将进入的状态值
    opt
      .updateStatus(row.id, status)
      .then(() => {
        toast("修改状态成功");

        row.status = status;

        // getTableData()
      })
      .finally(() => {
        // @ts-ignore
        row.statusLoading = false;
      });
  };
  // 批量选中的 ids[]
  const multiSelectionIds = ref([]);
  const handleSelectionChange = (e: any) => {
    // @ts-ignore
    multiSelectionIds.value = e.map((item) => item.id) || [];
  };
  // 批量删除
  const multipleTableRef = ref<InstanceType<typeof ElTable>>();
  const handleMultiDelete = () => {
    isLoading.value = true;
    opt
      .delete(multiSelectionIds.value)
      .then(() => {
        // if (multiSelectionIds.value.length > 1) {
        //     toast("批量删除成功")
        // } else {
        toast("删除成功");
        // }
        // 清空选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
          console.log("清空选中");
        }
        getTableData();
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  // 批量修改状态
  const handleMultiUpdateStatus = (status: number) => {
    isLoading.value = true;
    opt
      .updateStatus(multiSelectionIds.value, status)
      .then(() => {
        // if (multiSelectionIds.value.length > 1) {
        //     toast("批量修改成功")
        // } else {
        toast("修改成功");
        // }
        // 清空选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
        // 刷新页面 重新获取数据
        getTableData();
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  // 批量操作 恢复/彻底删除/...
  const useMultiAction = (interFace: Function, msg: string) => {
    isLoading.value = true;
    interFace(multiSelectionIds.value)
      .then(() => {
        toast(`${msg}成功`);
        if (multiSelectionIds.value) {
          multipleTableRef.value?.clearSelection();
        }
        getTableData();
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  return {
    isLoading,
    tableData,
    currentPage,
    totalPages,
    pageSize,
    searchForm,
    multipleTableRef,
    multiSelectionIds,
    resetSearchForm,
    getTableData,
    handleDelete,
    handleChangeStatus,
    handleSelectionChange,
    handleMultiDelete,
    handleMultiUpdateStatus,
    useMultiAction,
  };
};

export const useInitForm = (opt = {}) => {
  const formRef = ref<FormInstance | null>(null);
  const FormDrawerRef = ref(null);
  // 新增
  const defaultForm = opt.form;
  const form = reactive<typeof opt.form>({});

  const formRules = ref<FormRules<typeof form>>(opt.rules) || {};
  // 重置
  const resetForm = (row = false) => {
    if (formRef.value) formRef.value.clearValidate();

    for (const key in defaultForm) {
      // @ts-ignore
      form[key] = row[key];
    }
  };
  // 打开新增 抽屉组件框
  const handleOpenAdd = () => {
    editId.value = 0;
    // @ts-ignore
    resetForm(defaultForm);
    // @ts-ignore
    FormDrawerRef.value?.open();
  };

  // 编辑
  const editId = ref(0);
  const drawerTitle = computed(() => (editId.value ? "编辑" : "新增"));

  const handleEdit = (row: TableListType) => {
    editId.value = row.id;
    // @ts-ignore
    resetForm(row);
    // @ts-ignore
    FormDrawerRef.value?.open();
  };

  const handleSubmit = (FormEl: FormInstance | undefined) => {
    if (!FormEl) return;

    FormEl.validate((vaild) => {
      if (!vaild) return;
      // @ts-ignore
      FormDrawerRef.value?.showLoading();

      let body = {};
      if (opt.beforeSubmit && typeof opt.beforeSubmit === "function") {
        body = opt.beforeSubmit({ ...form });
      } else {
        body = form;
      }

      const fun = editId.value
        ? opt.update(editId.value, body)
        : opt.create(body);

      fun
        .then(() => {
          FormEl.resetFields();

          toast(`${drawerTitle.value}成功`);
          // @ts-ignore 编辑刷新当前页，新增刷新第一页
          opt.getTableData(editId.value ? null : 1);

          // @ts-ignore
          FormDrawerRef.value?.close();
        })
        .finally(() => {
          // @ts-ignore
          FormDrawerRef.value?.hideLoading();
        });
    });
  };

  return {
    formRef,
    FormDrawerRef,
    form,
    formRules,
    editId,
    drawerTitle,
    resetForm,
    handleOpenAdd,
    handleEdit,
    handleSubmit,
  };
};
