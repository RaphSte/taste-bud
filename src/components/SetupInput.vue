<template>
  <ion-item>
    <ion-label position="stacked">{{ labelText }}</ion-label>
    <ion-input
        :placeholder="inputValue !== ''  ? inputValue :placeHolder"
        v-model="inputString"
        @input="console.log(this.inputString)"
    ></ion-input>

        <ion-button @click="this.$emit('next-pressed', {inputValue: inputString})">Next</ion-button>
  </ion-item>
</template>

<script lang="js">
export default {
  name: "SetupInput",
  props: {
    labelText: String,
    placeHolder: String,
    inputValue: String,
  },
  setup(){
    return {
      inputString: ""
    }
  }

}
</script>

<style scoped>

</style>