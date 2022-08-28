<template>
  <ion-item>
    <ion-text class="ion-text-center">
      <ion-label class="ion-padding-bottom ion-padding-top label-text">{{ labelText }}</ion-label>
      <ion-button
          expand="block"
          @click="$emit('button-pressed')"
          :class="`button-${colorTheme} ion-color-${colorTheme}`"
          :color="colorTheme"
      >
        {{ buttonText }}
      </ion-button>
    </ion-text>
  </ion-item>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonButton, IonItem, IonLabel, IonText,} from "@ionic/vue";

export default defineComponent({
  name: "LabeledButtonItem",
  components: {IonLabel, IonButton, IonItem, IonText,},
  props: {
    labelText: String,
    buttonText: String,
    colorTheme: String,
  },
})
</script>

<style scoped>

ion-text {
  width: 100%;
}

.label-text {
  white-space: normal;
}

</style>