<template>
  <ion-item

  >
    <ion-label v-if="labelText" position="stacked">{{ labelText }}</ion-label>
    <ion-input
        :value="inputValueRef ? inputValueRef : inputValue"
        :placeholder="inputValue !== ''  ? inputValue :placeHolder"
        v-model="inputValueRef"
        @input="handleInput"
        :clear-input="clearInput"
        :inputmode="inputMode"
    />
    <ion-icon
        v-if="!clearInput || icon && !inputValueRef" :icon="icon"
        :color="iconColor"
        class="input-icon"
        :class="labelText ? 'label-positioning' : 'no-label-positioning'"
        @click="this.$emit('custom-icon-clicked', inputValueRef)"/>
  </ion-item>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {IonIcon, IonInput, IonItem, IonLabel,} from "@ionic/vue";

export default defineComponent({
  name: "InputComponent",
  components: {IonInput, IonItem, IonLabel, IonIcon,},
  props: {
    labelText: String,
    placeHolder: String,
    inputValue: String,
    icon: String,
    clearInput: {type: Boolean, default: false},
    iconColor: {type: String, default: ""},
    inputMode: {type: String, default: "text"},

  },
  data() {
    //TODO rework sanitize number
    const sanitizeNumber = (input: any): number => {
      if (this.inputMode === "numeric" && isNaN(Number(input))) {
        const sanitizedInput = input.replace(/\D/g, '')
        return sanitizedInput ? sanitizedInput : 0;
      } else {
        return input;
      }
    }
    return {
      rerenderTimer: 0,
      sanitizeNumber,
    }
  },
  setup() {
    const inputValueRef = ref("");
    const setInputValueRef = (state: any) => inputValueRef.value = state;
    return {
      inputValueRef,
      setInputValueRef,
    }
  },
  mounted() {
    if (this.inputValue) {
      this.setInputValueRef(this.sanitizeNumber(this.inputValue))
    }
  },
  methods: {
    handleInput() { //this is a workaround to deal with the performance issues of emitting events
      this.setInputValueRef(this.sanitizeNumber(this.inputValueRef));
      clearTimeout(this.rerenderTimer)
      this.rerenderTimer = setTimeout(() => {
        this.$emit('input-registered', this.sanitizeNumber(this.inputValueRef))
      }, 100);
    },
  }
})
</script>

<style scoped>

ion-input {
  z-index: 0;
}

.input-icon {
  position: absolute;
  right: 4%;
  z-index: 1;
}

.no-label-positioning {
  bottom: 25%;
}

.label-positioning {
  top: 45%;
}

</style>