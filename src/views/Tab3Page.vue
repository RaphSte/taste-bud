<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 3</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>
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

<script lang="ts">
import {defineComponent} from 'vue';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent} from '@ionic/vue';
import CategoryInputHandler from "@/components/CategoryInputHandler.vue";
import SpiderDiagram from '@/components/SpiderDiagram.vue';


export default defineComponent({

  name: 'Tab3Page',
  components: {SpiderDiagram, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, CategoryInputHandler},
  data() {
    return {
      rerenderTimer: 0,//intentional undefined
      spiderDiagramUpdate: 0, //neat trick to make the diagram update when this key changes
      categories: ['cat0', 'cat1', 'cat2'],
      series: [{
        name: 'Series 1',
        data: [8, 5, 3, 4, 1, 2],
      }, {
        name: 'Series 2',
        data: [20, 30, 40, 80, 20, 80],
      }, {
        name: 'Series 3',
        data: [44, 76, 78, 13, 43, 10],
      }]
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
