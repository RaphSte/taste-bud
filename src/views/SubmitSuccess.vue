<template>
  <ion-page>
    <ion-content>
      <ion-item>
        <ion-text>
          <h1>
            Submitted successful!
          </h1>
          <p>If you want other people to participate in the tasting, share this code with them:</p>

        </ion-text>
      </ion-item>
      <ion-item v-on:click="writeToClipboard(tastingSessionCode)">
        <ion-input
            readonly="true"
            :value="tastingSessionCode"
        ></ion-input>

        <ion-icon :icon="copy" slot="end"></ion-icon>
      </ion-item>

      <!--    <ion-text class="ion-text-center">-->
      <!--      <p>Alternatively you can use this link:</p>-->
      <!--    </ion-text>-->


      <!--    <ion-item v-on:click="writeToClipboard(shareUrl)">-->
      <!--      <ion-label>{{shareUrl}}</ion-label>-->
      <!--      <ion-icon :icon="copy" slot="end"></ion-icon>-->
      <!--    </ion-item>-->


      <ion-toast
          :is-open="toastIsOpenRef"
          message="copied to clipboard!."
          :duration="2500"
          @didDismiss="setOpen(false)"
      >
      </ion-toast>
    </ion-content>
    <ion-button  expand="block" color="primary" router-link="/">Finish</ion-button>
  </ion-page>
</template>

<script lang="ts">
import {IonButton, IonContent, IonIcon, IonInput, IonItem, IonPage, IonText, IonToast} from "@ionic/vue";
import {defineComponent, ref} from "vue";
import {Clipboard} from '@capacitor/clipboard';
import {copy} from 'ionicons/icons';

export default defineComponent({
  name: "SubmitSuccess",
  components: {IonItem, IonText, IonPage, IonToast, IonInput, IonIcon},
  props: {
    tastingSessionCode: String,
  },
  setup(props) {
    const toastIsOpenRef = ref(false);
    const setOpen = (state: boolean) => toastIsOpenRef.value = state;

    //TODO check if this still works when not deployed as pwa
    const host = window.location.host
    const shareUrl = `https://${host}/session/join/${props.tastingSessionCode}`

    return {
      toastIsOpenRef,
      setOpen,
      copy,
      shareUrl
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