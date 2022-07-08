<template>
<!--
TODO: I dont think I need to handle routing this way. I might just handle all the config stuff in one view - rm this view and change routing
-->
<!--  <ion-header>-->
<!--    <ion-toolbar>-->
<!--      <ion-title>Setup</ion-title>-->
<!--    </ion-toolbar>-->
<!--  </ion-header>-->
<!--  <ion-page>-->
<!--  </ion-page>-->
  <ion-router-outlet></ion-router-outlet>
</template>

<script lang="ts">

import {IonPage, IonRouterOutlet} from '@ionic/vue';
import {ellipse, square, triangle} from 'ionicons/icons';

export default {
  name: "ConfigPage",
  components: {IonRouterOutlet},
  setup() {
    return {
      ellipse,
      square,
      triangle,
    }
  }
}
</script>

<style scoped>

</style>