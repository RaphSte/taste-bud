<template>
  <!--  <p class="ion-text-center">Choose how many categories you'd like to use:</p>-->
  <div class="category-input-handler-wrapper">
    <ion-item>
      <ion-label class="ion-padding-start" position="stacked">Add a new tasting category</ion-label>
      <div class="input-wrapper ion-padding-start ion-margin-end ion-padding-end">
        <ion-input
            inputmode="text"
            :placeholder="'such as ' + sampleCategoryNames[categories.length % sampleCategoryNames.length]"
            v-model="categoryName"
            :clear-input="true"
            @keyup.enter="addCategory(categoryName)"
        >
        </ion-input>
      </div>
      <ion-icon class="input-icon ion-no-margin" slot="end" color="secondary" :icon="addOutline"
                @click="addCategory(categoryName)"/>
    </ion-item>


    <!--      TODO: figure out how to add scrolling to this list and rm it from parent -->

    <div v-for="(category, index) in categories" :key="index">
      <ion-item-divider class="ion-padding-left item-divider">
        <ion-item class="category-input-wrapper">
          <ion-label position="fixed">{{ index + 1 }}.</ion-label>
          <ion-input
              :value="category"
              @input="e => this.$emit('category-rename', {name: e.target.value, index: index})"
              :placeholder="sampleCategoryNames[index % sampleCategoryNames.length]"
          ></ion-input>
          <ion-label color="primary"/>
          <ion-icon color="danger" :icon="trash" @click="this.$emit('category-removed', index)"/>
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
  name: "CategoryInputHandler",
  components: {IonInput, IonItem, IonIcon, IonLabel, IonItemDivider},
  props: {
    categories: [],
  },
  setup() {
    return {
      addOutline,
      trash,
    }
  },
  data() {
    return {
      sampleCategoryNames: ['sweet', 'salty', 'sour', 'smoky', 'flowery', 'bitter', 'funny', 'hot', 'spicy', 'okay'],
      categoryName: ""
    }
  },
  methods: {
    addCategory(categoryName: string) {
      this.$emit('category-added', categoryName != undefined ? categoryName : "")
      this.categoryName = ""
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

.item-divider{
  padding-right: 16px;
  background: transparent;
}
</style>