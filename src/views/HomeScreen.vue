<template>
  <ion-page class="background-image">
    <ion-content>
      <ion-item>
        <ion-text class="ion-text-center">
          <h1>Join a Tasting Session</h1>
          <ion-button color="primary" expand="block" router-link="/session">Join Tasting Session</ion-button>
        </ion-text>
      </ion-item>


      <!--      <ion-item text-center>-->
      <!--        <ion-text class="ion-text-center">-->
      <!--          <h1>Tasting</h1>-->
      <!--          <ion-button color="primary" expand="block" router-link="/tasting/">Join</ion-button>-->
      <!--        </ion-text>-->
      <!--      </ion-item>-->

      <ion-item text-center>
        <ion-text class="ion-text-center">
          <h1>Prepare a tasting session</h1>
          <ion-button color="tertiary" expand="block" router-link="/config/">Prepare Tasting Session</ion-button>
        </ion-text>
      </ion-item>


      <!--      <ion-item text-center>-->
      <!--        <ion-text class="ion-text-center">-->
      <!--          <h1>Add Items to be Tasted</h1>-->
      <!--          <ion-button color="tertiary" expand="block" router-link="/config/tasting-items/">Add Items-->
      <!--          </ion-button>-->
      <!--        </ion-text>-->
      <!--      </ion-item>-->

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonButton, IonContent, IonItem, IonPage, IonText} from '@ionic/vue';
import {loadOrCreateUserId} from "@/util/Utils";


export default defineComponent({
  name: "HomeScreen",
  components: {IonButton, IonPage, IonText, IonItem, IonContent},
  setup() {
    loadOrCreateUserId();
  }
})
</script>

<style scoped>

ion-text {
  width: 100%;
}

</style>