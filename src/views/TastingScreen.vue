<template>
  <ion-page>
    <header-component
        :title="'Rating: ' + tastingItemName"
    />
    <ion-content>
      <spider-diagram
          :height="250"
          :categories="categoriesRef"
          :series-data="seriesRef"
          :key="spiderDiagramUpdateRef"
          class="spider-diagram"
      />
      <Transition :name="transitionEnabled? animationType: Animation.NoAnimation">
        <div v-if="!transitioning">
          <ion-item v-if="currentCategoryIndex !== categoriesRef.length" class="ion-padding-bottom">
            <ion-text class="ion-text-center">
              <h1>{{ categoriesRef[currentCategoryIndex] }}-ness</h1>
              <p>
                {{
                  'How ' + this.currentTastingCategoryName + ' is ' + tastingItemName + ' for you? Go ahead and rate it!'
                }}
              </p>
            </ion-text>
          </ion-item>

          <div class="input-navigation-wrapper">
            <ion-icon class="navigation-icon" color="medium" :icon="chevronBack"
                      @click="goToCategoryIndexAndDetermineAnimation(currentCategoryIndex -1 )"></ion-icon>

            <div v-if="currentCategoryIndex !== categoriesRef.length">
              <input-component
                  :key="sliderValue"
                  class="rating-input"
                  placeHolder="Your Score"
                  :input-value="String(sliderValue) "
                  :clear-input="false"
                  :icon="send"
                  icon-color="primary"
                  inputMode="numeric"
                  :debounceTime="700"
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
            <ion-item v-if="currentCategoryIndex === categoriesRef.length" class="ion-padding-bottom">
              <ion-text class="ion-text-center">
                <h2>Wrap up</h2>
                <p>
                  This is your rating for {{ tastingItemName }}. If everything is correct you can go ahead and submit your
                  rating.
                </p>
              </ion-text>
            </ion-item>


            <ion-icon
                v-if="currentCategoryIndex !== categoriesRef.length"
                class="navigation-icon" color="medium" :icon="chevronForward"
                @click="saveScoreAndProceed(inputValueRef)"/>
          </div>

        </div>
      </Transition>
    </ion-content>
    <ion-footer
        collapse="fade"
    >
      <ion-button
          v-if="currentCategoryIndex !== categoriesRef.length"
          expand="block"
          @click="saveScoreAndProceed(inputValueRef)"
          class="button-primary"
      >
        Next
      </ion-button>
      <ion-button
          v-if="currentCategoryIndex === categoriesRef.length"
          expand="block"
          @click="submitRating()"
          class="button-primary"
      >
        Submit
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
import {
  getRatingMapForItemFromStore,
  saveItemRatingToStore,
  submitRatingFromStoreToFirestore,
  tasteRatingExistsFor
} from "@/util/Utils";
import {TasteRating} from "@/types/TastingSessionConfiguration";

export default defineComponent({
  name: "TastingScreen",
  components: {
    InputComponent,
    SpiderDiagram,
    HeaderComponent, IonPage, IonButton, IonContent, IonFooter, IonItem, IonText, IonIcon,
    "vue3-slider": slider,
  },
  props: {
    tastingItemName: {type: String, required: true},
  },
  setup(props) {
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
    const getSeriesValueAtIndex = (index: number): number => seriesRef.value[0].data[index]


    let categories: string[] = [];
    const categoriesRef = ref(categories);
    const setCategoriesRef = (state: string[]) => categoriesRef.value = state;


    const ratingMap = getRatingMapForItemFromStore(props.tastingItemName);
    ratingMap.forEach((value: TasteRating, key: string) => {
      categoriesRef.value.push(key);
      seriesRef.value[0].data.push(value.rating);
    });

    //TODO do this somewhere else: save and load categories from store, as well as a flag if completed or not
    if (ratingMap.size === 0) {
      getTastingSessionFromPreferences().then((tastingSession) => {
        setCategoriesRef(tastingSession.config.categories);
        categoriesRef.value.forEach(() => seriesRef.value[0].data.push(0));
        spiderDiagramUpdateRef.value++;
      }).catch((err) => {
        console.log(err);
        //TODO error handling
      })
    }

    return {
      seriesRef,
      setSeriesRef,
      categoriesRef,
      setCategoriesRef,
      spiderDiagramUpdateRef,
      setSpiderDiagramUpdateRef,
      setSeriesValueAtIndex,
      getSeriesValueAtIndex,
      inputValueRef,
      setInputValueRef,
      ratingMap,
    }
  },
  data() {

    let sliderValue = 0;

    //TODO this seems a bit too complicated. => check if there is a better way to set the initial slider value
    if (this.ratingMap instanceof Map && this.ratingMap.size > 0) { //non-necessary check, but typescript won't compie without it for some reason
      sliderValue = this.ratingMap.entries().next().value[1].rating;
    }

    return {
      send,
      chevronBack,
      chevronForward,
      previousCategoryIndex: -1,
      currentCategoryIndex: 0,
      rerenderTimer: 0,
      transitionEnabled: true,
      transitioning: false,
      sliderValue,
      animationType: Animation.NoAnimation,
      scoreValueChanged: false,
    };
  },
  computed: {
    currentTastingCategoryName() {
      return this.categoriesRef[this.currentCategoryIndex]
    }
  },
  methods: {
    handleScoreInput(score: number) {
      this.scoreValueChanged = true;
      score = Number(score); //workaround to ensure type safety. not sure why the incoming value is treated as string.
      this.setInputValueRef(score)
      this.setSeriesValueAtIndex(this.currentCategoryIndex, score)
      this.sliderValue = score;
    },
    saveScoreAndProceed(score: number) {

      //add rating when not existent for a score of 0
      if (this.scoreValueChanged || (!tasteRatingExistsFor(this.tastingItemName, this.currentTastingCategoryName)) && score == 0) {
        this.setInputValueRef(score)
        this.setSeriesValueAtIndex(this.currentCategoryIndex, score)

        saveItemRatingToStore(this.tastingItemName, this.currentTastingCategoryName, {
          category: this.currentTastingCategoryName,
          rating: this.getSeriesValueAtIndex(this.currentCategoryIndex),
          ratedBy: 'user',
        });
      }

      this.goToCategoryIndexAndDetermineAnimation(this.currentCategoryIndex + 1);
      this.setSliderToValue(this.currentCategoryIndex);
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
      this.setSliderToValue(this.currentCategoryIndex);
      this.scoreValueChanged = false;
    },
    playTransitionWithAnimation(animation: Animation, animationTime = 200) {
      this.animationType = animation;

      this.transitioning = true;
      setTimeout(() => {
        this.transitioning = false;
      }, animationTime);
    },
    setSliderToValue(value: number) {
      this.sliderValue = this.getSeriesValueAtIndex(value)
    },
    submitRating() {
      console.log("submitting...")
      submitRatingFromStoreToFirestore(this.tastingItemName).then(() => {
        //TODO loading indicator
        //TODO show success msg to user
        console.log("submitted rating successfully")
        this.$router.go(-1);
      }).catch((e) => {
        //TODO error handling
        console.log("error while submitting rating: ", e)
      });
    }
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

.spider-diagram {
  margin-bottom: -40px;
  margin-top: -15px;
}

</style>