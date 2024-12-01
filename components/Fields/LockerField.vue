<template>
  <v-container class="ml-0">
    <v-row justify="space-between">
      <v-col cols="12" md="4" class="mt-0">
        <v-form ref="form">
          <v-checkbox
            v-model="checkbox"
            label="Aktív"
            class="mt-0"
          ></v-checkbox>
          <v-text-field v-model="brand" label="Brand"></v-text-field>
        </v-form>
      </v-col>

      <v-col cols="12" md="6"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    locker: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    checkbox: 0,
    allowSpaces: false,
    match: 'Foobar',
    max: 0,
    brand: ''
  }),
  mounted() {
    this.checkbox = this.locker.is_active;
    this.brand = this.locker.brand;
  },
  methods: {}
};
</script>
