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
      <div v-for="(item, index) in tastingItems" :key="index">
        <ion-item @click="$router.push({ path: `/session/evaluation/${item}` })">
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
import {defineComponent} from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {IonContent, IonIcon, IonItem, IonLabel, IonPage, IonText,} from "@ionic/vue";
import {useTastingSessionStore} from "@/store/tastingSessionStore";
import {extractTastingItemNamesFromObject, getTastedItemsFromStore} from "@/util/Utils";
import {TastingSession} from "@/types/TastingSessionConfiguration";
import {checkmarkDoneSharp, checkmarkSharp, chevronForward,} from 'ionicons/icons';

export default defineComponent({
  name: 'EvaluationItemSelection',
  components: {HeaderComponent, IonPage, IonText, IonItem, IonLabel, IonContent, IonIcon},
  props: {},
  setup() {
    const tastingSessionStore = useTastingSessionStore();

    const tastingSession: TastingSession = tastingSessionStore.tastingSession
    const tastingItems: string[] = extractTastingItemNamesFromObject(tastingSession);
    const tastedItems: Map<string, any> = getTastedItemsFromStore();

    return {tastingItems, tastedItems}
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