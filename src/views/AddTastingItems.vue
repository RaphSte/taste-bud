<template>
  <ion-page>
    <header-component
        title="Add Tasting Items"
    />
    <ion-content>


      <div class="ion-text-center">
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


      <ion-toast
          :is-open="toastIsOpenRef"
          :message="toastMessage"
          :duration="2500"
          @didDismiss="toastSetOpen(false)"
          :color="toastColor"
      >
      </ion-toast>
    </ion-content>
    <ion-footer collapse="fade">
      <ion-button
          expand="block"
          @click="submitTastingItems"
          class="button-primary"
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

import {IonButton, IonContent, IonFooter, IonPage, IonText, IonToast} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import InputItemListHandler from "@/components/InputItemListHandler.vue";
import {TastingSession} from "@/types/TastingSessionConfiguration";
import {extractTastingItemNamesFromObject, updateTastingItems} from "@/util/Utils";
import {useTastingSessionStore} from "@/store/tastingSessionStore";

export default defineComponent({
  name: "AddTastingItems",
  components: {InputItemListHandler, HeaderComponent, IonPage, IonButton, IonToast, IonContent, IonFooter, IonText},
  setup() {
    const toastIsOpenRef = ref(false);
    const toastSetOpen = (state: boolean) => toastIsOpenRef.value = state;


    const tastingSessionStore = useTastingSessionStore();
    const tastingSession: TastingSession = tastingSessionStore.tastingSession
    let tastingItems: string[] = extractTastingItemNamesFromObject(tastingSession);
    const tastingItemNames = ref(tastingItems);
    const setTastingItemNamesRef = (state: string[]) => tastingItemNames.value = state;


    return {
      createOutline,
      Clipboard,
      toastIsOpenRef,
      toastSetOpen,
      toastColor: "warning",
      toastMessage: "something went wrong...",
      tastingItemNames,
      setTastingItemNamesRef,
    }
  },
  data() {
    return {
      sampleTastingItems: ['my favourite whiskey', 'my favourite beer'],
      inputItemListHandlerUpdate: 0,
      inputComponentUpdate: 0,
    };
  },
  methods: {
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
      updateTastingItems(this.tastingItemNames);
      this.$router.go(-1)
    },
  },
});
</script>

<style scoped>


</style>