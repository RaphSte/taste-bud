<template>
  <ion-page>

    <config-header
        :previous-step-name="getStepNameByCount(stepCount-1)"
        :current-step-name="getStepNameByCount(stepCount)"
        :current-step="stepCount"
        :key="stepCount"
        :target-step="4"
        @header-back-pressed="handleHeaderBackPressed"
    />

    <ion-content>


      <Transition :name="goingForward() ? 'slide-left': 'slide-right'">


        <setup-input
            v-if="stepCount === 1"
            label-text="Your Name"
            place-holder="Alice"
            description-text="For all the participants to know that you are the one carrying out the event. This heps your participants to know they've gotten to the right event."
            :input-value="sessionKey"
            @setup-input-registered="handleSetupInput"
        />

        <setup-input
            v-else-if="stepCount === 2"
            label-text="Name Your Event"
            place-holder="WhiskeyTasing 2022"
            description-text="Every event needs a name. Give a name to your event, so that your participants know what sort of event they are dealing with!"
            :input-value="sessionKey"
            @setup-input-registered="handleSetupInput"
        />

        <category-setup
            v-else-if="stepCount === 3"
            @diagram-categories-emitted="handleCategoriesEmitted"
            :saved-categories="categories"
        />
        <preview-component
            v-else-if="stepCount === 4"
            :sessionName="sessionKey"
            :categories="categories"
        />
      </Transition>


    </ion-content>

    <ion-footer
        collapse="fade"
    >
      <ion-button
          v-if="stepCount < 4"
          expand="block"
          @click="() => {this.previousStepCount = stepCount; stepCount++}"
          class="next-button"
      >
        Next
      </ion-button>
      <ion-button
          expand="block"
          v-if="stepCount === 4"
          @click="submitSessionConfig"
          class="next-button"
      >
        Submit
      </ion-button>
    </ion-footer>

    <ion-loading
        :is-open="isOpenRef"
        message="Please wait..."
        :duration="timeout"
        @didDismiss="setOpen(false)"
    />


  </ion-page>
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
import {IonLoading, IonPage, IonContent, IonButton, IonFooter} from "@ionic/vue";

export default defineComponent({
  name: "SessionConfig",
  components: {
    PreviewComponent,
    CategorySetup,
    SetupInput,
    ConfigHeader,
    IonLoading,
    IonPage,
    IonContent,
    IonButton,
    IonFooter,
  },
  data() {
    let categories: string[] = [];
    let goingForward = (): boolean => {
      return this.previousStepCount <= this.stepCount;
    }
    return {
      stepCount: 1, //starting at 1 for better readability
      sessionKey: "",
      step0Name: "Home",
      step1Name: "Naming",
      step3Name: "Diagram",
      step4Name: "Overview",
      previousStepCount: 1,
      previousStepName: "Home",
      categories,
      timeout: 0, //run forever
      goingForward,
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
        this.previousStepCount = this.stepCount
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
          return this.step1Name;
        case 3:
          return this.step3Name;
        case 4:
          return this.step4Name;
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
        this.$router.push({
          path: `/success/${sessionKey}`
        });
        this.setOpen(false)
      }).catch((error) => {
        //TODO error handling
        this.setOpen(false)
        console.log(error)
      });

    },
  },
})
</script>

<style scoped>

.next-button {
  margin-bottom: 20px;
  margin-right: 7%;
  margin-left: 7%;
}


.slide-left-enter-active,
.slide-right-enter-active {
  transition: all 0.25s ease-out;
  transition-delay: 0.25s;

}

.slide-right-leave-active,
.slide-left-leave-active {
  transition: all 0.25s ease-out;

}

.slide-right-leave-to,
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-right-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}


</style>