<template>
  <ion-page>
    <header-component
        :title="'Evaluation: ' + evaluationItemName"
    />
    <ion-content>
      <swiper class="slide-container" :modules="modules" :autoplay="true" :keyboard="true" :pagination="true"
              :scrollbar="true" :zoom="true">


        <swiper-slide>
          <ion-content>
            <h1>Ratings</h1>
            <spider-diagram
                :height="400"
                :categories="categoriesRef"
                :series-data="seriesRef"
                :key="spiderDiagramUpdateRef"
                class="spider-diagram"
            />
          </ion-content>
        </swiper-slide>
        <swiper-slide>
          <ion-content>
            <h1>Your Rating</h1>
            <spider-diagram
                :height="400"
                :categories="categoriesRef"
                :series-data="seriesRef"
                :key="spiderDiagramUpdateRef"
                class="spider-diagram"
            />
          </ion-content>
        </swiper-slide>
        <swiper-slide>
          <ion-content>
            <h1>Average</h1>
            <spider-diagram
                :height="400"
                :categories="categoriesRef"
                :series-data="seriesRef"
                :key="spiderDiagramUpdateRef"
                class="spider-diagram"
            />
          </ion-content>
        </swiper-slide>
        <swiper-slide>
          <ion-content>
            <h1>Median</h1>
            <spider-diagram
                :height="400"
                :categories="categoriesRef"
                :series-data="seriesRef"
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
import {chevronBack, chevronForward} from 'ionicons/icons';

import {getTastingSessionFromPreferences} from "@/controller/LocalStorage";

import {IonContent, IonPage,} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import SpiderDiagram from "@/components/SpiderDiagram.vue";
import {SpiderDiagramSeriesEntry} from "@/types/DiagramTypes";
import {getRatingMapForItemFromStore, getConsolidatedRatings, calculateAverage, calculateMedian} from "@/util/Utils";
import {TasteRating} from "@/types/TastingSessionConfiguration";

import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import {Autoplay, Keyboard, Pagination, Scrollbar, Zoom} from "swiper";


export default defineComponent({
  name: "EvaluationScreen",
  components: {
    Swiper,
    SwiperSlide,
    SpiderDiagram,
    HeaderComponent, IonPage, IonContent,
  },
  props: {
    evaluationItemName: {type: String, required: true},
  },
  setup(props) {
    const spiderDiagramUpdateRef = ref(0);
    const setSpiderDiagramUpdateRef = (state: number) => spiderDiagramUpdateRef.value = state;


    const dataArray: number[] = [];
    const seriesRef = ref([{
      name: 'User Rating',
      data: dataArray,
    }]);
    const setSeriesRef = (state: SpiderDiagramSeriesEntry[]) => seriesRef.value = state;
    const getSeriesValueAtIndex = (index: number): number => seriesRef.value[0].data[index]


    let categories: string[] = [];
    const categoriesRef = ref(categories);
    const setCategoriesRef = (state: string[]) => categoriesRef.value = state;


    const ratingMap = getRatingMapForItemFromStore(props.evaluationItemName);
    ratingMap.forEach((value: TasteRating, key: string) => {
      categoriesRef.value.push(key);
      seriesRef.value[0].data.push(value.rating);
    });

    const consolidatedRatings = getConsolidatedRatings(props.evaluationItemName);


    seriesRef.value.push({
      name: "average",
      data: []
    })
    seriesRef.value.push({
      name: "median",
      data: []
    })

    categoriesRef.value.forEach((v: string) => {
      seriesRef.value[1].data.push(calculateAverage(consolidatedRatings[v]))
      seriesRef.value[2].data.push(calculateMedian(consolidatedRatings[v]))
    })


    return {
      seriesRef,
      setSeriesRef,
      categoriesRef,
      setCategoriesRef,
      spiderDiagramUpdateRef,
      setSpiderDiagramUpdateRef,
      getSeriesValueAtIndex,
      ratingMap,
      modules: [Autoplay, Keyboard, Pagination, Scrollbar, Zoom],

    }
  },
  data() {

    let sliderValue = 0;

    //TODO this seems a bit too complicated. => check if there is a better way to set the initial slider value
    if (this.ratingMap instanceof Map && this.ratingMap.size > 0) { //non-necessary check, but typescript won't compie without it for some reason
      sliderValue = this.ratingMap.entries().next().value[1].rating;
    }

    return {

      chevronBack,
      chevronForward,
    };
  },
  methods: {},
});
</script>

<style scoped>

.slide-container {
  height: 95%;
}

.spider-diagram {
  /*margin-bottom: -40px;*/
  /*margin-top: -15px;*/
}

</style>