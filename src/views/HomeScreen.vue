<template>
  <section>
  <header>Prepare your tasting session</header>
  <ion-button color="tertiary" expand="block" href="/config" >Prepare Tasting Session</ion-button>
  </section>

  <section>
    <header>Join someones Tasting Session</header>
  <ion-button color="primary" expand="block">Join Tasting Session</ion-button>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonButton} from '@ionic/vue';


export default defineComponent({
  name: "HomeScreen",
  components: {IonButton},
})
</script>

<style scoped>

</style>