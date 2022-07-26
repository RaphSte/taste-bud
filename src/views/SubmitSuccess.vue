<template>
  <ion-page>
    <ion-item>
      <ion-text>
        <h1>
          Submitted successful!
        </h1>
        <p>If you want other people to participate in the tasting, share this code with them:</p>
        <p>{{ tastingSessionCode }}</p>
      </ion-text>
    </ion-item>
    <ion-button>Finish</ion-button>
  </ion-page>
</template>

<script lang="ts">
import {IonItem, IonText, IonPage, IonButton} from "@ionic/vue";
import {defineComponent} from "vue";


export default defineComponent({
  name: "SubmitSuccess",
  components: {IonItem, IonText, IonPage, IonButton},
  props: {
    tastingSessionCode: String,
  },
  methods: {},
});
</script>

<style scoped>

</style>