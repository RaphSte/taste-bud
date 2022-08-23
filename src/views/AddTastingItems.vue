<template>
  <ion-page>
    <header-component
        title="Add Tasting Items"
    />
    <ion-content>


      <Transition :name="!needsActiveSessionRef ? 'slide-left': 'slide-right'">
        <input-component
            v-if="needsActiveSessionRef"
            label-text="Enter Your Code Here"
            place-holder="or press the button to copy it "
            description-text="You need to join a session to be able to add items to it. You can do it by entering your session code into the field below"
            :input-value="sessionKey"
            :icon="createOutline"
            @input-registered="handleSessionCodeInput"
        />
        <div v-else-if="!needsActiveSessionRef">
          <div class="ion-text-center">
            <ion-label>Not the correct session? Switch to another</ion-label>
            <ion-button
                expand="block"
                @click="setNeedsActiveSession(true)"
                class="button-secondary ion-color-secondary"
                color="secondary"
            >
              Change Session
            </ion-button>
            <ion-text>
              <p>Use the input below to add things to the tasting session</p>
            </ion-text>
          </div>
          <input-item-list-handler
              :key="inputItemListHandlerUpdate"
              label-text="Add things to be tasted "
              :sample-list-items="sampleTastingItems"
              :list-items="tastingItems"
              @list-item-added="handleTastingItemAdded"
              @list-item-rename="handleTastingItemRename"
              @list-item-removed="handleTastingItemRemoved"
              @list-reorder="handleTastingItemReorder"
          />
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

import {IonButton, IonContent, IonFooter, IonLabel, IonPage, IonText, IonToast} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

import InputComponent from "@/components/InputComponent.vue";
import InputItemListHandler from "@/components/InputItemListHandler.vue";


export default defineComponent({
  name: "AddTastingItems",
  components: {
    InputItemListHandler,
    HeaderComponent, IonPage, IonButton, IonToast, InputComponent, IonContent, IonFooter, IonLabel, IonText
  },
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
    });

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
  data() {
    let tastingItems: string[] = []

    return {
      sampleTastingItems: ['my favourite whiskey', 'my favourite beer'],
      tastingItems,
      inputItemListHandlerUpdate: 0,
    };
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
    },
    handleTastingItemAdded(item: string) {
      this.tastingItems.push(item)
    },
    handleTastingItemRename(item: string, index: number) {
      this.tastingItems[index] = item
    },
    handleTastingItemRemoved(index: number) {
      this.tastingItems.splice(index, 1);
    },
    handleTastingItemReorder(indexFrom: number, indexTo: number) {
      let movedElement = this.tastingItems[indexFrom];
      this.tastingItems.splice(indexFrom, 1);
      this.tastingItems.splice(indexTo, 0, movedElement);

        console.log({b: this.tastingItems.toString()})
      this.inputItemListHandlerUpdate++;
    },

  },
});
</script>

<style scoped>


</style>