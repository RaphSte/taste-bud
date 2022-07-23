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
        <div class="category-input-handler">
          <category-input-handler
              :categories="categories"
              @category-removed="handleCategoryRemoved"
              @category-added="handleCategoryAdded"
              @category-rename="handleCategoryRename"
          />
        </div>
        <p>{{ categories }}</p>
        <p>{{ series }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SpiderDiagram from "@/components/SpiderDiagram.vue";
import CategoryInputHandler from "@/components/CategoryInputHandler.vue";


export default defineComponent({
  name: "CategorySetup",
  components: {SpiderDiagram, CategoryInputHandler},
  data() {
    return {
      rerenderTimer: 0,
      spiderDiagramUpdate: 0, //neat trick to make the diagram update when this key changes
      categories: ['cat0', 'cat1', 'cat2'],
      series: [{
        name: 'Series 1',
        data: [5, 6, 7],
      }],
    }
  },
  methods: {
    handleCategoryRemoved(index: number) {
      this.categories.splice(index, 1);
      this.series[0].data.splice(index, 1);
    },
    handleCategoryAdded() {
      this.categories.push('');
      this.series[0].data.push(Math.floor(Math.random() * 11)) //random number between 0 and 10 for each new category
    },
    handleCategoryRename(event: any) {
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
.category-input-handler {
  overflow-y: scroll;
}
</style>