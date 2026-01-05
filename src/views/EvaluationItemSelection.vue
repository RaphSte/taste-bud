<template>
  <ion-page>
    <header-component
        title="Selection"
    />
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      
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
import {defineComponent, computed} from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {IonContent, IonIcon, IonItem, IonLabel, IonPage, IonText, IonRefresher, IonRefresherContent} from "@ionic/vue";
import {useTastingSessionStore} from "@/store/tastingSessionStore";
import {
  extractAverageForItem,
  extractTastingItemNamesFromObject,
  extractTotalTateReviewsForItem,
  getTastedItemsFromStore
} from "@/util/Utils";
import {useSessionRefresh} from "@/composables/useSessionRefresh";
import {checkmarkDone, checkmarkSharp, chevronForward, list, people, podium} from 'ionicons/icons';

export default defineComponent({
  name: 'EvaluationItemSelection',
  components: {
    HeaderComponent, 
    IonPage, 
    IonText, 
    IonItem, 
    IonLabel, 
    IonContent, 
    IonIcon,
    IonRefresher,
    IonRefresherContent
  },
  props: {},
  setup() {
    const tastingSessionStore = useTastingSessionStore();
    const { refreshSession } = useSessionRefresh();

    const tastingSession = computed(() => tastingSessionStore.tastingSession);
    const tastingItems = computed(() => extractTastingItemNamesFromObject(tastingSession.value));
    const tastedItems = computed(() => getTastedItemsFromStore());

    const getReviewCountFor = (item: string) => extractTotalTateReviewsForItem(tastingSession.value, item);
    
    const getAverageFor = (item: string) => {
      const average = extractAverageForItem(tastingSession.value, item);
      return Math.round(average * 10) / 10; // Round to 1 decimal place
    };

    const getStyleBasedOnRating = (rating: number) => {
      if (rating >= 7) return "success";
      if (rating >= 4) return "warning";
      if (rating > 0) return "danger";
      return "medium";
    };

    const handleRefresh = async (event: CustomEvent) => {
      await refreshSession();
      event.detail.complete();
    };

    return {
      tastingItems, 
      tastedItems, 
      getReviewCountFor, 
      getAverageFor, 
      getStyleBasedOnRating,
      handleRefresh
    };
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