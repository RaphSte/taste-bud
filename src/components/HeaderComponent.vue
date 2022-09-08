<template>
  <ion-header>
    <ion-toolbar>
      <div class="toolbar-content-center">
        <ion-buttons class="back-button-wrapper" slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-button
            v-if="rightEdgeIcon"
            color="dark"
            fill="clear top-right-corner-button"
            @click="$emit('custom-button-pressed')"
        >
          <ion-icon :icon="rightEdgeIcon" color="dark" class=" top-right-corner-icon"></ion-icon>
        </ion-button>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import {IonBackButton, IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/vue';
import {arrowBackOutline} from 'ionicons/icons';
import {defineComponent} from 'vue';

export default defineComponent({

  components: {IonButtons, IonHeader, IonToolbar, IonTitle, IonBackButton, IonIcon, IonButton,},

  name: "HeaderComponent",
  props: {
    title: String,
    rightEdgeIcon: String,
  },
  setup() {
    return {
      arrowBackOutline,
    }
  }
})
</script>

<style scoped>
.top-right-corner-icon {
  font-size: x-large;
}

.top-right-corner-button {
  margin-left: auto;
}

</style>