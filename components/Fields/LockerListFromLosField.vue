<template>
  <v-container class="lighten-5 mt-6">
    <v-row dense style="row-gap: 20px">
      <template v-for="locker in lockers">
        <v-col
          v-if="locker.lockerList.length > 0"
          cols="12"
          sm="3"
          md="3"
          lg="4"
          v-bind="locker"
          :key="locker.lockerStationId"
        >
          <v-card
            v-for="lockerListData in locker.lockerList"
            :key="lockerListData.lockerId"
            class="pa-2 mx-4"
            @click="viewDetails(locker)"
          >
            <v-card-title class="text-body-2">
              <v-icon left>mdi-locker</v-icon>
              {{ locker.branchName }}
            </v-card-title>
            <v-card-subtitle class="text-body-2">
              <v-icon left>mdi-map-marker-outline</v-icon>
              {{
                locker.zip + ' ' + locker.city + ', ' + locker.address
              }}</v-card-subtitle
            >
            <v-card-text>
              <div>
                <strong>lockerStationId:</strong> {{ locker.lockerStationId }}
              </div>
              <div>
                <strong>Utolsó csatlakozás:</strong>
                {{ formatDate(lockerListData.lastConnectionTimestamp) }}
              </div>
              <div>
                <strong>Verzió:</strong> {{ lockerListData.currentVersion }}
              </div>
            </v-card-text>
            <v-divider class="ma-2"></v-divider>
            <div>
              <strong>Locker állapot</strong>
            </div>
            <div class="progress-circular-container d-flex">
              <div>
                <v-progress-circular
                  :rotate="-90"
                  :size="30"
                  :width="15"
                  color="primary"
                  :value="
                    (lockerListData.compartmentList.filter(
                      (compartment) => compartment.status !== 1
                    ).length /
                      lockerListData.compartmentList.length) *
                    100
                  "
                >
                  <span style="color: black; z-index: 2"
                    >{{
                      Math.round(
                        (lockerListData.compartmentList.filter(
                          (compartment) => compartment.status !== 1
                        ).length /
                          lockerListData.compartmentList.length) *
                          100
                      )
                    }}%</span
                  >
                </v-progress-circular>
              </div>
              <div>
                <v-progress-circular
                  :rotate="360"
                  :size="30"
                  :width="5"
                  color=""
                  :value="
                    (lockerListData.compartmentList.filter(
                      (compartment) => compartment.status === 1
                    ).length /
                      lockerListData.compartmentList.length) *
                    100
                  "
                >
                  {{
                    lockerListData.compartmentList.filter(
                      (compartment) => compartment.status === 1
                    ).length
                  }}
                </v-progress-circular>
              </div>
              <div>
                <v-progress-circular
                  :rotate="360"
                  :size="30"
                  :width="5"
                  color="success"
                  :value="
                    (lockerListData.compartmentList.filter(
                      (compartment) => compartment.status === 3
                    ).length /
                      lockerListData.compartmentList.length) *
                    100
                  "
                >
                  {{
                    lockerListData.compartmentList.filter(
                      (compartment) => compartment.status === 3
                    ).length
                  }}
                </v-progress-circular>
              </div>
              <div>
                <v-progress-circular
                  :rotate="360"
                  :size="30"
                  :width="5"
                  color="error"
                  :value="
                    (lockerListData.compartmentList.filter(
                      (compartment) => compartment.status === 4
                    ).length /
                      lockerListData.compartmentList.length) *
                    100
                  "
                >
                  {{
                    lockerListData.compartmentList.filter(
                      (compartment) => compartment.status === 4
                    ).length
                  }}
                </v-progress-circular>
              </div>
            </div>
            <v-divider class="ma-2"></v-divider>
            <div>
              <strong>Műszaki állapot</strong>
            </div>
            <v-card-actions>
              <v-icon :color="lockerListData.isPassive ? 'red' : 'green'"
                >mdi-circle-medium</v-icon
              >
              <v-icon color="success" v-if="lockerListData.batteryLevel >= 91"
                >mdi-battery</v-icon
              >
              <v-icon
                color="success"
                v-else-if="lockerListData.batteryLevel >= 90"
                >mdi-battery-90</v-icon
              >
              <v-icon
                color="success"
                v-else-if="lockerListData.batteryLevel >= 80"
                >mdi-battery-80</v-icon
              >
              <v-icon
                color="success"
                v-else-if="lockerListData.batteryLevel >= 70"
                >mdi-battery-70</v-icon
              >
              <v-icon
                color="success"
                v-else-if="lockerListData.batteryLevel >= 60"
                >mdi-battery-60</v-icon
              >
              <v-icon
                color="success"
                v-else-if="lockerListData.batteryLevel >= 50"
                >mdi-battery-50</v-icon
              >
              <v-icon
                color="success"
                v-else-if="lockerListData.batteryLevel >= 40"
                >mdi-battery-40</v-icon
              >
              <v-icon
                color="success"
                v-else-if="lockerListData.batteryLevel >= 30"
                >mdi-battery-30</v-icon
              >
              <v-icon
                color="success"
                v-else-if="lockerListData.batteryLevel >= 20"
                >mdi-battery-20</v-icon
              >
              <v-icon
                color="success"
                v-else-if="lockerListData.batteryLevel >= 10"
                >mdi-battery-10</v-icon
              >
              <v-icon color="red" v-else>mdi-battery-alert</v-icon>
              <span>{{ lockerListData.batteryLevel }}%</span>
              <v-icon
                v-if="
                  checkConnectionStatus(lockerListData.lastConnectionTimestamp)
                "
                class="mx-2"
                color="red"
                >mdi-access-point-network-off</v-icon
              >
              <v-icon v-else class="mx-2" color="success"
                >mdi-access-point-network</v-icon
              >
              <v-icon
                :color="!lockerListData.privateKey1Error ? 'success' : 'error'"
                >mdi-key</v-icon
              >
            </v-card-actions>
            <v-divider class="ma-2"></v-divider>
            <LockerUtilizationField :value="locker.lockerUtilizationValues" />
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {
    LockerUtilizationField: () =>
      import('@/components/Fields/LockerUtilizationField.vue')
  },
  props: {
    lockers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    },
    checkConnectionStatus(timestamp) {
      //ha a timestamp értéke 12 órával korábbi, akkor true, egyébként false
      return timestamp < Date.now() / 1000 - 43200;
    },
    viewDetails(locker) {
      console.log(locker);
      localStorage.setItem('selectedLocker', JSON.stringify(locker));
      this.$store.dispatch('selectedLocker/setSelectedLocker', locker);
      this.$router.push({
        //az aktuális útvonalhoz hozzáadja a locker.lockerStationId-t
        path: '/admin/locker/' + locker.lockerStationId,
        params: { id: locker.lockerStationId }
      });
    }
  }
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
  cursor: pointer;
}
.v-card:hover {
  transform: scale(1.05);
}
.v-progress-circular {
  margin: 0.2rem;
}
</style>
