<template>
  <ion-page>
    <header-component
        title="Add Tasting Items"
    />

    <div class="input-component-wrapper">
      <input-component
          label-text="Enter Your Code Here"
          place-holder="or press the button to copy it "
          description-text="You need to join a session to be able to add items to it. You can do it by entering your session code into the field below"
          :input-value="sessionKey"
          :icon="createOutline"
          @setup-input-registered="handleSetupInput"
      />
    </div>
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
import {fetchTastingSession} from "@/controller/TastingSession";

import {IonButton, IonItem, IonPage, IonText, IonInput, IonLabel, IonIcon, IonToast,} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import InputComponent from "@/components/InputComponent.vue";

export default defineComponent({
  name: "AddTastingItems",
  components: {HeaderComponent, IonText, IonPage, IonButton, IonItem,  IonToast, InputComponent},
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
      sessionKey: "",
    }
  },
  methods: {

    processSessionCode(sessionCode: string) {
      fetchTastingSession(sessionCode).then((sessionObject) => {
        console.log(JSON.stringify(sessionObject));
        this.displayToast();
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