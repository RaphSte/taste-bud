<template>
  <div>
    <ion-item>
      <ion-text>
        <h1>{{ labelText }}</h1>
        <p v-if="descriptionText">{{ descriptionText }}</p>
      </ion-text>
    </ion-item>
    <div class="input-wrapper">
      <ion-item>
        <ion-label position="stacked">{{ labelText }}</ion-label>
        <ion-input
            :value="inputValue"
            :placeholder="inputValue !== ''  ? inputValue :placeHolder"
            v-model="sessionName"
            @input="handleInput"
        ></ion-input>
        <!--    TODO: set value of ion input to input value if exists. find out why this is not working -->
      </ion-item>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonInput, IonItem, IonLabel, IonText} from "@ionic/vue";

export default defineComponent({
  name: "SetupInput",
  components: {IonInput, IonItem, IonLabel, IonText}, //import component to have v-model work
  props: {
    labelText: String,
    placeHolder: String,
    inputValue: String,
    descriptionText: String,
  },
  data() {
    return {
      rerenderTimer: 0,
    }
  },
  setup() {
    return {
      sessionName: ""
    }
  },
  methods: {
    handleInput() { //this is a workaround to deal with the performance issues of emitting events
      clearTimeout(this.rerenderTimer)
      this.rerenderTimer = setTimeout(() => {
        this.$emit('setup-input-registered', {inputValue: this.sessionName})
      }, 100);
    }
  }
})
</script>

<style scoped>
.input-wrapper {
  margin-top: 30%;
  margin-right: 10%;
  margin-left: 10%;
}
</style>