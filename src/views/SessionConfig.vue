<template>
  <ion-page>
    <config-header :current-step="stepCount" :target-step="3"/>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Set up your session</ion-title>
        </ion-toolbar>
      </ion-header>


      <setup-input
      v-if="stepCount === 0"
      label-text="Enter a session Key"
      place-holder="WhiskeyTasing 2022"
      :input-value="sessionKey"
      @next-pressed="handleSessionKeyInput"
      />

<!--      <input-->
<!--          v-if="stepCount === 0"-->
<!--          v-model="sessionKey"-->
<!--      >-->

      <p>child0: hold state in this view and change child components </p>
      <p>sessionKey: {{sessionKey}}</p>
      <button @click="stepCount--">back</button>
      <button @click="stepCount++">next</button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import ConfigHeader from "@/components/ConfigHeader.vue";
import SetupInput from "@/components/SetupInput.vue";
import {defineComponent} from 'vue'

export default defineComponent ({
  name: "SessionConfig",
  components: {SetupInput, ConfigHeader},
  data() {
    return {
      stepCount: 0,
      sessionKey: "",
    }
  },
  methods: {
    resetStepCount() {
      this.stepCount = 0;
    },
    handleSessionKeyInput(event: any){
      console.log(event)
      this.stepCount++;
      this.sessionKey = event.inputValue
    }
  },
})
</script>

<style scoped>

</style>