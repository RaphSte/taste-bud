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

      <preview-component
          v-if="stepCount === 3"
          :sessionName="sessionKey"
          :categories="categories"
      />

      <ion-button
          v-if="stepCount < 3"
          @click="stepCount++">Next
      </ion-button>
      <ion-button
          v-if="stepCount === 3"
          @click="submitSessionConfig">Submit
      </ion-button>
      <p>sessionKey: {{ sessionKey }}</p>
      <p>categories: {{ categories }}</p>

    </ion-content>
  </ion-page>
  <ion-loading
      :is-open="isOpenRef"
      message="Please wait..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
  >
  </ion-loading>
</template>

<script lang="ts">
import ConfigHeader from "@/components/ConfigHeader.vue";
import SetupInput from "@/components/SetupInput.vue";
import {defineComponent, ref} from 'vue'
import router from "@/router";
import CategorySetup from "@/components/CategorySetup.vue";
import PreviewComponent from "@/components/ConfigOverview.vue";
import {TastingSessionConfigurationModel} from "@/types/TastingSessionConfiguration";
import {createTastingSession} from "@/controller/TastingSession";
import {IonLoading} from "@ionic/vue";

export default defineComponent({
  name: "SessionConfig",
  components: {PreviewComponent, CategorySetup, SetupInput, ConfigHeader, IonLoading},
  data() {
    let categories: string[] = [];
    return {
      stepCount: 1, //starting at 1 for better readability
      sessionKey: "",
      step0Name: "Home",
      step1Name: "Naming",
      step2Name: "Diagram",
      step3Name: "Overview",
      previousStepName: "Home",
      categories,
      timeout: 0, //run forever
    }
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state: boolean) => isOpenRef.value = state;

    return {isOpenRef, setOpen}
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
        case 3:
          return this.step3Name;
        default:
          return "defaultStep"
      }
    },
    submitSessionConfig() {
      this.setOpen(true)
      let sessionConfig: TastingSessionConfigurationModel = {
        sessionKey: this.sessionKey,
        creatorId: "asd",
        categories: this.categories
      }

      createTastingSession(sessionConfig).then((sessionKey) => {
        //TODO find out why there are some old components leftover
        this.$router.push(`/config/success?tastingSessionCode=${sessionKey}`);
      }).catch((error) => {
        //TODO error handling
        console.log(error)
      });

    },
  },
})
</script>

<style scoped>

</style>