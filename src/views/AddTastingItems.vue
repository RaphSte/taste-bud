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
        <ion-loading
            :is-open="submittingUpdates"
            message="submitting updated Items..."
            :duration="3000"
        />
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

import {IonButton, IonContent, IonFooter, IonLoading, IonPage, IonText, IonToast} from "@ionic/vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import InputItemListHandler from "@/components/InputItemListHandler.vue";
import {TastingItem, TastingSession} from "@/types/TastingSessionConfiguration";
import {extractTastingItemNamesFromObject, updateTastingItems} from "@/util/Utils";
import {useTastingSessionStore} from "@/store/tastingSessionStore";
import {Action, UpdateActionItem} from "@/types/UpdateActions";

export default defineComponent({
  name: "AddTastingItems",
  components: {
    InputItemListHandler,
    HeaderComponent,
    IonPage,
    IonButton,
    IonToast,
    IonContent,
    IonFooter,
    IonText,
    IonLoading
  },
  setup() {
    const toastIsOpenRef = ref(false);
    const toastSetOpen = (state: boolean) => toastIsOpenRef.value = state;

    const actions: UpdateActionItem[] = []
    const updateActions = ref(actions);
    const addUpdateAction = (item: UpdateActionItem) => updateActions.value.push(item);


    const tastingSessionStore = useTastingSessionStore();
    const tastingSession: TastingSession = tastingSessionStore.tastingSession
    let tastingItems: string[] = extractTastingItemNamesFromObject(tastingSession);
    const tastingItemNames = ref(tastingItems);
    const setTastingItemNamesRef = (state: string[]) => tastingItemNames.value = state;

    const submittingUpdates = ref(false);
    const setSubmittingUpdates = (state: boolean) => submittingUpdates.value = state;

    return {
      createOutline,
      Clipboard,
      toastIsOpenRef,
      toastSetOpen,
      toastColor: "warning",
      toastMessage: "something went wrong...",
      tastingItemNames,
      setTastingItemNamesRef,
      updateActions,
      addUpdateAction,
      submittingUpdates,
      setSubmittingUpdates,
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
      const index = this.tastingItemNames.length
      this.addUpdateAction({
        itemName: item,
        action: Action.Create,
        index: index,
        newIndex: index,
      });
    },
    handleTastingItemRename(item: string, index: number) {
      const oldName = this.tastingItemNames[index] ? this.tastingItemNames[index] : '\'empty-string\'' //deal with empty strings;
      this.tastingItemNames[index] = item
      const newName = item ? item : '\'empty-string\'' //deal with empty strings
      this.addUpdateAction({
        itemName: oldName,
        newName: newName,
        action: Action.Rename,
        index: index,
      });
    },
    handleTastingItemRemoved(index: number) {
      const name = this.tastingItemNames[index]
      this.tastingItemNames.splice(index, 1);
      this.addUpdateAction({
        itemName: name,
        action: Action.Delete,
        index: index,
      });
    },
    handleTastingItemReorder(indexFrom: number, indexTo: number) {
      //perform index shifts before array is changed//perform index shifts before array is changed
      this.queUpdateActions(indexFrom, indexTo, indexTo);

      let movedElement = this.tastingItemNames[indexFrom];
      this.tastingItemNames.splice(indexFrom, 1);
      this.tastingItemNames.splice(indexTo, 0, movedElement);
      this.inputItemListHandlerUpdate++;

      this.addUpdateAction({ //enqueue update action after shifts
        itemName: movedElement,
        action: Action.UpdateIndex,
        index: indexFrom,
        newIndex: indexTo,
      });


    },
    queUpdateActions(initialStartIndex: number, initialTargetIndex: number, indexToShift: number) {
      if (initialStartIndex == initialTargetIndex) { //failsafe
        return;
      }
      const shiftingRight = initialStartIndex > initialTargetIndex;
      const shiftModifier = shiftingRight ? 1 : -1; //determine if shift to the right or left

      let elementToShift = this.tastingItemNames[indexToShift];
      //recursion condition: as long as starting index not reached, keep shifting indexes
      if (elementToShift && indexToShift !== initialStartIndex) {
        this.addUpdateAction({
          itemName: elementToShift,
          action: Action.UpdateIndex,
          index: indexToShift,
          newIndex: indexToShift + shiftModifier,
        });
        this.queUpdateActions(initialStartIndex, initialTargetIndex, indexToShift + shiftModifier)
      }
    },

    submitTastingItems() {
      this.setSubmittingUpdates(true);
      updateTastingItems(this.updateActions).then(() => {
        this.setSubmittingUpdates(false);
        this.$router.go(-1);
      }).catch(reason => {
        this.toastSetOpen(true)
        console.error('error while submitting: ', reason);
      });
    },
  },
});
</script>

<style scoped>


</style>