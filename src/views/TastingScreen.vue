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
      <Transition :name="transitionEnabled? animationType: Animation.NoAnimation">
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

          <div class="input-navigation-wrapper">
            <ion-icon class="navigation-icon" color="medium" :icon="chevronBack"
                      @click="goToCategoryIndexAndDetermineAnimation(currentCategoryIndex -1 )"></ion-icon>

            <div>
              <input-component
                  :key="sliderValue"
                  class="rating-input"
                  placeHolder="Your Score"
                  :input-value="String(sliderValue) "
                  :clear-input="false"
                  :icon="send"
                  icon-color="primary"
                  inputMode="numeric"
                  @input-registered="handleScoreInput"
                  @custom-icon-clicked="saveScoreAndProceed"
              />
              <div class="slider-style">
                <vue3-slider
                    v-model="sliderValue"
                    color="#3880ff"
                    track-color="grey"
                    :step="1"
                    :min="0"
                    :max="10"
                    :tooltip="true"
                    :flipTooltip="true"
                    :alwaysShowHandle="true"
                    :handleScale="4"
                    @drag-end="handleScoreInput"
                />
              </div>
            </div>
            <ion-icon class="navigation-icon" color="medium" :icon="chevronForward"
                      @click="goToCategoryIndexAndDetermineAnimation(currentCategoryIndex + 1)"></ion-icon>
          </div>

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
import {chevronBack, chevronForward, send} from 'ionicons/icons';

import {getTastingSessionFromPreferences} from "@/controller/LocalStorage";

import {IonButton, IonContent, IonFooter, IonIcon, IonItem, IonPage, IonText,} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import SpiderDiagram from "@/components/SpiderDiagram.vue";
import {SpiderDiagramSeriesEntry} from "@/types/DiagramTypes";
import InputComponent from "@/components/InputComponent.vue";
import slider from "vue3-slider"
import {Animation} from "@/types/Animation";

export default defineComponent({
  name: "TastingScreen",
  components: {
    InputComponent,
    SpiderDiagram,
    HeaderComponent, IonPage, IonButton, IonContent, IonFooter, IonItem, IonText, IonIcon,
    "vue3-slider": slider,
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
      chevronBack,
      chevronForward,
      previousCategoryIndex: -1,
      currentCategoryIndex: 0,
      rerenderTimer: 0,
      currentTastingItem,
      currentTastingItemName,
      transitionEnabled: true,
      transitioning: false,
      sliderValue: 1,
      animationType: Animation.NoAnimation,
    };
  },
  methods: {
    handleScoreInput(score: number) {
      this.setInputValueRef(score)
      this.setSeriesValueAtIndex(this.currentCategoryIndex, score)
      // clearTimeout(this.rerenderTimer)
      // this.rerenderTimer = setTimeout(() => {
      //   this.setSeriesValueAtIndex(this.currentCategoryIndex, score)
      // }, 600);

    },
    saveScoreAndProceed(score: number) {
      this.setInputValueRef(score)
      this.setSeriesValueAtIndex(this.currentCategoryIndex, score)
      this.goToCategoryIndexAndDetermineAnimation(this.currentCategoryIndex + 1);
      this.resetToDefaultValues();
    },
    goToCategoryIndexAndDetermineAnimation(targetIndex: number) {

      if (targetIndex < 0) {
        this.playTransitionWithAnimation(Animation.SlideLeftNotAllowedShake)
      } else if (targetIndex > this.categoriesRef.length) {
        this.playTransitionWithAnimation(Animation.SlideRightNotAllowedShake)
      } else {
        this.previousCategoryIndex = this.currentCategoryIndex;
        this.currentCategoryIndex = targetIndex
        this.playTransitionWithAnimation(this.previousCategoryIndex < this.currentCategoryIndex ? Animation.SlideLeft : Animation.SlideRight);
      }
      this.resetToDefaultValues();
    },
    playTransitionWithAnimation(animation: Animation, animationTime = 200) {
      this.animationType = animation;

      this.transitioning = true;
      setTimeout(() => {
        this.transitioning = false;
      }, animationTime);
    },
    resetToDefaultValues() {
      this.sliderValue = 1
    },
  },
});
</script>

<style scoped>

.rating-input {
  margin: auto;
  width: 50%;
}

.input-navigation-wrapper {
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: center;
}

.navigation-icon {
  font-size: xx-large;
  margin: auto;
}

.slider-style {
  padding-top: 32px;
  margin-top: 16px;
}

</style>