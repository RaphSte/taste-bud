<template>
  <div class="category-setup">
    <SpiderDiagram
        title="Preview"
        :height="250"
        :categories="categories"
        :series-data="series"
        :key="spiderDiagramUpdate"
    />
    <div class="category-input-handler">
      <!--
      TODO: check if the infinite scroll component can handle the scrolling better: https://ionicframework.com/docs/api/infinite-scroll
      maybe the virtual scroll too: https://ionicframework.com/docs/api/virtual-scroll
      -->
      <category-input-handler
          :categories="categories"
          @category-removed="handleCategoryRemoved"
          @category-added="handleCategoryAdded"
          @category-rename="handleCategoryRename"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SpiderDiagram from "@/components/SpiderDiagram.vue";
import CategoryInputHandler from "@/components/CategoryInputHandler.vue";

export default defineComponent({
  name: "CategorySetup",
  components: {SpiderDiagram, CategoryInputHandler},
  props: {
    savedCategories: {type: Array<string>},
  },
  data() {

    let categories: string[] = [];

    if (this.savedCategories == undefined || this.savedCategories.length === 0) {
      for (let i = 0; i < 3; i++) {
        categories.push(this.getRandomCategoryName());
      }
    } else {
      categories = this.savedCategories;
    }

    let dataArray: number[] = []; //workaround to have a type definition within the object
    let sampleSeries = [{
      name: 'Series 1',
      data: dataArray
    }];

    categories.forEach(() => {
      sampleSeries[0].data.push(Math.floor(Math.random() * 11))
    });

    return {
      rerenderTimer: 0,
      spiderDiagramUpdate: 0, //neat trick to make the diagram update when this key changes
      categories: categories,
      series: sampleSeries,
    }
  },
  methods: {
    handleCategoryRemoved(index: number) {
      this.categories.splice(index, 1);
      this.series[0].data.splice(index, 1);
      this.emitDiagramData();
    },
    handleCategoryAdded(categoryName: string) {
      this.categories.push(categoryName);
      this.series[0].data.push(Math.floor(Math.random() * 11)) //random number between 0 and 10 for each new category
      this.emitDiagramData();
    },
    handleCategoryRename(event: any) {
      this.categories[event.index] = event.name;

      clearTimeout(this.rerenderTimer)
      this.rerenderTimer = setTimeout(() => {
        this.spiderDiagramUpdate++
      }, 600);
      this.emitDiagramData();
    },
    emitDiagramData() {
      this.$emit('diagram-categories-emitted', {categories: this.categories})
    },
    getRandomCategoryName(): string {
      let sampleCategoryNames: string[] = ['sweet', 'salty', 'sour', 'smoky', 'flowery', 'bitter', 'funny', 'hot', 'spicy'];
      return sampleCategoryNames[Math.floor(Math.random() * sampleCategoryNames.length)];
    }
  },

});
</script>
<style scoped>
.category-input-handler {
  overflow-y: scroll;
  max-height: 55%;
}

.category-setup {
  height: 80%;
}

</style>