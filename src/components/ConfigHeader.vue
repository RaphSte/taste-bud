<template>
  <ion-header>
    <ion-toolbar>
      <div class="toolbar-content-center">
        <ion-buttons class="back-button-wrapper" slot="start">
          <ion-button @click="this.$emit('header-back-pressed')">
            <ion-icon :icon="arrowBackOutline"/>
            {{ previousStepName }}
          </ion-button>
        </ion-buttons>
        <ion-title>{{ currentStepName }}: step {{ currentStep }} / {{ targetStep }}</ion-title>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import {IonButtons, IonHeader, IonButton, IonToolbar, IonTitle, IonIcon} from '@ionic/vue';
import {arrowBackOutline} from 'ionicons/icons';
import {defineComponent} from 'vue';

export default defineComponent({

  components: {IonButtons, IonHeader, IonButton, IonToolbar, IonTitle, IonIcon},

  name: "ConfigHeader",
  props: {
    currentStep: Number,
    targetStep: Number,
    currentStepName: String,
    previousStepName: String,
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