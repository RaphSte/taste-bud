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
              :list-items="tastingItemNames"
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
          v-if="needsActiveSessionRef"
          expand="block"
          @click="processSessionCode(sessionKey)"
          class="button-primary"
      >
        Join
      </ion-button>
      <ion-button
          v-if="!needsActiveSessionRef"
          expand="block"
          @click="submitTastingItems"
          class="button-primary"
          router-link="/"
      >
        Submit
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {createOutline} from 'ionicons/icons';
import {Clipboard} from '@capacitor/clipboard';

import {writeTastingItemsToFirestore, fetchTastingSession} from "@/controller/TastingSession";
import {getSessionKeyFromPreferences, setSessionKeyToPreferences} from "@/controller/LocalStorage";

import {IonButton, IonContent, IonFooter, IonLabel, IonPage, IonText, IonToast} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

import InputComponent from "@/components/InputComponent.vue";
import InputItemListHandler from "@/components/InputItemListHandler.vue";
import {TastingItem} from "@/types/TastingSessionConfiguration";
import {extractTastingItemNamesFromObject, fetchTastingSessionAndSaveToLocalStorage} from "@/util/Utils";


export default defineComponent({
  name: "AddTastingItems",
  components: {
    InputItemListHandler,
    HeaderComponent, IonPage, IonButton, IonToast, InputComponent, IonContent, IonFooter, IonLabel, IonText
  },
  setup() {
    const toastIsOpenRef = ref(false);
    const toastSetOpen = (state: boolean) => toastIsOpenRef.value = state;

    const needsActiveSessionRef = ref(true);
    const setNeedsActiveSession = (state: boolean) => needsActiveSessionRef.value = state;


    const tastingSessionRef = ref();
    const setTastingSessionRef = (state: any) => tastingSessionRef.value = state;

    let sessionKey = ref("");
    const setSessionKeyRef = (state: string) => sessionKey.value = state;


    let tastingItems: string[] = []
    const tastingItemNames = ref(tastingItems);
    const setTastingItemNamesRef = (state: string[]) => tastingItemNames.value = state;


    const processSessionCode = (sessionKey: string) => {
      fetchTastingSessionAndSaveToLocalStorage(sessionKey).then((sessionObject) => {
        setTastingSessionRef(sessionObject);
        let tastingItems = extractTastingItemNamesFromObject(sessionObject);
        setTastingItemNamesRef(tastingItems);
      }).catch((err) => {
        console.log("failed to load document in setup!: ", err, sessionKey)
        //TODO error handling
      })
    }


    getSessionKeyFromPreferences().then((preferenceSessionKey: string) => {
      setSessionKeyRef(preferenceSessionKey)
      processSessionCode(sessionKey.value);
      setNeedsActiveSession(false);
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
      tastingItemNames,
      setTastingItemNamesRef,
      setSessionKeyRef,
    }
  },
  data() {
    return {
      sampleTastingItems: ['my favourite whiskey', 'my favourite beer'],
      inputItemListHandlerUpdate: 0,
    };
  },
  methods: {
    processSessionCode(sessionCode: string) {
      fetchTastingSessionAndSaveToLocalStorage(sessionCode).then((sessionObject) => {
        this.displayToast();
        this.setNeedsActiveSession(false);
        setSessionKeyToPreferences(sessionCode)
        //TODO refactor?
        this.setTastingItemNamesRef(extractTastingItemNamesFromObject(sessionObject));
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
      this.setSessionKeyRef(inputValue)
    },
    handleTastingItemAdded(item: string) {
      this.tastingItemNames.push(item)
    },
    handleTastingItemRename(item: string, index: number) {
      this.tastingItemNames[index] = item
    },
    handleTastingItemRemoved(index: number) {
      this.tastingItemNames.splice(index, 1);
    },
    handleTastingItemReorder(indexFrom: number, indexTo: number) {
      let movedElement = this.tastingItemNames[indexFrom];
      this.tastingItemNames.splice(indexFrom, 1);
      this.tastingItemNames.splice(indexTo, 0, movedElement);
      this.inputItemListHandlerUpdate++;
    },
    submitTastingItems() {
      //TODO rework! this will overwrite existing ratings, if there are any
      const tastingItems: TastingItem[] = this.tastingItemNames.map((item) => {
        return {tastingItemName: item, ratings: []}
      });
      writeTastingItemsToFirestore(tastingItems, this.sessionKey);
    },
  },
});
</script>

<style scoped>


</style>