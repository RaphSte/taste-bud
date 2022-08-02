<template>
  <ion-page>
    <ion-item>
      <ion-text>
        <h1>
          Submitted successful!
        </h1>
        <p>If you want other people to participate in the tasting, share this code with them:</p>

      </ion-text>
    </ion-item>
    <ion-item v-on:click="writeToClipboard(tastingSessionCode)">
      <ion-label>{{ tastingSessionCode }}</ion-label>
      <ion-icon :icon="copy" slot="end"></ion-icon>
    </ion-item>

    <ion-button color="primary" router-link="/">Finish</ion-button>
    <ion-toast
        :is-open="toastIsOpenRef"
        message="copied to clipboard!."
        :duration="2500"
        @didDismiss="setOpen(false)"
    >
    </ion-toast>
  </ion-page>
</template>

<script lang="ts">
import {IonItem, IonText, IonPage, IonButton, IonToast, IonLabel, IonIcon} from "@ionic/vue";
import {defineComponent, ref} from "vue";
import {Clipboard} from '@capacitor/clipboard';
import {copyOutline, copy} from 'ionicons/icons';

export default defineComponent({
  name: "SubmitSuccess",
  components: {IonItem, IonText, IonPage, IonButton, IonToast, IonLabel, IonIcon},
  props: {
    tastingSessionCode: String,
  },
  setup() {
    const toastIsOpenRef = ref(false);
    const setOpen = (state: boolean) => toastIsOpenRef.value = state;

    return {
      toastIsOpenRef,
      setOpen,
      copy
    }
  },
  methods: {
    async writeToClipboard(text: string) {
      this.setOpen(true);
      await Clipboard.write({
        string: text
      });
    },
  },
});
</script>

<style scoped>

</style>