<template>

  <div class="category-input-handler-wrapper">
    <ion-item>
      <ion-label class="ion-padding-start" position="stacked">{{ labelText }}</ion-label>
      <div class="input-wrapper ion-padding-start ion-margin-end ion-padding-end">
        <ion-input
            inputmode="text"
            :placeholder="'such as ' + sampleListItems[listItems.length % sampleListItems.length]"
            v-model="listItemName"
            :clear-input="true"
            @keyup.enter="addListItem(listItemName)"
        >
        </ion-input>
      </div>
      <ion-icon class="input-icon ion-no-margin" slot="end" color="secondary" :icon="addOutline"
                @click="addListItem(listItemName)"/>
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
} from "@ionic/vue";
import {trash, addOutline, reorderThree} from 'ionicons/icons';
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "InputItemListHandler",
  components: {IonInput, IonItem, IonIcon, IonLabel, IonReorder, IonReorderGroup},
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
    return {
      listItemName: ""
    }
  },
  methods: {
    addListItem(itemName: string) {
      this.$emit('list-item-added', itemName != undefined ? itemName : "")
      this.listItemName = ""
    },
    doReorder(event: CustomEvent) {
      event.detail.complete();
      this.$emit('list-reorder', event.detail.from, event.detail.to)
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
</style>