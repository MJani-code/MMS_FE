<template>
  <v-container>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="blue-grey" class="white--text" v-bind="attrs" v-on="on">
          Letöltés
          <v-icon right dark>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="downloadPoints">
          <v-list-item-title>Új pontok letöltése</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script>
export default {
  components: {},
  data: () => ({
    isModalOpen: false
  }),
  methods: {
    downloadPoints(data) {
      this.$emit('downloadPoints', data);
    }
  }
};
</script>
