<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="chart">
        <SpiderDiagram
            title="Preview"
            :height="250"
            :categories="categories"
            :series-data="series"
            :key="spiderDiagramUpdate"
        />
        <category-input-handler
            :categories="categories"
            @category-removed="handleCategoryRemoved"
            @category-added="handleCategoryAdded"
            @category-rename="handleCategoryRename"
        />
        <p>{{ categories }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="js">
import {defineComponent} from "vue";
import SpiderDiagram from "@/components/SpiderDiagram";
import CategoryInputHandler from "@/components/CategoryInputHandler";


export default defineComponent({
  name: "CategorySetup",
  components: {SpiderDiagram, CategoryInputHandler},
  data() {
    return {
      rerenderTimer: undefined,//intentional undefined
      spiderDiagramUpdate: 0, //neat trick to make the diagram update when this key changes
      categories: ['cat0', 'cat1', 'cat2'],
      series: [{
        name: 'Series 1',
        data: [5, 6, 7],
      }],
      // series: [{
      //   name: 'Series 1',
      //   data: [8, 5, 3, 4, 1, 2],
      // }, {
      //   name: 'Series 2',
      //   data: [20, 30, 40, 80, 20, 80],
      // }, {
      //   name: 'Series 3',
      //   data: [44, 76, 78, 13, 43, 10],
      // }]
    }
  },
  methods: {
    handleCategoryRemoved() {
      this.categories.pop();
      this.series[0].data.pop()
    },
    handleCategoryAdded() {
      this.categories.push('');
      this.series[0].data.push(Math.floor(Math.random() * 11)) //random number between 0 and 10 for each new category
    },
    handleCategoryRename(event) {
      this.categories[event.index] = event.name;

      clearTimeout(this.rerenderTimer)
      this.rerenderTimer = setTimeout(() => {
        this.spiderDiagramUpdate++
      }, 600);

    },
  },

});
</script>
<style scoped>

</style>