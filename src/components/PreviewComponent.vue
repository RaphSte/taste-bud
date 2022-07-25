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
        <ion-label>{{ category }}</ion-label>
      </ion-item>
    </div>
  </ion-list>
  <ion-text>
    <p>
      Make sure that everything is correct before continuing to the next step.
    </p>
  </ion-text>
<!--  TODO only for debugging. keep button in parent component-->
  <ion-button @click="submit">Submit</ion-button>
</template>

<script lang="ts">
import {IonItem, IonText, IonList, IonLabel} from "@ionic/vue";
import {TastingSessionConfigurationModel} from "@/model/TastingSessionConfiguration";
import {createTastingSession} from "@/controller/TastingSession";


export default {
  name: "PreviewComponent",
  components: {IonItem, IonText, IonList, IonLabel},
  props: {
    categories: [],
    sessionName: String,
  },
  methods: {
    submit(){
      let sessionConfig: TastingSessionConfigurationModel = {
        sessionKey: "this.sessionName",
        creatorId: "asd",
        categories: ['a','b','c','d']
      }
      createTastingSession(sessionConfig);
    },
  }

}
</script>

<style scoped>

</style>