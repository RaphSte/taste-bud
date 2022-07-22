<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="this.$emit('header-back-pressed')" >
          <ion-icon :icon="arrowBackOutline" />
          {{previousStep}}</ion-button>
      </ion-buttons>
      <ion-title>Setup step {{ currentStep }} / {{ targetStep }}</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { IonButtons, IonHeader, IonButton, IonToolbar } from '@ionic/vue';
import {arrowBackOutline} from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent ({

  components: { IonButtons, IonHeader, IonButton, IonToolbar},

  name: "ConfigHeader",
  props: {
    currentStep: Number,
    targetStep: Number,
    previousStep: String,
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