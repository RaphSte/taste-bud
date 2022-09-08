<template>
  <ion-page>
    <header-component
        :title="'Evaluation: ' + evaluationItemName"
        :rightEdgeIcon="showSettings ? close: ellipsisVertical"
        @custom-button-pressed="showSettings = !showSettings"
    />


    <!--    TODO animation slide settings down-->
    <div v-if="showSettings">
      <div class="settings-wrapper">
        <ion-item>
          <ion-label>Some more setings...</ion-label>
          <ion-toggle slot="start"
                      color="primary"
                      :checked="showDataLabels"
                      @ionChange="toggleDataLabelVisibilityAndRerender">
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>Show labels</ion-label>
          <ion-toggle slot="start"
                      color="primary"
                      :checked="showDataLabels"
                      @ionChange="toggleDataLabelVisibilityAndRerender">
          </ion-toggle>
          <ion-button color="dark" fill="clear" class="close-menu-button" @click="showSettings = !showSettings">
            <ion-icon :icon="chevronUp" color="dark" class="close-menu-icon"/>
          </ion-button>
        </ion-item>
      </div>
    </div>


    <ion-content>
      <swiper class="slide-container" :modules="modules" :pagination="true">

        <swiper-slide>
          <ion-content>
            <h1>Your Rating</h1>
            <spider-diagram
                :height="400"
                :categories="categoriesRef"
                :series-data="userRatingSeries"
                :show-data-labels="showDataLabels"
                :key="spiderDiagramUpdateRef"
            />
          </ion-content>
        </swiper-slide>
        <swiper-slide>
          <ion-content>
            <h1>Ratings</h1>
            <spider-diagram
                :height="400"
                :categories="categoriesRef"
                :series-data="combinedRatingSeries"
                :show-data-labels="showDataLabels"
                :key="spiderDiagramUpdateRef"
            />
          </ion-content>
        </swiper-slide>
        <swiper-slide>
          <ion-content>
            <h1>Average</h1>
            <spider-diagram
                :height="400"
                :categories="categoriesRef"
                :series-data="averageRatingSeries"
                :show-data-labels="showDataLabels"
                :key="spiderDiagramUpdateRef"
            />
          </ion-content>
        </swiper-slide>
        <swiper-slide>
          <ion-content>
            <h1>Median</h1>
            <spider-diagram
                :height="400"
                :categories="categoriesRef"
                :series-data="medianRatingSeries"
                :show-data-labels="showDataLabels"
                :key="spiderDiagramUpdateRef"
                class="spider-diagram"
            />
          </ion-content>
        </swiper-slide>
      </swiper>


    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {chevronBack, chevronForward, chevronUp, close, ellipsisVertical, settings} from 'ionicons/icons';

import {IonButton, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonToggle} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import SpiderDiagram from "@/components/SpiderDiagram.vue";
import {SpiderDiagramSeriesEntry} from "@/types/DiagramTypes";
import {calculateAverage, calculateMedian, getConsolidatedRatings, getRatingMapForItemFromStore} from "@/util/Utils";
import {TasteRating} from "@/types/TastingSessionConfiguration";

import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import {Pagination} from "swiper";


export default defineComponent({
  name: "EvaluationScreen",
  components: {
    Swiper,
    SwiperSlide,
    SpiderDiagram,
    HeaderComponent, IonPage, IonContent, IonLabel, IonToggle, IonItem, IonButton, IonIcon,
  },
  props: {
    evaluationItemName: {type: String, required: true},
  },
  setup(props) {
    const spiderDiagramUpdateRef = ref(0);
    const setSpiderDiagramUpdateRef = (state: number) => spiderDiagramUpdateRef.value = state;

    const showDataLabels = ref(false);
    const setShowDataLabels = (state: boolean) => showDataLabels.value = state;

    const consolidatedRatings = getConsolidatedRatings(props.evaluationItemName);

    const userRatingDataObject: SpiderDiagramSeriesEntry = {
      name: "User Rating",
      data: [],
    }

    const averageRatingDataObject: SpiderDiagramSeriesEntry = {
      name: "Average",
      data: [],
    };

    const medianRatingDataObject: SpiderDiagramSeriesEntry = {
      name: "Median",
      data: [],
    }


    let categories: string[] = [];
    const categoriesRef = ref(categories);


    const ratingMap = getRatingMapForItemFromStore(props.evaluationItemName);
    ratingMap.forEach((value: TasteRating, key: string) => {
      categoriesRef.value.push(key);
      userRatingDataObject.data.push(value.rating)
    });

    const averageRatings: number[] = [];
    const medianRatings: number[] = [];

    categoriesRef.value.forEach((v: string) => {
      averageRatings.push(calculateAverage(consolidatedRatings[v]));
      medianRatings.push(calculateMedian(consolidatedRatings[v]));
    })
    averageRatingDataObject.data = averageRatings;
    medianRatingDataObject.data = medianRatings;


    const userRatingSeries = ref([
      userRatingDataObject
    ])

    const averageRatingSeries = ref([
      averageRatingDataObject,
    ]);

    const medianRatingSeries = ref([
      medianRatingDataObject,
    ]);

    const combinedRatingSeries = ref([
      userRatingDataObject,
      averageRatingDataObject,
      medianRatingDataObject,
    ]);

    return {
      userRatingSeries,
      averageRatingSeries,
      medianRatingSeries,
      combinedRatingSeries,
      categoriesRef,
      spiderDiagramUpdateRef,
      setSpiderDiagramUpdateRef,
      showDataLabels,
      setShowDataLabels,
      modules: [Pagination],
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
    };
  },
  methods: {
    toggleDataLabelVisibilityAndRerender() {
      this.setShowDataLabels(!this.showDataLabels);
      this.setSpiderDiagramUpdateRef(this.spiderDiagramUpdateRef + 1)
    }

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

.settings-wrapper {
  position: absolute;
  width: 100%;
}

</style>