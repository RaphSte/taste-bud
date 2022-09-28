<template>
  <ion-page>
    <header-component
        :title="'Item Comparison'"
        :rightEdgeIcon="showSettings ? close: ellipsisVertical"
        @custom-button-pressed="toggleShowSettings"
    />

    <div class="settings-wrapper" :style="showSettingsForeground? 'z-index: 1 ': 'z-index: 0' ">
      <transition name="slide-down">
        <div v-if="showSettings" class="settings-container">
          <ion-item>
            <ion-label>Show y-axis data labels</ion-label>
            <ion-toggle
                slot="start"
                color="primary"
                :checked="showYaxisLabels"
                @ionChange="toggleYAxisDataLabelVisibilityAndRerender"
            />
          </ion-item>
<!--          TODO implement-->
<!--          <ion-item>-->
<!--            <ion-label>Include Non-Rated Items</ion-label>-->
<!--            <ion-toggle slot="start"-->
<!--                        color="primary"-->
<!--                        :checked="includeNonRatedItems"-->
<!--                        @ionChange="includeNonRatedItemsAndRerender">-->
<!--            </ion-toggle>-->
<!--          </ion-item>-->
          <ion-item>
            <ion-label>Swtich Diagram Type</ion-label>
            <ion-toggle slot="start"
                        color="primary"
                        :checked="switchDiagramType"
                        @ionChange="toggleDiagramTypeAndRerender">
            </ion-toggle>
            <ion-button color="dark" fill="clear" class="close-menu-button" @click="toggleShowSettings">
              <ion-icon :icon="chevronUp" color="dark" class="close-menu-icon"/>
            </ion-button>
          </ion-item>
        </div>

      </transition>
    </div>


    <ion-content>

      <ion-content>
        <h1 class="ion-text-center">Scores</h1>
        <bar-chart
            :key="diagramUpdate"
            title="Consolidated scores"
            :height="500"
            :categories="scoreCategories"
            :series-data="scoreSeriesData"
            :showYaxisLabels="showYaxisLabels"
            :flipAxis="switchDiagramType"
        />
      </ion-content>
      <!--     TODO: put everything inside slider and add spider diagrams for all items on the second slide-->
      <!--      <swiper class="slide-container" :modules="modules" :pagination="true" :navigation="true">-->
      <!--        <swiper-slide>-->
      <!--          <ion-content>-->
      <!--            <h1>Scores</h1>-->
      <!--            <bar-chart-->
      <!--                :key="diagramUpdate"-->
      <!--                title="Consolidated scores"-->
      <!--                :height="500"-->
      <!--                :categories="scoreCategories"-->
      <!--                :series-data="scoreSeriesData"-->
      <!--            />-->
      <!--          </ion-content>-->
      <!--        </swiper-slide>-->
      <!--        <swiper-slide>-->
      <!--          <ion-content>-->
      <!--            <h1>Median</h1>-->
      <!--            &lt;!&ndash;            <spider-diagram&ndash;&gt;-->
      <!--            &lt;!&ndash;                :key="diagramUpdate"&ndash;&gt;-->
      <!--            &lt;!&ndash;                :height="400"&ndash;&gt;-->
      <!--            &lt;!&ndash;                :categories="categoriesRef"&ndash;&gt;-->
      <!--            &lt;!&ndash;                :series-data="medianRatingSeries"&ndash;&gt;-->
      <!--            &lt;!&ndash;                :show-data-labels="showDataLabels"&ndash;&gt;-->
      <!--            &lt;!&ndash;                :show-yaxis-labels="showYAxisDataLabels"&ndash;&gt;-->
      <!--            &lt;!&ndash;            />&ndash;&gt;-->
      <!--          </ion-content>-->
      <!--        </swiper-slide>-->
      <!--      </swiper>-->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {chevronBack, chevronForward, chevronUp, close, ellipsisVertical, settings} from 'ionicons/icons';

import {IonButton, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonToggle} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import SpiderDiagram from "@/components/SpiderDiagram.vue";

import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {Navigation, Pagination} from "swiper";
import BarChart from "@/components/BarChart.vue";
import {calculateAverage, calculateMedian, getTastingItemsFromStore, getTastingScoresFor} from "@/util/Utils";
import {DiagramSeriesEntry} from "@/types/DiagramTypes";


export default defineComponent({
  name: "CombinedEvaluationItems",
  components: {
    BarChart,
    // eslint-disable-next-line vue/no-unused-components
    Swiper,
    // eslint-disable-next-line vue/no-unused-components
    SwiperSlide,
    // eslint-disable-next-line vue/no-unused-components
    SpiderDiagram,
    HeaderComponent, IonPage, IonContent, IonLabel, IonToggle, IonItem, IonButton, IonIcon,
  },
  props: {},
  setup() {
    const data: number[] = []
    const averageRatings: number[] = [];
    const medianRatings: number[] = [];

    const scoreSeriesData = [{
      name: 'Raw Score',
      data: data
    }]

    const averageRatingDataObject: DiagramSeriesEntry = {
      name: "Average",
      data: [],
    };

    const medianRatingDataObject: DiagramSeriesEntry = {
      name: "Median",
      data: [],
    }


    const scoreCategories: string[] = [];

    const tastingItems = getTastingItemsFromStore();

    tastingItems.forEach(item => {
      const tastingScores: number[] = getTastingScoresFor(item.tastingItemName);
      const sum: number = tastingScores.reduce((pv: number, cv: number) => pv + cv, 0);
      averageRatings.push(calculateAverage(tastingScores))
      medianRatings.push(calculateMedian(tastingScores))
      scoreSeriesData[0].data.push(sum)
      scoreCategories.push(item.tastingItemName)
    })

    averageRatingDataObject.data = averageRatings
    medianRatingDataObject.data = medianRatings
    scoreSeriesData.push(averageRatingDataObject)
    scoreSeriesData.push(medianRatingDataObject)

    return {
      scoreCategories,
      scoreSeriesData,
      modules: [Pagination, Navigation],
    }
  },
  data() {
    return {
      chevronBack,
      chevronForward,
      chevronUp,
      settings,
      ellipsisVertical,
      close,
      showSettings: false,
      showSettingsForeground: false,
      diagramUpdate: 0,
      showYaxisLabels: true,
      switchDiagramType: false,
      includeNonRatedItems: false,
    };
  },
  created() {
    setTimeout(() => { //hack to force diagram to rerender after page load.
      this.diagramUpdate = this.diagramUpdate + 1;
    }, 100);
  },
  methods: {
    toggleShowSettings() {
      this.showSettings = !this.showSettings;
      //change z-index style to let leaving animation play out
      if (this.showSettings) {
        setTimeout(() => {
          this.showSettingsForeground = this.showSettings;
        }, 250)
      }
    },
    toggleYAxisDataLabelVisibilityAndRerender() {
      this.showYaxisLabels = !this.showYaxisLabels;
      this.diagramUpdate = this.diagramUpdate + 1;
    },
    toggleDiagramTypeAndRerender() {
      this.switchDiagramType = !this.switchDiagramType;
      this.diagramUpdate = this.diagramUpdate + 1;
    },
    includeNonRatedItemsAndRerender() {
      this.includeNonRatedItems = !this.includeNonRatedItems;
      //TODO
    },
  },
});
</script>

<style scoped>

.slide-container {
  height: 95%;
}

.close-menu-icon {
  font-size: x-large;
  margin: auto;
}

.close-menu-button {
  position: absolute;
  right: 0;
  padding-right: 9px;
}

.settings-container {
  width: 100%;
}

.settings-wrapper {
  position: sticky;
  z-index: 1;
  width: 100%;
  margin-bottom: -200px;
  height: 200px;
}

</style>