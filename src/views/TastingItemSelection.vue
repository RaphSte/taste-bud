<template>
  <ion-page>
    <header-component
        title="Selection"
    />
    <ion-content>
      <ion-item class="ion-padding-bottom">
        <ion-text class="ion-text-center">
          <p>Select the item, you'd like to taste!</p>
        </ion-text>
      </ion-item>
      <div v-for="(item, index) in tastingItems" :key="index">
        <ion-item @click="$router.push({ path: `/session/tasting-items/${item}` })">
          <ion-label class="ion-text-center">
            {{ item }}
          </ion-label>
          <ion-icon :icon="chevronForward"/>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {IonItem, IonLabel, IonPage, IonText, IonContent, IonIcon,} from "@ionic/vue";
import {useTastingSessionStore} from "@/util/tastingSessionStore";
import {extractTastingItemNamesFromObject} from "@/util/Utils";
import {TastingSession} from "@/types/TastingSessionConfiguration";
import {chevronForward} from 'ionicons/icons';

export default defineComponent({
  name: "TastingItemSelection",
  components: {HeaderComponent, IonPage, IonText, IonItem, IonLabel, IonContent, IonIcon},
  props: {},
  setup() {
    const tastingSessionStore = useTastingSessionStore();
    //const session = storeToRefs(tastingSessionStore);
    const tastingSession = tastingSessionStore.tastingSession

    let tastingItems: string[] = [];
    console.log("session", tastingSession);
    if (tastingSession as TastingSession) {
      tastingItems = extractTastingItemNamesFromObject(tastingSession as TastingSession)
    }
    return {tastingItems}
  },
  data() {
    return {
      chevronForward,
    }
  }
})
</script>

<style scoped>

</style>