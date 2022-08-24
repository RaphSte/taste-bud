<template>
  <ion-page>
    <header-component
        title="Rating"
    />
    <ion-content>


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

import {getSessionKeyFromPreferences, setSessionKeyToPreferences} from "@/controller/LocalStorage";

import {IonButton, IonContent, IonFooter, IonLabel, IonPage, IonText, IonToast} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

import {extractTastingItemNamesFromObject, fetchTastingSessionAndSaveToLocalStorage} from "@/util/Utils";


export default defineComponent({
  name: "TastingScreen",
  components: {
    HeaderComponent, IonPage, IonButton, IonToast, IonContent, IonFooter
  },
  setup() {
    const toastIsOpenRef = ref(false);
    const toastSetOpen = (state: boolean) => toastIsOpenRef.value = state;

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

    });

    return {
      createOutline,
      Clipboard,
      toastIsOpenRef,
      toastSetOpen,
      toastColor: "warning",
      toastMessage: "something went wrong...",
      sessionKey,
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
  },
});
</script>

<style scoped>


</style>