<template>
  <ion-page>
    <header-component
        :title="'Join ' + creatorName + 's session'"
    />

    <ion-content>
      <labeled-button-item
          class="button-item"
          :label-text="creatorName + ' invited you to participate in his tasting event: ' + eventName + '. Use the button to join!'"
          button-text="Join!"
          color-theme="primary"
          @button-pressed="processSessionCode(sessionId)"
      />
    </ion-content>
    <ion-loading
        :is-open="loadingSessionData"
        message="Loading, pleas wait..."
        :duration="0"
    />
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {chevronBack, chevronForward, chevronUp, close, ellipsisVertical, settings} from 'ionicons/icons';

import {IonContent, IonLoading, IonPage} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";


import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';

import 'swiper/css/pagination';
import 'swiper/css/navigation';
import LabeledButtonItem from "@/components/LabeledButtonItem.vue";
import {
  fetchTastingSessionAndSaveToLocalStorage,
  populateScoreStoreFromSession,
  setSessionKeyToStore
} from "@/util/Utils";
import {setSessionKeyToPreferences} from "@/controller/LocalStorage";
import {fetchTastingSession} from "@/controller/TastingSession";


export default defineComponent({
  name: "JoinShortcut",
  components: {
    LabeledButtonItem, HeaderComponent, IonPage, IonContent, IonLoading
  },
  props: {
    sessionId: {type: String, required: true},
  },
  setup(props) {

    const creatorName = ref('');
    const setCreatorName = (state: string) => creatorName.value = state;

    const eventName = ref('');
    const setEventName = (state: string) => eventName.value = state;

    const loadingSessionData = ref(true);
    const setLoadingSessionData = (state: boolean) => loadingSessionData.value = state;


    fetchTastingSession(props.sessionId).then(sessionObject => {
      setCreatorName(sessionObject.config.creatorName);
      setEventName(sessionObject.config.sessionName);
      setLoadingSessionData(false);
    })

    return {
      creatorName,
      eventName,
      loadingSessionData,
    }
  },
  data() {

    return {
      chevronBack,
      chevronForward,
      chevronUp,
      settings,
      ellipsisVertical,
      close,
      showSettings: false,
      showSettingsForeground: false,
    };
  },
  methods: {
    processSessionCode(sessionCode: string) {
      fetchTastingSessionAndSaveToLocalStorage(sessionCode).then((sessionObject) => {
        setSessionKeyToPreferences(sessionCode)
        setSessionKeyToStore(sessionCode);
        populateScoreStoreFromSession(sessionObject);
        //TODO refactor?
        this.$router.push({path: '/session/'});
      }).catch((err) => {
        console.log("failed to load document: ", err)
      })
    },
  },
});
</script>

<style scoped>

</style>