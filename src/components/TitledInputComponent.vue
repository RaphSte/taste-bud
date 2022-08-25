<template>
  <div>
    <ion-item>
      <ion-text>
        <h1>{{ labelText }}</h1>
        <p v-if="descriptionText">{{ descriptionText }}</p>
      </ion-text>
    </ion-item>

    <div class="input-wrapper">
      <input-component
          :labelText="labelText"
          :input-value="inputValue"
          :placeHolder="placeHolder"
          :clear-input="true"
          :icon="icon"
          @input-registered="(value) => {this.$emit('input-registered', value)}"
          @custom-icon-clicked="(value) => {this.$emit('custom-icon-clicked', value)}"
      />
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonItem, IonText,} from "@ionic/vue";
import InputComponent from "@/components/InputComponent.vue";

export default defineComponent({
  name: "TitledInputComponent",
  components: {InputComponent, IonItem, IonText,}, //import component to have v-model work
  props: {
    labelText: String,
    placeHolder: String,
    inputValue: String,
    descriptionText: String,
    icon: String,
  },
  data() {
    return {
      rerenderTimer: 0,
    }
  },
})
</script>

<style scoped>
.input-wrapper {
  margin-top: 30%;
  margin-right: 10%;
  margin-left: 10%;
}

</style>