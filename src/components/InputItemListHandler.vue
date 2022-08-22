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


    <div v-for="(item, index) in listItems" :key="index">
      <ion-item-divider class="ion-padding-left item-divider">
        <ion-item class="category-input-wrapper">
          <ion-label position="fixed">{{ index + 1 }}.</ion-label>
          <ion-input
              :value="item"
              @input="e => this.$emit('list-item-rename', e.target.value, index)"
              :placeholder="sampleListItems[index % sampleListItems.length]"
          ></ion-input>
          <ion-label color="primary"/>
          <ion-icon color="danger" :icon="trash" @click="this.$emit('list-item-removed', index)"/>
        </ion-item>

      </ion-item-divider>
    </div>

  </div>
</template>

<script lang="ts">
import {IonInput, IonItem, IonIcon, IonLabel, IonItemDivider} from "@ionic/vue";
import {trash, addOutline} from 'ionicons/icons';
import {defineComponent} from "vue";

export default defineComponent({
  name: "InputItemListHandler",
  components: {IonInput, IonItem, IonIcon, IonLabel, IonItemDivider},
  emits: ["list-item-added", "list-item-removed", "list-item-rename"],

  props: {
    labelText: String,
    listItems: {type: Array<string>},
    sampleListItems: {type: Array<string>},
  },
  setup() {
    return {
      addOutline,
      trash,
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

.item-divider {
  padding-right: 16px;
  background: transparent;
}
</style>