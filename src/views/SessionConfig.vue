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


        <titled-input-component
            v-if="stepCount === 1"
            label-text="Your Name"
            place-holder="Alice"
            description-text="For all the participants to know that you are the one carrying out the event. This heps your participants to know they've gotten to the right event."
            :input-value="creatorName"
            @input-registered="handleCreatorNameInput"
        />

        <titled-input-component
            v-else-if="stepCount === 2"
            label-text="Name Your Event"
            place-holder="WhiskeyTasing 2022"
            description-text="Every event needs a name. Give a name to your event, so that your participants know what sort of event they are dealing with!"
            :input-value="sessionName"
            @input-registered="handleSessionNameInput"
        />

        <category-setup
            v-else-if="stepCount === 3"
            @diagram-categories-emitted="handleCategoriesEmitted"
            :saved-categories="categories"
        />
        <preview-component
            v-else-if="stepCount === 4"
            :sessionName="sessionName"
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
          class="button-primary"
      >
        Next
      </ion-button>
      <ion-button
          expand="block"
          v-if="stepCount === 4"
          @click="submitSessionConfig"
          class="button-primary"
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
import {defineComponent, ref} from 'vue'
import router from "@/router";
import CategorySetup from "@/components/CategorySetup.vue";
import PreviewComponent from "@/components/ConfigOverview.vue";
import {TastingSessionConfiguration} from "@/types/TastingSessionConfiguration";
import {createTastingSessionConfig} from "@/controller/TastingSession";
import {IonButton, IonContent, IonFooter, IonLoading, IonPage} from "@ionic/vue";
import {createUserIdAndSaveToLocalStorage} from "@/util/Utils";
import TitledInputComponent from "@/components/TitledInputComponent.vue";

export default defineComponent({
  name: "SessionConfig",
  components: {
    TitledInputComponent,
    PreviewComponent,
    CategorySetup,
    ConfigHeader,
    IonLoading,
    IonPage,
    IonContent,
    IonButton,
    IonFooter,
  },
  data() {
    let catArray: string[] = [];
    const categories = ref(catArray) //no direct assignment to introduce type
    const setCategoriesRef = (state: string[]) => {categories.value = state}
    let goingForward = (): boolean => {
      return this.previousStepCount <= this.stepCount;
    }
    return {
      creatorName: "",
      stepCount: 1, //starting at 1 for better readability
      sessionName: "",
      step0Name: "Home",
      step1Name: "Naming",
      step3Name: "Diagram",
      step4Name: "Overview",
      previousStepCount: 1,
      previousStepName: "Home",
      categories,
      setCategoriesRef,
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
    handleCreatorNameInput(creatorName: string) {
      this.creatorName = creatorName;
    },
    handleSessionNameInput(sessionName: string) {
      this.sessionName = sessionName;
    },
    handleCategoriesEmitted(event: any) {
      //this.categories = event.categories;
      this.setCategoriesRef(event.categories)
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
    async submitSessionConfig() {
      this.setOpen(true)
      const creatorId = await createUserIdAndSaveToLocalStorage();
      let sessionConfig: TastingSessionConfiguration = {
        creatorId: creatorId,
        creatorName: this.creatorName,
        sessionName: this.sessionName,
        categories: this.categories,
      }

      createTastingSessionConfig(sessionConfig).then((sessionKey) => {
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


</style>