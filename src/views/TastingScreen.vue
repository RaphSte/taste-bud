<template>
  <ion-page>
    <header-component
        :title="'Rating: ' + currentTastingItemName"
    />
    <ion-content>
      <spider-diagram
          title="Preview"
          :height="250"
          :categories="categoriesRef"
          :series-data="seriesRef"
          :key="spiderDiagramUpdateRef"
      />
      <Transition :name="getAnimationType()">
        <div v-if="!transitioning">
          <ion-item class="ion-padding-bottom">
            <ion-text class="ion-text-center">
              <h1>{{ categoriesRef[currentCategoryIndex] }}-ness</h1>
              <p>
                {{
                  'How ' + categoriesRef[currentCategoryIndex] + ' is ' + currentTastingItemName + ' for you? Go ahead and rate it!'
                }}
              </p>
            </ion-text>
          </ion-item>
          <input-component
              class="element-spacing"
              placeHolder="Your Score"
              input-value="0"
              :clear-input="false"
              :icon="send"
              icon-color="primary"
              inputMode="numeric"
              @input-registered="handleScoreInput"
              @custom-icon-clicked="saveScoreAndProceed"
          />
        </div>
      </Transition>
    </ion-content>
    <ion-footer
        collapse="fade"
    >
      <ion-button
          expand="block"
          @click="saveScoreAndProceed(inputValueRef)"
          class="button-primary"
      >
        Next
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {send} from 'ionicons/icons';

import {getTastingSessionFromPreferences} from "@/controller/LocalStorage";

import {IonButton, IonContent, IonFooter, IonItem, IonPage, IonText} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import SpiderDiagram from "@/components/SpiderDiagram.vue";
import {SpiderDiagramSeriesEntry} from "@/types/DiagramTypes";
import InputComponent from "@/components/InputComponent.vue";


export default defineComponent({
  name: "TastingScreen",
  components: {
    InputComponent,
    SpiderDiagram,
    HeaderComponent, IonPage, IonButton, IonContent, IonFooter, IonItem, IonText
  },
  setup() {
    const spiderDiagramUpdateRef = ref(0);
    const setSpiderDiagramUpdateRef = (state: number) => spiderDiagramUpdateRef.value = state;

    const inputValueRef = ref(0);
    const setInputValueRef = (state: number) => inputValueRef.value = state;


    const dataArray: number[] = [];
    const seriesRef = ref([{
      name: 'Series 1',
      data: dataArray,
    }]);
    const setSeriesRef = (state: SpiderDiagramSeriesEntry[]) => seriesRef.value = state;
    const setSeriesValueAtIndex = (index: number, value: number) => seriesRef.value[0].data[index] = value;


    let categories: string[] = [];
    const categoriesRef = ref(categories);
    const setCategoriesRef = (state: string[]) => categoriesRef.value = state;


    getTastingSessionFromPreferences().then((tastingSession) => {
      setCategoriesRef(tastingSession.config.categories);
      categoriesRef.value.forEach(() => seriesRef.value[0].data.push(0));
      spiderDiagramUpdateRef.value++;
    }).catch((err) => {
      console.log(err);
      //TODO error handling
    })

    return {
      seriesRef,
      setSeriesRef,
      categoriesRef,
      setCategoriesRef,
      spiderDiagramUpdateRef,
      setSpiderDiagramUpdateRef,
      setSeriesValueAtIndex,
      inputValueRef,
      setInputValueRef,
    }
  },
  data() {
    let currentTastingItem = 0;
    let currentTastingItemName = 'My Favourite Beer';
    //TODO! implement logic! maybe a list to choose the tasting item

    return {
      send,
      previousCategoryIndex: -1,
      currentCategoryIndex: 0,
      rerenderTimer: 0,
      currentTastingItem,
      currentTastingItemName,
      transitionEnabled: true,
      transitioning: false
    };
  },
  methods: {
    handleScoreInput(score: number) {
      this.setInputValueRef(score)
      // clearTimeout(this.rerenderTimer)
      // this.rerenderTimer = setTimeout(() => {
      //   this.setSeriesValueAtIndex(this.currentCategoryIndex, score)
      // }, 600);

    },
    saveScoreAndProceed(score: number) {
      this.setInputValueRef(score)
      this.setSeriesValueAtIndex(this.currentCategoryIndex, score)
      this.currentCategoryIndex++
      this.transitioning = true;
      setTimeout(() => {
        this.transitioning = false;
      }, 200);
    },
    getAnimationType(): string {
      if (this.transitionEnabled) {
        return this.previousCategoryIndex < this.currentCategoryIndex ? 'slide-left' : 'slide-right';
      }
      return 'slide-right';
      //return "no-animation";
    },
  },
});
</script>

<style scoped>


</style>