<template>

  <div id="chart">
    <apexchart
        :height="height + 'px'"
        type="radar"
        :options="chartOptions"
        :series="seriesData"
    ></apexchart>
  </div>

</template>

<script lang="ts">
import VueApexCharts from "vue3-apexcharts";
import {defineComponent} from "vue";

export default defineComponent({
  name: "SpiderDiagram",
  props: {
    title: String,
    height: Number,
    categories: {type: Array<string>},
    seriesData: {type: Array<any>},
    showToolbar: {type: Boolean, default: false},
  },
  components: {
    apexchart: VueApexCharts,
  },
  data(props) {
    return {
      chartOptions: {
        chart: {
          height: this.height,
          type: 'radar',
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1
          },
          toolbar: {
            show: props.showToolbar
          },
        },
        title: {
          text: this.title
        },
        stroke: {
          width: 2
        },
        fill: {
          opacity: 0.1
        },
        markers: {
          size: 0
        },
        xaxis: {
          categories: this.categories
        }
      },
    }

  },
})
</script>

<style scoped>

</style>