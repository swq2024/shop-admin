<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { getStatistics3Api } from '@/api/home';
import { useResizeObserver } from '@vueuse/core'

const options = [
    {
        text: "近1个月",
        value: "month"
    },
    {
        text: "近1周",
        value: "week"
    },
    {
        text: "近24小时",
        value: "hour"
    }
]
const currentTag = ref("week")

const handleChoose = (type: string) => {
    // 切换选项
    currentTag.value = type
    //
    getEchartData()
}
var myChart: echarts.ECharts | null = null

onMounted(() => {
    const chartDom = document.getElementById("chart")
    if (chartDom) {
        myChart = echarts.init(chartDom)

        getEchartData()
    }

})

// 页面组件被销毁前
onBeforeUnmount(() => {
    // 销毁实例释放资源，避免内存泄漏
    if (myChart) echarts.dispose(myChart)
})

const getEchartData = () => {
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    }
    myChart?.showLoading()
    getStatistics3Api(currentTag.value)
        .then(res => {
            // @ts-ignore
            option.xAxis.data = res.x
            // @ts-ignore
            option.series[0].data = res.y

            myChart?.setOption(option);
        })
        .finally(() => {
            myChart?.hideLoading()
        })
}
// 监听视口大小 useResizeObserver 或者在 window.addEventListener('resize',callback) 中监听
const chartElRef = ref(null)
const text = ref("")

useResizeObserver(chartElRef, (entries) => {
    // 在浏览器宽度改变的时候，始终保持图表宽度是页面的 100%
    myChart?.resize()
    // console.log(entries);

    const entry = entries[0]
    const { width, height } = entry.contentRect
    text.value = `width: ${width}, height: ${height}`
    // console.log(text.value);
})

</script>

<template>
    <el-card shadow="never">
        <!-- card title -->
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm">订单统计</span>
                <div>
                    <el-check-tag v-for="(item, index) in options" :key="index" :checked="currentTag === item.value"
                        @click="handleChoose(item.value)" class="mr-1">
                        {{ item.text }}
                    </el-check-tag>
                </div>
            </div>
        </template>
        <!-- card body -->
        <div id="chart" ref="chartElRef" style="width: 100%; height: 300px;">

        </div>
    </el-card>

</template>



<style scoped></style>
