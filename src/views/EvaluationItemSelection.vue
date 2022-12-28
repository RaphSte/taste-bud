<template>
  <ion-page>
    <header-component
        title="Selection"
    />
    <ion-content>
      <ion-item class="ion-padding-bottom">
        <ion-text class="ion-text-center">
          <p>Choose the item of which you'd like to view the evaluation</p>
        </ion-text>
      </ion-item>

      <ion-item @click="$router.push({ path: `/session/evaluation/all-items/` })">
        <ion-icon :icon="list" color="secondary"/>
        <ion-label class="ion-text-center">All Items</ion-label>
        <ion-icon color="primary" :icon="chevronForward"/>
      </ion-item>

      <div v-for="(item, index) in tastingItems" :key="index">
        <ion-item @click="$router.push({ path: `/session/evaluation/${item}/` })">
          <ion-icon :color="tastedItems.get(item) ? 'secondary' : medium"
                    :icon="tastedItems.get(item) ? checkmarkSharp: checkmarkDone "/>

          <ion-icon class="ion-padding-start" :color="getReviewCountFor(item) > 0 ? 'secondary' : medium"
                    :icon="people"/>


          <ion-text class="ion-padding-start">
            {{ getReviewCountFor(item) }}
          </ion-text>

          <ion-icon class="ion-padding-start, ion-padding-end" :color="getStyleBasedOnRating(getAverageFor(item))"
                    :icon="podium"/>
          {{ getAverageFor(item) }}
          <ion-label class="ion-text-center">
            {{ item }}
          </ion-label>
          <ion-icon color="primary" :icon="chevronForward"/>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {IonContent, IonIcon, IonItem, IonLabel, IonPage, IonText,} from "@ionic/vue";
import {useTastingSessionStore} from "@/store/tastingSessionStore";
import {
  extractAverageForItem,
  extractTastingItemNamesFromObject,
  extractTotalTateReviewsForItem,
  getTastedItemsFromStore
} from "@/util/Utils";
import {TastingSession} from "@/types/TastingSessionConfiguration";
import {checkmarkDone, checkmarkSharp, chevronForward, list, people, podium} from 'ionicons/icons';

export default defineComponent({
  name: 'EvaluationItemSelection',
  components: {HeaderComponent, IonPage, IonText, IonItem, IonLabel, IonContent, IonIcon},
  props: {},
  setup() {
    const tastingSessionStore = useTastingSessionStore();

    const tastingSession: TastingSession = tastingSessionStore.tastingSession
    const tastingItems: string[] = extractTastingItemNamesFromObject(tastingSession);
    const tastedItems: Map<string, any> = getTastedItemsFromStore();

    const getReviewCountFor = ((item: string) => extractTotalTateReviewsForItem(tastingSession, item))
    const getAverageFor = ((item: string) => extractAverageForItem(tastingSession, item))

    const getStyleBasedOnRating = ((rating: number) => {
      switch (true) {
        case rating >= 7:
          return "success";
        case rating >= 4:
          return "warning";
        case rating > 0:
          return "danger";
        default:
          return "medium";
      }
    });

    return {tastingItems, tastedItems, getReviewCountFor, getAverageFor, getStyleBasedOnRating}
  },
  data() {
    return {
      chevronForward,
      checkmarkSharp,
      checkmarkDone,
      podium,
      people,
      list,
    }
  }
})
</script>

<style scoped>

</style>