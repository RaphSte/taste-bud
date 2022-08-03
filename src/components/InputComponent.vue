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
            :value="sessionNameRef"
            :placeholder="inputValue !== ''  ? inputValue :placeHolder"
            v-model="sessionNameRef"
            @input="handleInput"
            clear-input
        ></ion-input>
        <ion-icon class="input-icon" v-if="icon && !sessionNameRef" :icon="icon" @click="setSessionNameFromClipboard"/>
      </ion-item>
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {IonInput, IonItem, IonLabel, IonText, IonIcon,} from "@ionic/vue";
import {Clipboard} from "@capacitor/clipboard";

export default defineComponent({
  name: "InputComponent",
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
    const sessionNameRef = ref("");
    const setSessionNameRef = (state: string) => sessionNameRef.value = state;
    return {
      sessionNameRef,
      setSessionNameRef
    }
  },
  mounted() {
    if (this.inputValue) {
      this.setSessionNameRef(this.inputValue)
    }
  },
  methods: {
    handleInput() { //this is a workaround to deal with the performance issues of emitting events
      clearTimeout(this.rerenderTimer)
      this.rerenderTimer = setTimeout(() => {
        this.$emit('input-registered', this.sessionNameRef)
      }, 100);
    },
    async setSessionNameFromClipboard() {
      let result = await Clipboard.read();
      this.setSessionNameRef(result.value)
      this.handleInput();
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