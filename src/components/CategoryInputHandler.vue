<template>
  <p class="ion-text-center">Choose how many categories you'd like to use:</p>
  <div v-for="(category, index) in categories" :key="index">
    <div class="category-input-wrapper">
      <ion-item>
        <ion-label position="fixed">{{ index + 1 }}.</ion-label>
        <ion-input
            :value="category"
            @input="e => this.$emit('category-rename', {name: e.target.value, index: index})"
            :placeholder="sampleCategoryNames[index % sampleCategoryNames.length]"
        ></ion-input>
        <ion-label color="primary"/>
        <ion-button color="light" @click="this.$emit('category-removed', index)">
          <ion-icon color="danger" :icon="closeOutline"/>
        </ion-button>
      </ion-item>
    </div>
  </div>
  <div id="container" class="ion-text-center">
    <ion-button shape="round" color="secondary" class="add-category-button" @click="this.$emit('category-added')">
      <ion-icon :icon="addOutline"/>
    </ion-button>
  </div>
</template>

<script lang="ts">
import {IonInput, IonItem, IonIcon} from "@ionic/vue";
import {trashOutline, closeOutline, addOutline} from 'ionicons/icons';

export default {
  name: "CategoryInputHandler",
  components: {IonInput, IonItem, IonIcon},
  props: {
    categories: [],
  },
  setup() {
    //TODO: decide weather to use trash or close outline
    return {
      trashOutline,
      closeOutline,
      addOutline,
    }
  },
  data() {
    return {
      sampleCategoryNames: ['sweet', 'salty', 'sour', 'smoky', 'flowery', 'bitter', 'funny', 'hot', 'spicy', 'okay'],
    }
  },
}
</script>

<style scoped>

.category-input-wrapper {
  padding-bottom: 4px;
  margin-right: 10%;
  margin-left: 10%;
}

.add-category-button {

}

</style>