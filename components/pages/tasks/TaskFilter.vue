<template>
  <v-row justify="end">
    <v-col cols="12" sm="12" md="3" lg="2">
      <v-select
        id="serialFilter"
        v-model="selectedSerialFilter"
        :items="serialFilterOptions"
        label="Serial"
        outlined
      />
    </v-col>
    <v-col cols="12" sm="12" md="3" lg="2">
      <v-select
        id="tofShopIdFilter"
        v-model="selectedAdminFilter"
        :items="adminFilterOptions"
        label="Aktiv"
        outlined
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    adminFilterOptions: {
      type: Array,
      default: () => []
    },
    serialFilterOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedAdminFilter: null,
      selectedSerialFilter: null
    };
  },
  watch: {
    selectedAdminFilter: function () {
      this.$emit('tofShopIdFilter', {
        key: 'tofShopIdFilter',
        value: this.selectedAdminFilter
      });
    },
    selectedSerialFilter: function () {
      this.$emit('serialFilter', {
        key: 'serialFilter',
        value: this.selectedSerialFilter
      });
    }
  }
};
</script>
