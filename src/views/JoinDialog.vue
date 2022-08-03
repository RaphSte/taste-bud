<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <div class="toolbar-content-center">
          <ion-buttons class="back-button-wrapper" slot="start">
            <ion-back-button default-href="/"></ion-back-button>
          </ion-buttons>
          <ion-title>Join A Tasting Session</ion-title>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-item>
      <ion-label position="floating">press here to paste your code</ion-label>
      <ion-input :key="sessionCodeString" v-model="sessionCodeString"></ion-input>

      <ion-button slot="end" color="light" @click="readFromClipboard">
        <ion-icon :icon="createOutline"/>
      </ion-button>
    </ion-item>
    <ion-item>
      <ion-text>
        <p>blah blah this is an explanation. paste your code to join the session...</p>
      </ion-text>
    </ion-item>
    <ion-button
        expand="block"
        @click="processSessionCode(sessionCodeString)"
        class="join-button"
    >
      Join
    </ion-button>
    <ion-toast
        :is-open="toastIsOpenRef"
        :message="toastMessage"
        :duration="2500"
        @didDismiss="toastSetOpen(false)"
        :color="toastColor"
    >
    </ion-toast>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {createOutline} from 'ionicons/icons';
import {Clipboard} from '@capacitor/clipboard';
import {getTastingSession} from "@/controller/TastingSession";

import {
  IonButton,
  IonItem,
  IonPage,
  IonText,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonInput,
  IonLabel,
  IonIcon,
  IonToast,
} from "@ionic/vue";

export default defineComponent({
  name: "JoinDialog",
  components: {
    IonText,
    IonPage,
    IonButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonItem,
    IonInput,
    IonLabel,
    IonIcon,
    IonToast,
  },
  setup() {
    const toastIsOpenRef = ref(false);
    const toastSetOpen = (state: boolean) => toastIsOpenRef.value = state;
    return {
      createOutline,
      Clipboard,
      sessionCodeString: "",
      toastIsOpenRef,
      toastSetOpen,
      toastColor: "warning",
      toastMessage: "something went wrong...",
    }
  },
  methods: {
    async readFromClipboard() {
      let result = await Clipboard.read();
      console.log(result.value)
      this.sessionCodeString = result.value;
    },
    processSessionCode(sessionCode: string) {
      getTastingSession(sessionCode).then((sessionObject) => {
        this.displayToast();
        //TODO redirect to session page
      }).catch((err) => {
        console.log("failed to load document: ", err)
        this.displayToast(err);
      })
    },
    displayToast(errorMessage?: string) {
      console.log("asdasd", errorMessage)
      if (!errorMessage) {
        this.toastColor = "success"
        this.toastMessage = "joined successful"
      } else {
        this.toastColor = "warning"
        this.toastMessage = errorMessage;
      }
      this.toastSetOpen(true)
    },
  },
});
</script>

<style scoped>

.join-button {
  margin-bottom: 20px;
  margin-right: 7%;
  margin-left: 7%;
}
</style>