<template>
  <v-col cols="12" sm="4" md="8" lg="8" xl="8" style="padding-top: unset">
    <v-card :style="{ width: cardWidth }">
      <v-tabs v-model="tab" background-color="primary" dark show-arrows>
        <v-tab class="tab-general"> Általános </v-tab>
        <v-tab> Ellenőrző </v-tab>
        <v-tab> Javítás </v-tab>
      </v-tabs>

      <v-tabs-slider color="teal lighten-3"></v-tabs-slider>

      <v-tabs-items v-model="tab">
        <v-tab-item class="tabitem-general">
          <v-form ref="">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="2" xl="2">
                <v-text-field
                  v-model="brand"
                  label="Brand"
                  class="px-2"
                  @change="
                    updateLockerData(brand, locker.id, 'task_lockers', 'brand')
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="2" xl="2">
                <v-text-field
                  v-model="type"
                  label="Típus"
                  class="px-2"
                  @change="
                    updateLockerData(type, locker.id, 'task_lockers', 'type')
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-checkbox
              v-model="isRegistered"
              label="Regisztrált"
              class="mt-0 px-2"
              @change="
                updateLockerData(
                  isRegistered ? 1 : 0,
                  locker.id,
                  'task_lockers',
                  'is_registered'
                )
              "
            ></v-checkbox>
            <v-checkbox
              v-model="isActive"
              label="Aktív"
              class="mt-0 px-2"
              @change="
                updateLockerData(
                  isActive ? 1 : 0,
                  locker.id,
                  'task_lockers',
                  'is_active'
                )
              "
            ></v-checkbox>
          </v-form>
        </v-tab-item>
        <v-tab-item class="tabitem-check">
          <v-form>
            <v-btn color="primary" class="mx-2" small @click="verifyLocker"
              >Állapot ellenőrző</v-btn
            ><br /><br />
            <div class="px-2">
              <v-icon :color="locker.is_registered ? 'success' : 'error'"
                >mdi-link-plus</v-icon
              >
              <v-icon :color="locker.is_active ? 'success' : 'error'"
                >mdi-check-circle</v-icon
              >
              <v-icon :color="!locker.privateKey1Error ? 'success' : 'error'"
                >mdi-key</v-icon
              >
              <v-icon :color="isConnectionLost ? 'error' : 'success'"
                >mdi-access-point-remove</v-icon
              >
              <v-icon color="success">{{ locker.currentVersion }}</v-icon>
            </div>
            <br />
            <v-list-item-title class="ml-2"
              >Utolsó csatlakozási idő:
              <span
                :class="isConnectionLost ? 'error--text' : 'success--text'"
                >{{ formattedLastConnectionTimestamp }}</span
              >
            </v-list-item-title>
            <br />
            <v-col cols="12" sm="6" md="6" lg="5" xl="5">
              <v-textarea
                v-model="fault"
                label="Hiba"
                @change="
                  updateLockerData(fault, locker.id, 'task_lockers', 'fault')
                "
                outlined
                clearable
              ></v-textarea>
            </v-col>
          </v-form>
        </v-tab-item>
        <v-tab-item class="tabitem-repair">
          <v-row no-gutters>
            <v-col cols="12" sm="6" md="6" lg="4" xl="4">
              <v-card class="ma-2">
                <v-card-text>
                  <v-form>
                    <v-select
                      v-model="selectedIssues"
                      :items="issues"
                      item-text="name"
                      item-value="id"
                      label="Hiba kiválasztása"
                      multiple
                      chips
                      clearable
                    >
                    </v-select>
                    <v-select
                      v-model="completedRepairs['interventions']"
                      :items="interventionList"
                      item-text="name"
                      item-value="id"
                      label="Beavatkozás kiválasztása"
                      multiple
                      chips
                      clearable
                    >
                    </v-select>
                    <v-select
                      v-model="completedRepairs['spareparts']"
                      :items="sparepartList"
                      item-text="name"
                      item-value="id"
                      label="Alkatrész hozzáadása"
                      multiple
                      chips
                      clearable
                    >
                    </v-select>
                    <v-textarea
                      v-model="completedRepairs['repairReport']"
                      label="Leírás"
                      counter="500"
                      auto-grow
                      outlined
                      clearable
                    ></v-textarea>
                    <div class="text-right">
                      <v-btn color="primary" class="mb-2" small>Mentés</v-btn>
                    </div>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="7" xl="7">
              <repair-reports></repair-reports>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-col>
</template>

<script>
import RepairReports from '../pages/tasks/RepairReports.vue';
export default {
  components: { RepairReports },
  props: {
    locker: {
      type: Object,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    tab: null,
    isActive: 0,
    isRegistered: 0,
    isConnectionLost: 0,
    allowSpaces: false,
    selectedIssues: [],
    max: 0,
    brand: '',
    fault: '',
    type: '',
    issues: [
      {
        id: 1,
        name: 'Issue 1'
      },
      {
        id: 2,
        name: 'Issue 2'
      },
      {
        id: 3,
        name: 'Issue 3'
      }
    ],
    sparepartList: [
      {
        id: 1,
        name: 'Sparepart 1'
      },
      {
        id: 2,
        name: 'Sparepart 2'
      },
      {
        id: 3,
        name: 'Sparepart 3'
      }
    ],
    interventionList: [
      {
        id: 1,
        name: 'Újraindítás'
      },
      {
        id: 2,
        name: 'Alkatrészcsere'
      },
      {
        id: 3,
        name: 'Egyéb'
      }
    ],
    completedRepairs: []
  }),
  computed: {
    cardWidth() {
      //kijelző szélességétől függően állítja a kártya szélességét
      return window.innerWidth < 600 ? '220px' : '100%';
    },
    formattedLastConnectionTimestamp() {
      const timestamp = this.locker.lastConnectionTimestamp;
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    }
  },
  mounted() {
    this.updateLocalLockerData();
  },
  watch: {
    locker: {
      handler() {
        this.updateLocalLockerData();
        this.checkConnectionStatus();
      },
      deep: true
    }
  },
  methods: {
    updateLockerData(value, lockerId, dbTable, dbColumn) {
      this.$emit('updateLockerData', {
        id: lockerId,
        task_id: this.taskId,
        dbTable: dbTable,
        dbColumn: dbColumn,
        value: value
      });
    },
    updateLocalLockerData() {
      this.isActive = this.locker.is_active;
      this.isRegistered = this.locker.is_registered;
      this.brand = this.locker.brand;
      this.fault = this.locker.fault;
      this.type = this.locker.type;
    },
    verifyLocker() {
      this.$emit('verifyLocker', {
        taskId: this.taskId,
        data: this.locker
      });
    },
    checkConnectionStatus() {
      const timestamp = this.locker.lastConnectionTimestamp;
      if (!timestamp) return;
      const date = new Date(timestamp * 1000);
      //Ha a timestamp a jelenlegi időpponttól több mint 12 órával kevesebb, akkor a kapcsolat megszakadt
      this.isConnectionLost = date < new Date(Date.now() - 12 * 60 * 60 * 1000);
    }
  }
};
</script>
