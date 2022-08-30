<template>

  <div class="category-input-handler-wrapper">
    <ion-item :class="{'shake': shakeInputActive}">

      <ion-label class="ion-padding-start" position="stacked">
        {{ labelText }}
      </ion-label>
      <div class="input-wrapper ion-padding-start ion-margin-end ion-padding-end">
        <ion-input
            v-if="!shakeInputActive"
            inputmode="text"
            v-model="listItemName"
            :placeholder="'such as ' + sampleListItems[listItems.length % sampleListItems.length]"
            :clear-input="true"
            @keyup.enter="addListItem(listItemName)"
        >
        </ion-input>
        <ion-text id="asd" color="danger">
          <p v-if="shakeInputActive">Input cannot be empty!</p>
        </ion-text>
        <ion-popover trigger="asd" :is-open="shakeInputActive" @didDismiss="popoverOpen = false">
          <ion-content class="ion-padding">Input cannot be empty!</ion-content>
        </ion-popover>
      </div>


      <ion-icon class="input-icon ion-no-margin ion-color ion-color-secondary" slot="end" :icon="addOutline"
                @click="addListItem(listItemName)"
                :class="{'rotate-90-degrees': rotateAddIcon}"
      />
    </ion-item>


    <ion-reorder-group @ionItemReorder="doReorder($event)" :disabled="false">
      <ion-item v-for="(item, index) in listItems" :key="index" class="category-input-wrapper">
        <ion-reorder class="ion-padding-end" slot="start">{{ index + 1 }}.
          <ion-icon class="reorder-icon" color="medium" :icon="reorderThree"/>
        </ion-reorder>
        <ion-input
            :value="item"
            @input="e => this.$emit('list-item-rename', e.target.value, index)"
            :placeholder="sampleListItems[index % sampleListItems.length]"
        ></ion-input>

        <ion-icon color="danger" :icon="trash" @click="this.$emit('list-item-removed', index)"/>
      </ion-item>
    </ion-reorder-group>

  </div>
</template>

<script lang="ts">
import {
  IonInput,
  IonItem,
  IonIcon,
  IonLabel,
  IonReorder,
  IonReorderGroup,
  IonText, IonPopover, IonContent,
} from "@ionic/vue";
import {trash, addOutline, reorderThree} from 'ionicons/icons';
import {defineComponent, ref} from "vue";
import {BoolRefSetter} from "@/types/FunctionTypes";

export default defineComponent({
  name: "InputItemListHandler",
  components: {IonInput, IonItem, IonIcon, IonLabel, IonReorder, IonReorderGroup, IonText, IonPopover, IonContent},
  emits: ["list-item-added", "list-item-removed", "list-item-rename", "list-reorder"],

  props: {
    labelText: String,
    listItems: {type: Array<string>},
    sampleListItems: {type: Array<string>},
  },
  setup() {
    return {
      addOutline,
      trash,
      reorderThree,
    }
  },
  data() {
    const rotateAddIcon = ref(false)
    const setRotateAddIcon: BoolRefSetter = (state: boolean) => {
      rotateAddIcon.value = state
    }

    const shakeInputActive = ref(false)
    const setShakeInput: BoolRefSetter = (state: boolean) => {
      shakeInputActive.value = state
    }


    return {
      listItemName: "",
      rotateAddIcon,
      setRotateAddIcon,
      shakeInputActive,
      setShakeInput,
      popoverOpen: false,
    }
  },
  methods: {
    addListItem(itemName: string) {
      if (itemName == '') {
        this.performAnimation(this.setShakeInput, 820);
        return
      }

      this.$emit('list-item-added', itemName != undefined ? itemName : "")
      this.listItemName = ""
      this.performAnimation(this.setRotateAddIcon, 250)
    },
    doReorder(event: CustomEvent) {
      event.detail.complete();
      this.$emit('list-reorder', event.detail.from, event.detail.to)
    },
    performAnimation(refSetter: BoolRefSetter, animationTime = 250) {
      refSetter(true);
      setTimeout(() => {
        refSetter(false)
      }, animationTime);
    },
  }
})
</script>

<style scoped>

.category-input-wrapper {
  width: 100%;
  padding-top: 4px;
}

.input-wrapper {
  width: 100%;
  padding-right: 10%;
}


.input-icon {
  position: absolute;
  right: 4%;
  bottom: 4px;
  font-size: xx-large;
}

.reorder-icon {
  position: absolute;
  top: 25%;
  font-size: x-large;
  padding-left: 8px
}

/*TODO styling*/
ion-popover {
  --background: rgba(40, 173, 218, 0.6);
  --backdrop-opacity: 0.6;
  --box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.6);
  --color: white;
  --width: 300px;
}

ion-popover ion-content {
  --background: rgba(40, 173, 218, 0.6);
}

ion-popover::part(backdrop) {
  background-color: rgb(6, 14, 106);
}
</style>