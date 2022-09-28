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
    showDataLabels: {type: Boolean, default: false},
    showYaxisLabels: {type: Boolean, default: false},
    maxValue: {type: Number, default: 10},
    minValue: {type: Number, default: 0},
  },
  components: {
    apexchart: VueApexCharts,
  },
  data(props) {

    return {
      chartOptions: {
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },

        xaxis: {
          categories: this.categories,
          position: 'top',
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              }
            }
          },
          tooltip: {
            enabled: true,
          }
        },
        title: {
          text: this.title,
          floating: true,
          offsetY: -5,
          align: 'center',
          style: {
            color: '#444'
          }
        }
      }
    }

  },
})
</script>

<style scoped>

</style>