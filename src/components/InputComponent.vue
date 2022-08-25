<template>
  <ion-item>
    <ion-label v-if="labelText" position="stacked">{{ labelText }}</ion-label>
    <ion-input
        :value="inputValueRef ? inputValueRef : inputValue"
        :placeholder="inputValue !== ''  ? inputValue :placeHolder"
        v-model="inputValueRef"
        @input="handleInput"
        :clear-input="clearInput"
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
  },
  data() {
    return {
      rerenderTimer: 0,
    }
  },
  setup() {
    const inputValueRef = ref("");
    const setInputValueRef = (state: string) => inputValueRef.value = state;
    return {
      inputValueRef,
      setInputValueRef,
    }
  },
  mounted() {
    if (this.inputValue) {
      this.setInputValueRef(this.inputValue)
    }
  },
  methods: {
    handleInput() { //this is a workaround to deal with the performance issues of emitting events
      clearTimeout(this.rerenderTimer)
      this.rerenderTimer = setTimeout(() => {
        this.$emit('input-registered', this.inputValueRef)
      }, 100);
    },
  }
})
</script>

<style scoped>

.input-icon {
  position: absolute;
  right: 4%;
}

.no-label-positioning {
  bottom: 25%;
}

.label-positioning {
  top: 45%;
}

</style>