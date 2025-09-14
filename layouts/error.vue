<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404" class="mt-10">
      {{ error.message }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink :to="error.urlTo"> {{ error.title }} </NuxtLink>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
