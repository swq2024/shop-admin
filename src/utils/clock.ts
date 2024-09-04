import dayjs from "dayjs";
import { onBeforeUnmount, onMounted, ref } from "vue";

export const updateDate = () => {
  const date = ref("");
  const week = ref("");
  const hour = ref("");
  const minute = ref("");
  const updateTime = () => {
    date.value = dayjs().format("YYYY-MM-DD");
    week.value = dayjs().calendar().substring(22);
    hour.value = dayjs().hour().toString().padStart(2, "0");
    minute.value = dayjs().minute().toString().padStart(2, "0");
  };
  let intervalId = null;
  intervalId = setInterval(updateTime, 1000);
  onMounted(() => updateTime());
  onBeforeUnmount(() => clearInterval(intervalId));
  return {
    date,
    week,
    hour,
    minute,
  };
};
