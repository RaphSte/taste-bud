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
import {getColors} from "@/util/Color";

export default defineComponent({
  name: "SpiderDiagram",
  props: {
    title: String,
    height: Number,
    categories: {type: Array<string>},
    seriesData: {type: Array<any>},
    showToolbar: {type: Boolean, default: false},
    showDataLabels: {type: Boolean, default: false},
    showYaxisLabels: {type: Boolean, default: false},
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
    const colors = getColors()

    return {
      chartOptions: {
        theme: {
          mode: theme,
        },
        chart: {
          height: this.height,
          type: 'radar',
          background: 'transparent',
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
        colors: [colors.primary, colors.success, colors.warning],
        fill: {
          opacity: 0.2,
        },
        markers: {
          size: 0
        },
        xaxis: {
          categories: this.categories
        },
        yaxis: {
          showForNullSeries: true,
          show: this.showYaxisLabels,
          min: this.minValue,
          max: this.maxValue,
          labels: {
            show: true,
            offsetX: -10,
            style: {
              fontSize: '14px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 'bold',

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
        legend: {
          show: true,
          markers: {
            width: 16,
            height: 16,
          }
        },
      },
      noData: {
        text: 'no data',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: '14px',
        }
      }
    }

  },
})
</script>

<style scoped>


#chart {
  background: transparent;
}

</style>