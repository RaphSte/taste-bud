<template>
  <ion-item>
    <ion-label position="stacked">{{ labelText }}</ion-label>
    <ion-input
        :value="inputValue"
        :placeholder="inputValue !== ''  ? inputValue :placeHolder"
        v-model="sessionName"
    ></ion-input>
    <!--    TODO: set value of ion input to input value if exists. find out why this is not working -->
    <ion-button @click="this.$emit('next-pressed', {inputValue: sessionName})">Next</ion-button>
  </ion-item>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonInput} from "@ionic/vue";

export default defineComponent({
  name: "SetupInput",
  components: {IonInput}, //import component to have v-model work
  props: {
    labelText: String,
    placeHolder: String,
    inputValue: String,
  },
  setup() {
    return {
      sessionName: ""
    }
  }
})
</script>

<style scoped>

</style>