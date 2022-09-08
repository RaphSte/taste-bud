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
    showDataLabels: {type: Boolean, default: false},
    maxValue: {type: Number, default: 10},
    minValue: {type: Number, default: 0},
  },
  components: {
    apexchart: VueApexCharts,
  },
  data(props) {

    const yAxisLabelColors = Array.from({length: this.maxValue - this.minValue + 1}, () => '#a8a8a8');

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
          opacity: 0.2
        },
        markers: {
          size: 0
        },
        xaxis: {
          categories: this.categories
        },
        yaxis: {
          showForNullSeries: true,
          show: true,
          min: this.minValue,
          max: this.maxValue,
          labels: {
            show: true,
            offsetX: -10,
            style: {
              fontSize: '14px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 'bold',
              colors: yAxisLabelColors,
            },
          },
        },
        dataLabels: {
          enabled: this.showDataLabels,
          background: {
            enabled: true,
            borderRadius: 2,
          },
          formatter: (value: any) => {
            return Math.round((value + Number.EPSILON) * 100) / 100
          },
        },
      },
    }

  },
})
</script>

<style scoped>

</style>