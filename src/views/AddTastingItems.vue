<template>
  <ion-page>
    <header-component
        title="Add Tasting Items"
    />
    <ion-content>


      <Transition :name="!needsActiveSessionRef ? 'slide-left': 'slide-right'">
        <div
            v-if="needsActiveSessionRef"
            class="input-component-wrapper">
          <input-component
              label-text="Enter Your Code Here"
              place-holder="or press the button to copy it "
              description-text="You need to join a session to be able to add items to it. You can do it by entering your session code into the field below"
              :input-value="sessionKey"
              :icon="createOutline"
              @input-registered="handleSessionCodeInput"
          />
        </div>
      </Transition>

      <Transition :name="!needsActiveSessionRef ? 'slide-left': 'slide-right'">
        <div v-if="!needsActiveSessionRef">
          <ion-label class="ion-text-center">Not the correct session? Switch to another</ion-label>
          <ion-button
              expand="block"
              @click="setNeedsActiveSession(true)"
              class="button-primary"
          >
            Change Session
          </ion-button>
        </div>
      </Transition>


      <ion-toast
          :is-open="toastIsOpenRef"
          :message="toastMessage"
          :duration="2500"
          @didDismiss="toastSetOpen(false)"
          :color="toastColor"
      >
      </ion-toast>
    </ion-content>
    <ion-footer
        collapse="fade"
    >
      <ion-button
          expand="block"
          @click="processSessionCode(sessionKey)"
          class="button-primary"
      >
        Join
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {createOutline} from 'ionicons/icons';
import {Clipboard} from '@capacitor/clipboard';

import {fetchTastingSession} from "@/controller/TastingSession";
import {getSessionKeyFromPreferences} from "@/controller/LocalStorage";

import {IonButton, IonPage, IonToast, IonContent, IonFooter, IonLabel, IonItem} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

import InputComponent from "@/components/InputComponent.vue";


export default defineComponent({
  name: "AddTastingItems",
  components: {HeaderComponent, IonPage, IonButton, IonToast, InputComponent, IonContent, IonFooter, IonLabel},
  setup() {
    const toastIsOpenRef = ref(false);
    const toastSetOpen = (state: boolean) => toastIsOpenRef.value = state;

    let needsActiveSessionRef = ref(true);
    const setNeedsActiveSession = (state: boolean) => needsActiveSessionRef.value = state;

    let sessionKey = "";

    getSessionKeyFromPreferences().then((preferenceSessionKey: string) => {
      sessionKey = preferenceSessionKey;
      setNeedsActiveSession(false);
      console.log("preferenceSessionKey: ", preferenceSessionKey)
    })


    return {
      createOutline,
      Clipboard,
      toastIsOpenRef,
      toastSetOpen,
      toastColor: "warning",
      toastMessage: "something went wrong...",
      sessionKey,
      setNeedsActiveSession,
      needsActiveSessionRef,
    }
  },
  methods: {

    processSessionCode(sessionCode: string) {
      fetchTastingSession(sessionCode).then((sessionObject) => {
        console.log(JSON.stringify(sessionObject));
        this.displayToast();
        this.setNeedsActiveSession(false);
      }).catch((err) => {
        console.log("failed to load document: ", err)
        this.displayToast(err);
      })
    },
    displayToast(errorMessage?: string) {
      if (!errorMessage) {
        this.toastColor = "success"
        this.toastMessage = "joined successful"
      } else {
        this.toastColor = "warning"
        this.toastMessage = errorMessage;
      }
      this.toastSetOpen(true)
    },
    handleSessionCodeInput(inputValue: string) {
      this.sessionKey = inputValue;
    }
  },
});
</script>

<style scoped>

.input-component-wrapper {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
}

</style>