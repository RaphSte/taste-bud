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
          <p>Select the item, you'd like to taste!</p>
        </ion-text>
      </ion-item>
      <div v-for="(item, index) in tastingItems" :key="index">
        <ion-item @click="$router.push({ path: `/session/tasting-items/${item}/` })">
          <ion-icon v-if="!tastedItems.get(item)" :icon="checkmarkSharp"/>
          <ion-icon v-if="tastedItems.get(item)" color="success" :icon="checkmarkDoneSharp"/>
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
import {extractTastingItemNamesFromObject, getTastedItemsFromStore} from "@/util/Utils";
import {useSessionRefresh} from "@/composables/useSessionRefresh";
import {checkmarkDoneSharp, checkmarkSharp, chevronForward,} from 'ionicons/icons';

export default defineComponent({
  name: "TastingItemSelection",
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

    const handleRefresh = async (event: CustomEvent) => {
      await refreshSession();
      event.detail.complete();
    };

    return {tastingItems, tastedItems, handleRefresh}
  },
  data() {
    return {
      chevronForward,
      checkmarkSharp,
      checkmarkDoneSharp,
    }
  }
})
</script>

<style scoped>

</style>