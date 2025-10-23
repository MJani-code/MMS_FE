<template>
  <v-app>
    <v-main class="background">
      <v-container>
        <Notification />
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Notification from '../components/Notification.vue';

export default {
  name: 'login',
  components: { Notification },
  layout: 'login',
  props: {
    //
  },
  data() {
    return {
      //
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}

body {
  background-color: #f07b00;
}
.background {
  background-image: url('../static/vecteezy_white-background-with-orange-geometric_11171111-1.jpg');
  background-size: cover;
}
</style>
