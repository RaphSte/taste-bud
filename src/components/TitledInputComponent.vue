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
            ref="inputRef"
            :value="inputValueRef ? inputValueRef : inputValue"
            :placeholder="inputValue !== ''  ? inputValue :placeHolder"
            v-model="inputValueRef"
            @input="handleInput"
            clear-input
        ></ion-input>
        <!--                <ion-icon class="input-icon" v-if="icon && !inputValueRef" :icon="icon" @click="setSessionNameFromClipboard"/>-->
        <ion-icon class="input-icon" v-if="icon && !inputValueRef" :icon="icon"
                  @click="this.$emit('custom-icon-clicked', inputValueRef)"/>

      </ion-item>
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {IonIcon, IonInput, IonItem, IonLabel, IonText,} from "@ionic/vue";

export default defineComponent({
  name: "TitledInputComponent",
  components: {IonInput, IonItem, IonLabel, IonText, IonIcon,}, //import component to have v-model work
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
.input-wrapper {
  margin-top: 30%;
  margin-right: 10%;
  margin-left: 10%;
}

.input-icon {
  position: absolute;
  right: 4%;
  top: 45%;
}

</style>