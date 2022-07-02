<template>
  <div id="container">
    <p>Choose how many categories you'd like to use:</p>
    <button @click="this.$emit('category-removed')"> -</button>
    <button @click="this.$emit('category-added')"> +</button>
  </div>
  <div>
    <p>category count: {{ categories.length }}</p>
    <p>category count: {{ categories }}</p>
  </div>
  <div v-for="(category, index) in categories" :key="index">
    <input
        :value="category"
        @input="e => this.$emit('category-rename', {name: e.target.value, index: index})"
    >
    <p>{{ index }}</p>
  </div>
</template>

<script lang="js">
export default {
  name: "CategoryInputHandler",
  props: {
    categories: [],
  },
}
</script>

<style scoped>

</style>