<template>
  <!--  <p class="ion-text-center">Choose how many categories you'd like to use:</p>-->
  <div class="category-input-handler-wrapper">
    <ion-item>
      <ion-label position="stacked">Add a new tasting category</ion-label>
      <ion-input :placeholder="'such as ' + sampleCategoryNames[categories.length % sampleCategoryNames.length]"
                 v-model="categoryName"
                 :clear-input="true"
      >
      </ion-input>
      <ion-item slot="end">

        <!--      TODO: @keyevent enter/next prevent jumping to next input and fire addCategory-->

        <ion-button @click="addCategory(categoryName)"
                    @keyup.enter="addCategory(categoryName)"
        >
          <ion-icon color="secondary" :icon="addOutline"/>
        </ion-button>
      </ion-item>
    </ion-item>


    <!--      TODO: figure out how to add scrolling to this list and rm it from parent -->

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
            <ion-icon color="danger" :icon="trash"/>
          </ion-button>
        </ion-item>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {IonInput, IonItem, IonIcon, IonButton, IonLabel, IonItemDivider} from "@ionic/vue";
import {trash, addOutline} from 'ionicons/icons';
import {defineComponent} from "vue";

export default defineComponent({
  name: "CategoryInputHandler",
  components: {IonInput, IonItem, IonIcon, IonButton, IonLabel,  },
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
  padding-bottom: 4px;
  margin-right: 10%;
  margin-left: 10%;
}


</style>