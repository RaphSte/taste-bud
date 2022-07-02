<template>

  <div id="chart">
    <apexchart
        height="350"
        type="radar"
        :options="chartOptions"
        :series="series"
    ></apexchart>
  </div>

</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "SpiderDiagram",
  props: {
    categories: [],
    seriesData: [],
  },
  el: '#app',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {

      series: this.seriesData,
      chartOptions: {
        chart: {
          height: 350,
          type: 'radar',
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1
          }
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

}
</script>

<style scoped>

</style>