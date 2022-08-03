<template>
  <ion-page class="ion-margin-horizontal">
    <ion-item>
      <ion-text class="ion-text-center">
        <h1>Join a Tasting Session</h1>
        <ion-button color="primary" expand="block" router-link="/join">Join Tasting Session</ion-button>
      </ion-text>
    </ion-item>
    <ion-item text-center>
      <ion-text class="ion-text-center">
        <h1>Prepare a tasting session</h1>
        <ion-button color="tertiary" expand="block" router-link="/config">Prepare Tasting Session</ion-button>
      </ion-text>
    </ion-item>
    <ion-item text-center>
      <ion-text class="ion-text-center">
        <h1>Add Items to be Tasted</h1>
        <ion-button color="tertiary" expand="block" router-link="/config/tasting-items">Prepare Tasting Session</ion-button>
      </ion-text>
    </ion-item>

  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonButton, IonPage, IonText, IonItem} from '@ionic/vue';


export default defineComponent({
  name: "HomeScreen",
  components: {IonButton, IonPage, IonText, IonItem},
})
</script>

<style scoped>

ion-text {
  width: 100%;
}

</style>