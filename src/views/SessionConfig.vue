<template>
  <ion-page>
    <config-header
        :previous-step-name="getStepNameByCount(stepCount-1)"
        :current-step-name="getStepNameByCount(stepCount)"
        :current-step="stepCount"
        :key="stepCount"
        :target-step="3"
        @header-back-pressed="handleHeaderBackPressed"
    />
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Set up your session</ion-title>
        </ion-toolbar>
      </ion-header>

      <setup-input
          v-if="stepCount === 1"
          label-text="Name Your Event"
          place-holder="WhiskeyTasing 2022"
          :input-value="sessionKey"
          @setup-input-registered="handleSetupInput"
      />

      <category-setup
          v-if="stepCount === 2"
          @diagram-categories-emitted="handleCategoriesEmitted"
          :saved-categories="categories"
      />

      <ion-button @click="stepCount++">Next</ion-button>
      <p>sessionKey: {{ sessionKey }}</p>
      <p>categories: {{ categories }}</p>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import ConfigHeader from "@/components/ConfigHeader.vue";
import SetupInput from "@/components/SetupInput.vue";
import {defineComponent} from 'vue'
import router from "@/router";
import CategorySetup from "@/components/CategorySetup.vue";

export default defineComponent({
  name: "SessionConfig",
  components: {CategorySetup, SetupInput, ConfigHeader},
  data() {
    return {
      stepCount: 1, //starting at 1 for better readability
      sessionKey: "",
      step0Name: "Home",
      step1Name: "Naming",
      step2Name: "Diagram",
      previousStepName: "Home",
      categories: [],
    }
  },
  methods: {
    handleHeaderBackPressed() {
      if (this.stepCount === 1) {
        router.back()
      } else {
        this.stepCount--;
      }
    },
    handleSetupInput(event: any) {
      this.sessionKey = event.inputValue;
    },
    handleCategoriesEmitted(event: any) {
      this.categories = event.categories;
    },
    getStepNameByCount(stepCount: number): string {
      switch (stepCount) {
        case 0:
          return this.step0Name;
        case 1:
          return this.step1Name;
        case 2:
          return this.step2Name;
        default:
          return "defaultStep"
      }
    }
  },
})
</script>

<style scoped>

</style>