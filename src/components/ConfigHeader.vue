<template>
  <ion-header>
    <ion-toolbar >
      <div class="toolbar">
      <ion-buttons class="back-button-wrapper" slot="start">
        <ion-button @click="this.$emit('header-back-pressed')">
          <ion-icon :icon="arrowBackOutline"/>
          {{ previousStepName }}
        </ion-button>
      </ion-buttons>
      <ion-title class="title">{{ currentStepName }}: step {{ currentStep }} / {{ targetStep }}</ion-title>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import {IonButtons, IonHeader, IonButton, IonToolbar} from '@ionic/vue';
import {arrowBackOutline} from 'ionicons/icons';
import {defineComponent} from 'vue';

export default defineComponent({

  components: {IonButtons, IonHeader, IonButton, IonToolbar},

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


.toolbar {
  display: flex;
  justify-content: space-between;
}

.title{
  /*TODO: i dont know how to center this one because css hates me */
  text-align: center;
}

</style>