<template>
  <ion-page>
    <header-component
        title="Participate"
    />
    <ion-content>
      <Transition :name="getAnimationType()">
        <titled-input-component
            v-if="needsActiveSessionRef"
            :key="inputComponentUpdate"
            label-text="Enter Your Code Here"
            place-holder="or press the button to copy it "
            description-text="You need to join a tasting event in order to participate. You can do it by entering your session-invite code into the field below"
            :input-value="sessionKey"
            :icon="createOutline"
            @input-registered="handleSessionCodeInput"
            @custom-icon-clicked="setSessionKeyFromClipboard"
        />
        <div v-else-if="!needsActiveSessionRef">
          <div class="ion-text-center">
            <ion-label>{{ eventName }}</ion-label>
            <ion-text>
              <p>You are currently participating in >{{ creatorName }}`s&lt; event, by the name
                of '{{ eventName }}'.</p>
            </ion-text>


            <labeled-button-item
                class="button-item"
                label-text="Ready to jump right in? Go here to start your rating!"
                button-text="Rating"
                color-theme="primary"
                @button-pressed="$router.push({ path: '/session/tasting-items/' })"
            />

            <labeled-button-item
                class="button-item"
                label-text="Did you bring anything to be rated at this event? Go here to add your items!"
                button-text="Add Items"
                color-theme="primary"
                @button-pressed="$router.push({ path: '/session/add/tasting-items/' })"
            />

            <labeled-button-item
                class="change-session-button"
                label-text="Wrong event? Use this to join another one:"
                button-text="Change Event"
                color-theme="secondary"
                @button-pressed="setNeedsActiveSession(true)"
            />
          </div>
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
          @click="joinNewSession(sessionKey)"
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
import {getSessionKeyFromPreferences, setSessionKeyToPreferences} from "@/controller/LocalStorage";

import {IonButton, IonContent, IonFooter, IonLabel, IonPage, IonText, IonToast} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {TastingSession} from "@/types/TastingSessionConfiguration";
import {Animation} from "@/types/Animation";
import {
  extractTastingItemNamesFromObject,
  fetchTastingSessionAndSaveToLocalStorage,
  setSessionKeyToStore
} from "@/util/Utils";
import TitledInputComponent from "@/components/TitledInputComponent.vue";
import LabeledButtonItem from "@/components/LabeledButtonItem.vue";
import {useTastedItemsStore} from "@/store/tastedItemsStore";
import {useTastingSessionStore} from "@/store/tastingSessionStore";

export default defineComponent({
  name: "SessionScreen",
  components: {
    LabeledButtonItem,
    TitledInputComponent,
    HeaderComponent,
    IonPage,
    IonButton,
    IonToast,
    IonContent,
    IonFooter,
    IonLabel,
    IonText,
  },
  setup() {
    const toastIsOpenRef = ref(false);
    const toastSetOpen = (state: boolean) => toastIsOpenRef.value = state;

    const needsActiveSessionRef = ref(true);
    const setNeedsActiveSession = (state: boolean) => needsActiveSessionRef.value = state;


    const tastingSessionRef = ref();
    const setTastingSessionRef = (state: TastingSession) => tastingSessionRef.value = state;

    let sessionKey = ref("");
    const setSessionKeyRef = (state: string) => sessionKey.value = state;

    const creatorName = ref("");
    const setCreatorNameRef = (state: string) => creatorName.value = state;

    const eventName = ref("");
    const setEventNameRef = (state: string) => eventName.value = state;


    let tastingItems: string[] = []
    const tastingItemNames = ref(tastingItems);
    const setTastingItemNamesRef = (state: string[]) => tastingItemNames.value = state;


    const processSessionCode = (sessionKey: string) => {
      fetchTastingSessionAndSaveToLocalStorage(sessionKey).then((sessionObject: TastingSession) => {
        setTastingSessionRef(sessionObject);
        setCreatorNameRef(sessionObject.config.creatorName);
        setEventNameRef(sessionObject.config.sessionName);
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
      tastingSessionRef,
      setSessionKeyRef,
      creatorName,
      eventName,
    }
  },
  data() {
    return {
      inputComponentUpdate: 0,
      transitionEnabled: true,
    };
  },
  methods: {
    processSessionCode(sessionCode: string) {
      fetchTastingSessionAndSaveToLocalStorage(sessionCode).then((sessionObject) => {
        this.displayToast();
        this.setNeedsActiveSession(false);
        setSessionKeyToPreferences(sessionCode)
        setSessionKeyToStore(sessionCode);
        //TODO refactor?
        this.setTastingItemNamesRef(extractTastingItemNamesFromObject(sessionObject));
      }).catch((err) => {
        console.log("failed to load document: ", err)
        this.displayToast(err);
      })
    },
    joinNewSession(sessionCode: string) {
      const tastingSessionStore = useTastingSessionStore();
      tastingSessionStore.$reset();
      const store = useTastedItemsStore();
      store.$reset();
      this.processSessionCode(sessionCode);
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
    async setSessionKeyFromClipboard() {
      let result = await Clipboard.read();
      this.setSessionKeyRef(result.value);
      this.transitionEnabled = false;
      this.inputComponentUpdate++;
      setTimeout(() => {
        this.transitionEnabled = true;
      }, 25)
    },
    getAnimationType(): Animation {
      if (this.transitionEnabled) {
        return !this.needsActiveSessionRef ? Animation.SlideLeft : Animation.SlideRight;
      }
      return Animation.NoAnimation;
    },
  },
});
</script>

<style scoped>

.button-item {
  padding-top: 12%;
}

.change-session-button {
  position: fixed;
  bottom: 0;
  width: 100%;
}


</style>