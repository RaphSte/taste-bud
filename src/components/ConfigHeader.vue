<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Setup step {{currentStep}} / {{targetStep}}</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
export default {
  name: "ConfigHeader",
  props: {
    currentStep: Number,
    targetStep: Number,
  },
}
</script>

<style scoped>

</style>