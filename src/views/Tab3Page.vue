<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 3</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="chart">
        <SpiderDiagram name="asdasd"/>
      </div>
      <ExploreContainer name="Tab 3 page" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import SpiderDiagram from '@/components/SpiderDiagram.vue';

export default defineComponent({
  name: 'Tab3Page',
  components: { SpiderDiagram, ExploreContainer, IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
});
</script>
