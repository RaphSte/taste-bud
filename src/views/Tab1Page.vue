<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Setup</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">How to use</ion-title>
        </ion-toolbar>
      </ion-header>
      <p>blabla, fill in da things</p>
      <CategorySetup />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import CategorySetup from '@/components/CategorySetup.vue';

export default  defineComponent({
  name: 'Tab1Page',
  components: { CategorySetup, IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
});
</script>
