<template>
  <ion-page>
    <section>
      <header>Prepare your tasting session</header>
      <ion-button color="tertiary" expand="block" router-link="/config">Prepare Tasting Session</ion-button>
    </section>

    <section>
      <header>Join someones Tasting Session</header>
      <ion-button color="primary" expand="block">Join Tasting Session</ion-button>
    </section>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonButton, IonPage} from '@ionic/vue';


export default defineComponent({
  name: "HomeScreen",
  components: {IonButton, IonPage},
})
</script>

<style scoped>

</style>