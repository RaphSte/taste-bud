<template>
  <ion-app>
    <!--    TODO evaluate if <ion-router-outlet /> can be replaced with vanilla router view without any mayor drawbacks-->
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transitionName">
        <component :is="Component"/>
      </transition>
    </router-view>
  </ion-app>
</template>

<script lang="ts">
import {IonApp} from '@ionic/vue';
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
  }
});
</script>