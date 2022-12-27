<template>

  <div id="chart">
    <apexchart
        :height="height + 'px'"
        type="bar"
        :options="chartOptions"
        :series="seriesData"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import VueApexCharts from "vue3-apexcharts";
import {defineComponent} from "vue";

export default defineComponent({
  name: "BarChart",
  props: {
    title: String,
    height: Number,
    categories: {type: Array<string>},
    seriesData: {type: Array<any>},
    showToolbar: {type: Boolean, default: false},
    showYaxisLabels: {type: Boolean, default: false},
    flipAxis: {type: Boolean, default: false},
    maxValue: {type: Number, default: 10},
    minValue: {type: Number, default: 0},
  },
  components: {
    apexchart: VueApexCharts,
  },
  data(props) {
    //TODO replace with capacitor logic?
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    const theme = darkThemeMq.matches ? 'dark' : 'light'
    return {
      chartOptions: {
        theme: {
          mode: theme,
        },
        colors: ['#eec292', '#1ba07d', '#19383a'],
        chart: {
          height: this.height,
          type: 'bar',
          background: 'transparent',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            horizontal: this.flipAxis,
            dataLabels: {
              position: 'top',
            },
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#a8a8a8"]
          },
          formatter: (value: any) => {
            return Math.round((value + Number.EPSILON) * 100) / 100
          },
        },
        tooltip: {
          fillSeriesColor: true,
        },
        xaxis: {
          categories: this.categories,
          position: 'bottom',
          tooltip: {
            enabled: false,
          }
        },
        yaxis: {
          showForNullSeries: true,
          show: this.showYaxisLabels,
          labels: {
            show: true,
            formatter: (value: any) => {
              return Math.round((value + Number.EPSILON) * 100) / 100
            },
          },
        },
        title: {
          text: this.title,
          floating: true,
          offsetY: -5,
          align: 'center',
        },
        legend: {
          show: true,
          markers: {
            width: 18,
            height: 18,
          }
        },
      }
    }

  },
})
</script>

<style scoped>

</style>