<template>
  <v-row justify="end">
    <v-col cols="12" sm="12" md="3" lg="2">
      <v-select
        id="tofShopIdFilter"
        v-model="selectedAdminFilter"
        :items="adminFilterOptions"
        label="Aktiv"
        solo
        dense
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    adminFilterOptions: {
      type: Array
    }
  },
  data() {
    return {
      selectedAdminFilter: null
    };
  },
  watch: {
    selectedAdminFilter: function () {
      this.$emit('tofShopIdFilter', {
        key: 'tofShopIdFilter',
        value: this.selectedAdminFilter
      });
    }
  }
};
</script>
