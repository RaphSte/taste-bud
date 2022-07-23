<template>
  <ion-page>
    <config-header
        :previous-step="previousStep"
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
          @next-pressed="handleSessionKeyInput"
      />


      <p>sessionKey: {{ sessionKey }}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import ConfigHeader from "@/components/ConfigHeader.vue";
import SetupInput from "@/components/SetupInput.vue";
import {defineComponent} from 'vue'
import router from "@/router";

export default defineComponent({
  name: "SessionConfig",
  components: {SetupInput, ConfigHeader},
  data() {
    return {
      stepCount: 1,
      sessionKey: "",
      step0Name: "Home",
      step1Name: "Naming",
      step2Name: "Diagram",
      previousStep: "Home"
    }
  },
  methods: {
    resetStepCount() {
      this.stepCount = 0;
    },
    handleSessionKeyInput(event: any){
      this.stepCount++;
      this.previousStep = this.getPreviousStepNameByCount(this.stepCount)
      this.sessionKey = event.inputValue
    },
    handleHeaderBackPressed() {
      if (this.stepCount === 1) {
        router.back()
      } else {
        this.stepCount--;
        this.previousStep = this.getPreviousStepNameByCount(this.stepCount)
      }
    },
    getPreviousStepNameByCount(stepCount: number): string{
      switch (stepCount){
        case 1: return this.step0Name;
        case 2: return this.step1Name;
        case 3: return this.step2Name;
        default: return "defaultStep"
      }

    }
  },
})
</script>

<style scoped>

</style>