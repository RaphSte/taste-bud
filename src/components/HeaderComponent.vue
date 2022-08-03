<template>
  <ion-header>
    <ion-toolbar>
      <div class="toolbar-content-center">
        <ion-buttons class="back-button-wrapper" slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import {IonButtons, IonHeader, IonToolbar, IonTitle, IonBackButton} from '@ionic/vue';
import {arrowBackOutline} from 'ionicons/icons';
import {defineComponent} from 'vue';

export default defineComponent({

  components: {IonButtons, IonHeader, IonToolbar, IonTitle, IonBackButton},

  name: "HeaderComponent",
  props: {
    title: String,
  },
  setup() {
    return {
      arrowBackOutline,
    }
  }
})
</script>

<style scoped>


</style>