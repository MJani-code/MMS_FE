<template>
  <v-container>
    <v-row
      v-for="locker in locker.selectedLocker['lockerList']"
      :key="locker.id"
    >
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title>{{ locker.uuid }} locker részletek</v-card-title>
          <v-card-text>
            <div>
              <strong>UUID:</strong>
              {{ locker.uuid }}
            </div>
            <div>
              <strong>Rekesz száma:</strong>
              {{ locker.compartmentList.length }}
            </div>
            <div>
              <strong>Csomag mennyisége</strong>
              {{
                locker.compartmentList.filter(
                  (compartment) => compartment.status !== 1
                ).length
              }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    locker() {
      return this.$store.state.selectedLocker;
    }
  },
  created() {
    this.getLockerData();
  },
  methods: {
    getLockerData() {
      if (this.$store.state.selectedLocker.selectedLocker === null) {
        const locker = localStorage.getItem('selectedLocker');
        if (locker) {
          this.$store.dispatch(
            'selectedLocker/setSelectedLocker',
            JSON.parse(locker)
          );
        }
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    }
  }
};
</script>

<style scoped>
/* Egyedi stílusok, ha szükséges */
</style>
