<template>
  <ion-item>
    <ion-text>
      <p>
        Your session name is <b>'{{ sessionName }}'</b>. Your session-setup contains the following
        categories:
      </p>
    </ion-text>
  </ion-item>
  <ion-list>
    <div v-for="(category, index) in categories" :key="index">
      <ion-item>
        <ion-label>{{ index + 1 }}. {{ category }}</ion-label>
      </ion-item>
    </div>
  </ion-list>
  <ion-text>
    <p>
      Make sure that everything is correct before continuing to the next step.
    </p>
  </ion-text>
</template>

<script lang="ts">
import {IonItem, IonText, IonList, IonLabel} from "@ionic/vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: "PreviewComponent",
  components: {IonItem, IonText, IonList, IonLabel},
  props: {
    categories: [],
    sessionName: String,
  },
});
</script>

<style scoped>

</style>