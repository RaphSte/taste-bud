<template>
  <ion-page>
    <header-component
        title="Join A Tasting Session"
    />

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
        class="button-primary"
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
import {fetchTastingSession} from "@/controller/TastingSession";

import {IonButton, IonItem, IonPage, IonText, IonInput, IonLabel, IonIcon, IonToast,} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {getSessionKeyFromPreferences, setSessionKeyToPreferences} from "@/controller/LocalStorage";

export default defineComponent({
  name: "JoinDialog",
  components: {HeaderComponent, IonText, IonPage, IonButton, IonItem, IonInput, IonLabel, IonIcon, IonToast},
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
    async setSessionNameFromClipboard() {
      let result = await Clipboard.read();
      console.log(result.value)
      this.sessionCodeString = result.value;
    },
    processSessionCode(sessionCode: string) {
      fetchTastingSession(sessionCode).then((sessionObject) => {
        this.displayToast();
        console.log(sessionObject)
        setSessionKeyToPreferences(sessionCode);
        //TODO redirect to session page
      }).catch((err) => {
        console.log("failed to load document: ", err)
        this.displayToast("Failed to fetch session: " + err);
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

</style>